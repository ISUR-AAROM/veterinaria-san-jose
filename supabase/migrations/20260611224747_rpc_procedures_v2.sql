-- ============================================================
--  STORED PROCEDURES (RPCs) — Veterinaria San José
--  Operaciones multi-paso con transacciones atómicas
--  Ejecutar después de vet_schema.sql y rls_config.sql
-- ============================================================

-- ============================================================
--  1. REGISTRO DE CLIENTE
--  Crea cliente + mascota en una sola transacción.
--  La cuenta ya fue creada por el trigger handle_new_user
--  al llamar a supabase.auth.signUp().
-- ============================================================
CREATE OR REPLACE FUNCTION public.register_cliente(
  p_id_tipo_documento uuid,
  p_numero_documento  varchar,
  p_nombre            varchar,
  p_apellido          varchar,
  p_telefono          varchar,
  p_mascota_nombre    varchar,
  p_id_especie        uuid,
  p_fecha_nacimiento  date,
  p_id_raza           uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id_cliente uuid;
  v_id_cuenta  uuid;
BEGIN
  v_id_cuenta := auth.uid();
  IF v_id_cuenta IS NULL THEN
    RAISE EXCEPTION 'No hay sesión activa';
  END IF;

  INSERT INTO public.cliente (
    id_cuenta, id_tipo_documento, numero_documento,
    nombre, apellido, telefono
  ) VALUES (
    v_id_cuenta, p_id_tipo_documento, p_numero_documento,
    p_nombre, p_apellido, p_telefono
  )
  RETURNING id INTO v_id_cliente;

  INSERT INTO public.mascota (
    id_cliente, nombre, id_especie, id_raza, fecha_nacimiento
  ) VALUES (
    v_id_cliente, p_mascota_nombre, p_id_especie,
    p_id_raza, p_fecha_nacimiento
  );
END;
$$;


-- ============================================================
--  2. REGISTRO DE PAGO
--  Inserta pago + actualiza cita a EN_ESPERA.
-- ============================================================
CREATE OR REPLACE FUNCTION public.registrar_pago(
  p_id_cita         uuid,
  p_id_metodo_pago  uuid,
  p_monto           numeric,
  p_confirmado_por  uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.pago (
    id_cita, id_metodo_pago, monto, estado,
    confirmado_por, fecha_confirmacion
  ) VALUES (
    p_id_cita, p_id_metodo_pago, p_monto, 'CONFIRMADO',
    p_confirmado_por, CURRENT_DATE
  );

  UPDATE public.cita
  SET estado = 'EN_ESPERA'
  WHERE id = p_id_cita;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'La cita % no existe', p_id_cita;
  END IF;
END;
$$;


-- ============================================================
--  3. CANCELAR CITA
--  Marca cita como CANCELADA + desbloquea el hueco.
-- ============================================================
CREATE OR REPLACE FUNCTION public.cancelar_cita(
  p_id_cita uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id_hueco uuid;
BEGIN
  SELECT id_hueco INTO v_id_hueco
  FROM public.cita
  WHERE id = p_id_cita;

  IF v_id_hueco IS NULL THEN
    RAISE EXCEPTION 'La cita % no existe', p_id_cita;
  END IF;

  UPDATE public.cita
  SET estado = 'CANCELADA'
  WHERE id = p_id_cita;

  UPDATE public.hueco
  SET bloqueado = false, motivo_bloqueo = NULL, bloqueado_por = NULL
  WHERE id = v_id_hueco;
END;
$$;


-- ============================================================
--  4. FINALIZAR ATENCIÓN (receta + historia clínica)
--  Crea receta, sus detalles, entrada en historia clínica
--  y actualiza la cita a FINALIZADA.
--  p_medicamentos: JSON array con objetos:
--    { "medicamento": "...", "dosis": "...", "indicaciones": "..." }
-- ============================================================
CREATE OR REPLACE FUNCTION public.finalizar_atencion(
  p_id_cita         uuid,
  p_id_veterinario  uuid,
  p_diagnostico     text,
  p_tipo_entrada    varchar DEFAULT 'Consulta',
  p_observaciones   text DEFAULT NULL,
  p_firmado         boolean DEFAULT false,
  p_medicamentos    jsonb DEFAULT '[]'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_receta_id      uuid;
  v_id_mascota     uuid;
  v_hc_id          uuid;
  v_id_tipo        uuid;
  v_med            jsonb;
BEGIN
  SELECT id_mascota INTO v_id_mascota
  FROM public.cita
  WHERE id = p_id_cita;

  IF v_id_mascota IS NULL THEN
    RAISE EXCEPTION 'La cita % no existe', p_id_cita;
  END IF;

  INSERT INTO public.receta (
    id_cita, id_veterinario, diagnostico, observaciones, firmado
  ) VALUES (
    p_id_cita, p_id_veterinario, p_diagnostico, p_observaciones, p_firmado
  )
  RETURNING id INTO v_receta_id;

  IF jsonb_array_length(p_medicamentos) > 0 THEN
    FOR v_med IN SELECT * FROM jsonb_array_elements(p_medicamentos)
    LOOP
      INSERT INTO public.receta_detalle (
        id_receta, medicamento, dosis, indicaciones
      ) VALUES (
        v_receta_id,
        v_med->>'medicamento',
        COALESCE(v_med->>'dosis', 'Según indicación médica'),
        v_med->>'indicaciones'
      );
    END LOOP;
  END IF;

  INSERT INTO public.historia_clinica (id_mascota)
  VALUES (v_id_mascota)
  ON CONFLICT (id_mascota) DO UPDATE SET ultima_actualizacion = CURRENT_DATE
  RETURNING id INTO v_hc_id;

  SELECT id INTO v_id_tipo
  FROM public.tipo_entrada
  WHERE nombre = p_tipo_entrada;

  IF v_id_tipo IS NULL THEN
    SELECT id INTO v_id_tipo FROM public.tipo_entrada LIMIT 1;
  END IF;

  INSERT INTO public.entrada_historia_clinica (
    id_historia_clinica, id_cita, id_tipo_entrada,
    fecha, diagnostico, observaciones
  ) VALUES (
    v_hc_id, p_id_cita, v_id_tipo,
    CURRENT_DATE, p_diagnostico, p_observaciones
  );

  UPDATE public.cita
  SET estado = 'FINALIZADA'
  WHERE id = p_id_cita;
END;
$$;
