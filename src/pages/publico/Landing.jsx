import { HeroSection } from '../../components/landing/HeroSection'
import { ServiciosGrid } from '../../components/landing/ServiciosGrid'
import { NosotrosSection } from '../../components/landing/NosotrosSection'
import { ContactoSection } from '../../components/landing/ContactoSection'

export function Landing() {
  return (
    <>
      <HeroSection />
      <ServiciosGrid />
      <NosotrosSection />
      <ContactoSection />
    </>
  )
}
