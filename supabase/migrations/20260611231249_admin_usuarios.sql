-- ============================================================
--  ADMIN: GESTIÓN DE USUARIOS (clientes + personal)
--  Solo accesible para rol ADMINISTRADOR
-- ============================================================

-- Verifica que el usuario autenticado sea administrador
CREATE OR REPLACE FUNCTION public.es_administrador()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.personal
    WHERE id_cuenta = auth.uid() AND rol = 'ADMINISTRADOR'
  );
$$;


-- Lista todos los usuarios del sistema (clientes y personal)
CREATE OR REPLACE FUNCTION public.admin_listar_usuarios()
RETURNS TABLE(
  cuenta_id     uuid,
  email         varchar,
  is_active     boolean,
  perfil_id     uuid,
  tipo          varchar,
  nombre        varchar,
  apellido      varchar,
  telefono      varchar,
  id_tipo_documento uuid,
  tipo_documento_nombre varchar,
  numero_documento     varchar,
  rol           varchar,
  fecha_registro date
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT es_administrador() THEN
    RAISE EXCEPTION 'Solo administradores pueden gestionar usuarios';
  END IF;

  RETURN QUERY
  SELECT
    c.id, c.email::varchar, c.is_active,
    cl.id, 'CLIENTE'::varchar, cl.nombre, cl.apellido, cl.telefono,
    cl.id_tipo_documento, td.nombre::varchar, cl.numero_documento,
    NULL::varchar, cl.fecha_registro
  FROM public.cuenta c
  JOIN public.cliente cl ON cl.id_cuenta = c.id
  LEFT JOIN public.tipo_documento td ON td.id = cl.id_tipo_documento

  UNION ALL

  SELECT
    c.id, c.email::varchar, c.is_active,
    p.id, 'PERSONAL'::varchar, p.nombre, NULL::varchar, p.telefono,
    NULL::uuid, NULL::varchar, NULL::varchar,
    p.rol::varchar, NULL::date
  FROM public.cuenta c
  JOIN public.personal p ON p.id_cuenta = c.id

  ORDER BY 5, 6, 7;
END;
$$;


-- Crea el perfil (cliente o personal) para una cuenta existente
-- La cuenta ya fue creada por el trigger handle_new_user al llamar a auth.signUp()
CREATE OR REPLACE FUNCTION public.admin_crear_perfil(
  p_cuenta_id         uuid,
  p_tipo              varchar,
  p_nombre            varchar,
  p_apellido          varchar DEFAULT NULL,
  p_telefono          varchar DEFAULT NULL,
  p_id_tipo_documento uuid DEFAULT NULL,
  p_numero_documento  varchar DEFAULT NULL,
  p_rol               varchar DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT es_administrador() THEN
    RAISE EXCEPTION 'Solo administradores pueden gestionar usuarios';
  END IF;

  IF p_tipo = 'CLIENTE' THEN
    INSERT INTO public.cliente (id_cuenta, nombre, apellido, telefono, id_tipo_documento, numero_documento)
    VALUES (p_cuenta_id, p_nombre, p_apellido, p_telefono, p_id_tipo_documento, p_numero_documento);

  ELSIF p_tipo = 'PERSONAL' THEN
    INSERT INTO public.personal (id_cuenta, nombre, telefono, rol)
    VALUES (p_cuenta_id, p_nombre, p_telefono, p_rol::rol)
    ON CONFLICT (id_cuenta) DO UPDATE SET
      nombre   = EXCLUDED.nombre,
      telefono = EXCLUDED.telefono,
      rol      = EXCLUDED.rol;

  ELSE
    RAISE EXCEPTION 'Tipo de usuario inválido: %', p_tipo;
  END IF;
END;
$$;


-- Actualiza el perfil de un usuario existente
CREATE OR REPLACE FUNCTION public.admin_actualizar_perfil(
  p_cuenta_id         uuid,
  p_tipo              varchar,
  p_nombre            varchar DEFAULT NULL,
  p_apellido          varchar DEFAULT NULL,
  p_telefono          varchar DEFAULT NULL,
  p_id_tipo_documento uuid DEFAULT NULL,
  p_numero_documento  varchar DEFAULT NULL,
  p_rol               varchar DEFAULT NULL,
  p_is_active         boolean DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT es_administrador() THEN
    RAISE EXCEPTION 'Solo administradores pueden gestionar usuarios';
  END IF;

  -- Actualizar estado de la cuenta
  IF p_is_active IS NOT NULL THEN
    UPDATE public.cuenta
    SET is_active = p_is_active
    WHERE id = p_cuenta_id;
  END IF;

  -- Actualizar perfil según tipo
  IF p_tipo = 'CLIENTE' THEN
    UPDATE public.cliente
    SET
      nombre       = COALESCE(p_nombre, nombre),
      apellido     = COALESCE(p_apellido, apellido),
      telefono     = COALESCE(p_telefono, telefono),
      id_tipo_documento = COALESCE(p_id_tipo_documento, id_tipo_documento),
      numero_documento   = COALESCE(p_numero_documento, numero_documento)
    WHERE id_cuenta = p_cuenta_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Cliente no encontrado';
    END IF;

  ELSIF p_tipo = 'PERSONAL' THEN
    UPDATE public.personal
    SET
      nombre   = COALESCE(p_nombre, nombre),
      telefono = COALESCE(p_telefono, telefono),
      rol      = COALESCE(p_rol::rol, rol)
    WHERE id_cuenta = p_cuenta_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Personal no encontrado';
    END IF;

  ELSE
    RAISE EXCEPTION 'Tipo de usuario inválido: %', p_tipo;
  END IF;
END;
$$;


-- Cambia el estado activo/inactivo de un usuario
CREATE OR REPLACE FUNCTION public.admin_toggle_estado(
  p_cuenta_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nuevo boolean;
BEGIN
  IF NOT es_administrador() THEN
    RAISE EXCEPTION 'Solo administradores pueden gestionar usuarios';
  END IF;

  SELECT NOT is_active INTO v_nuevo
  FROM public.cuenta
  WHERE id = p_cuenta_id;

  IF v_nuevo IS NULL THEN
    RAISE EXCEPTION 'Cuenta no encontrada';
  END IF;

  UPDATE public.cuenta
  SET is_active = v_nuevo
  WHERE id = p_cuenta_id;

  RETURN v_nuevo;
END;
$$;
