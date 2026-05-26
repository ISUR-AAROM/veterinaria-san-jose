export function IconStethoscope({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#FFF3EB" />
      <path d="M18 14C18 11.7909 19.7909 10 22 10C24.2091 10 26 11.7909 26 14V18C26 20.2091 24.2091 22 22 22C19.7909 22 18 20.2091 18 18V14Z" stroke="#C2570F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 22V26C22 29.3137 24.6863 32 28 32H30" stroke="#C2570F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="30" cy="34" r="3" stroke="#C2570F" strokeWidth="1.8" fill="#FFDCC5" />
      <path d="M33 34H36" stroke="#C2570F" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22 14H18M22 18H18" stroke="#C2570F" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconSyringe({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#E8F5E9" />
      <path d="M30 12L36 18" stroke="#4A7C59" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M24 18L30 12" stroke="#4A7C59" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 24L24 18" stroke="#4A7C59" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 26L18 24" stroke="#4A7C59" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 24L14 28" stroke="#4A7C59" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 34L28 26" stroke="#4A7C59" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="19" y="27" width="10" height="10" rx="2" stroke="#4A7C59" strokeWidth="1.8" fill="#C8E6C9" />
      <path d="M23 27V37M26 27V37" stroke="#4A7C59" strokeWidth="1.2" />
    </svg>
  )
}

export function IconScalpel({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#F3E5F5" />
      <path d="M14 36L28 22" stroke="#7B1FA2" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M32 18L34 16" stroke="#7B1FA2" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M28 22L32 18" stroke="#7B1FA2" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M28 22L34 28" stroke="#7B1FA2" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 32L14 36" stroke="#7B1FA2" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M26 24L34 32" stroke="#7B1FA2" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2 2" />
      <circle cx="34" cy="34" r="2" fill="#CE93D8" />
      <circle cx="14" cy="36" r="2" fill="#CE93D8" />
    </svg>
  )
}

export function IconGrooming({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#E3F2FD" />
      <ellipse cx="20" cy="26" rx="8" ry="6" stroke="#1565C0" strokeWidth="1.8" fill="#BBDEFB" />
      <circle cx="20" cy="23" r="3" fill="#1565C0" />
      <path d="M12 26C10 28 10 32 14 34" stroke="#1565C0" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M28 26C30 28 30 32 26 34" stroke="#1565C0" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 32C18 33 20 34 23 34C26 34 28 33 29 32" stroke="#1565C0" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M30 18L34 14M32 22L36 18" stroke="#1565C0" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="24" r="1.5" fill="#1565C0" />
      <circle cx="28" cy="24" r="1.5" fill="#1565C0" />
    </svg>
  )
}

const iconMap = {
  'Consulta General': IconStethoscope,
  'Vacunación': IconSyringe,
  'Cirugía Menor': IconScalpel,
  'Baño y Estética': IconGrooming,
}

export function ServicioIcon({ nombre, className = 'w-20 h-20' }) {
  const Icon = iconMap[nombre] || IconStethoscope
  return <Icon className={className} />
}
