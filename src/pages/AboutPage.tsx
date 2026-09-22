import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { SEO } from '@/components/layout/SEO';
import { AboutSection } from '@/components/sections/AboutSection';
import { Testimonials } from '@/components/sections/Testimonials';
import { Location } from '@/components/sections/Location';
import { CTASection } from '@/components/sections/CTASection';
import { Section } from '@/components/ui/Section';

export function AboutPage() {
  const config = useCompanyConfig();

  return (
    <>
      <SEO title="Sobre" description={config.aboutText?.split('\n\n')[0]?.slice(0, 155)} />
      <Section tone="alt" className="!pb-0">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Nossa história</span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Sobre a {config.businessName}
          </h1>
        </div>
      </Section>
      <AboutSection />
      <Testimonials />
      <Location />
      <CTASection />
    </>
  );
}
