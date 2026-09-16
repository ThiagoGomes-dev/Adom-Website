import { SEO } from '@/components/layout/SEO';
import { Hero } from '@/components/sections/Hero';
import { MarqueeBanner } from '@/components/sections/MarqueeBanner';
import { CategoryShowcase } from '@/components/sections/CategoryShowcase';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { NewArrivals } from '@/components/sections/NewArrivals';
import { HighlightQuote } from '@/components/sections/HighlightQuote';
import { Testimonials } from '@/components/sections/Testimonials';

/**
 * Home / landing page. Ordem: Hero → Faixa animada → vitrine por categoria →
 * "compre por categoria" → novidades → frase de destaque → depoimentos.
 * Cada seção se auto-oculta quando não há dados (catálogo vazio, sem categorias etc.).
 */
export function HomePage() {
  return (
    <>
      <SEO />
      <Hero />
      <MarqueeBanner />
      <CategoryShowcase />
      <CategoryGrid />
      <NewArrivals />
      <HighlightQuote />
      <Testimonials />
    </>
  );
}
