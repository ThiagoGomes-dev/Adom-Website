import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { SEO } from '@/components/layout/SEO';
import { Hero } from '@/components/sections/Hero';
import { MarqueeBanner } from '@/components/sections/MarqueeBanner';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { HighlightQuote } from '@/components/sections/HighlightQuote';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { Gallery } from '@/components/sections/Gallery';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTASection } from '@/components/sections/CTASection';

/**
 * Home / landing page. A ordem das seções segue o fluxo recomendado para
 * conversão (Hero → Faixa animada → Produtos/Serviços → Frase de destaque →
 * Galeria → Depoimentos → CTA).
 * Cada seção se auto-oculta quando a feature correspondente está desligada
 * em `companyConfig`.
 */
export function HomePage() {
  const config = useCompanyConfig();

  return (
    <>
      <SEO />
      <Hero />
      <MarqueeBanner />
      <FeaturedProducts />
      <HighlightQuote />
      <ServicesSection limit={3} />
      {!config.pages.gallery && <Gallery />}
      <Testimonials />
      <CTASection />
    </>
  );
}
