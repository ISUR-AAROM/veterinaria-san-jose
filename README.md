# Veterinaria San Jose

Sistema web para la gestion de citas, mascotas, historia clinica y pagos de una clinica veterinaria de sede unica. Incluye un portal publico para clientes y un panel interno para el personal.

## Stack

- **Frontend:** React 19 + Vite, React Router DOM v7, Tailwind CSS v4
- **Backend:** Supabase (Auth, PostgreSQL, Realtime)
- **Diseno:** Inter (Google Fonts), paleta personalizada (naranja tierra, verde salvia, blanco calido)

## Alcance Fase 1

- Landing page con secciones de servicios, nosotros y contacto.
- Flujos de login y registro (clientes) con stepper.
- Acceso de personal con validacion en tabla `personal`.
- Paneles base para cliente y admin con navegacion.
- Catalogos y datos de referencia listos para integracion con Supabase.

## Estructura de rutas

| Ruta | Descripcion |
|------|-------------|
| `/` | Landing page |
| `/login` | Login clientes |
| `/registro` | Registro clientes |
| `/cliente/mascotas` | Mis mascotas |
| `/cliente/mascotas/nueva` | Nueva mascota |
| `/cliente/citas` | Mis citas |
| `/cliente/citas/nueva` | Reservar cita |
| `/admin/login` | Login personal |
| `/admin/agenda` | Agenda del dia |
| `/admin/clientes` | Listado de clientes |
| `/admin/catalogos/*` | CRUD de catalogos |

## Despliegue local

```bash
npm install
npm run dev
```

Configurar variables de entorno en `.env`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Cuentas de prueba

| Rol | Email | Password | Acceso |
|-----|-------|----------|--------|
| Administrador | admin@sanjose.pe | admin123 | /admin/login |
| Veterinario | veterinario1@sanjose.pe | veterinario123 | /admin/login |
| Asistente | asistente1@sanjose.pe | asistente123 | /admin/login |
| Cliente | client1@sanjose.pe | password123 | /login |

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Proyecto

Desarrollado para la Clinica Veterinaria San Jose.
