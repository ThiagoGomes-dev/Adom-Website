import { SEO } from '@/components/layout/SEO';
import { Hero } from '@/components/sections/Hero';
import { MarqueeBanner } from '@/components/sections/MarqueeBanner';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { ProductsCarousel } from '@/components/sections/ProductsCarousel';
import { NewArrivals } from '@/components/sections/NewArrivals';
import { HighlightQuote } from '@/components/sections/HighlightQuote';
import { Testimonials } from '@/components/sections/Testimonials';
import { AboutSection } from '@/components/sections/AboutSection';

/**
 * Home / landing page. Ordem: Hero → Faixa animada → "compre por categoria" →
 * carrossel de produtos → novidades → frase de destaque → depoimentos → sobre.
 * Cada seção se auto-oculta quando não há dados (catálogo vazio, sem categorias etc.).
 */
export function HomePage() {
  return (
    <>
      <SEO />
      <Hero />
      <MarqueeBanner />
      <CategoryGrid />
      <ProductsCarousel />
      <NewArrivals />
      <HighlightQuote />
      <Testimonials />
      <AboutSection />
    </>
  );
}
