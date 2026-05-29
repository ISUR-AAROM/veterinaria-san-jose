import { useEffect, useRef, useState } from 'react'

export function useReveal(animation = 'animate-fade-in-up') {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(ref.current)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}
