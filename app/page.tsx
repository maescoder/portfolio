import { HeroSection } from '@/components/hero-section'
import { NavIndexSection } from '@/components/nav-index-section'
import { AboutSection } from '@/components/about-section'
import { VendingMachineSection } from '@/components/vending-machine-section'
import { ProjectsSection } from '@/components/projects-section'
import { BestWorkSection } from '@/components/best-work-section'
import { CvCloudSection } from '@/components/cv-cloud-section'
import { ContactSection } from '@/components/contact-section'
import { FunEffects } from '@/components/fun-effects'

export default function Home() {
  return (
    <main>
      <FunEffects />
      <HeroSection />
      <NavIndexSection />
      <AboutSection />
      <VendingMachineSection />
      <ProjectsSection />
      <BestWorkSection />
      <CvCloudSection />
      <ContactSection />
    </main>
  )
}
