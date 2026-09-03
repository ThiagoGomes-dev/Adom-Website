import { ArrowRight } from 'lucide-react';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { products as demoProducts } from '@/data/demo/products';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ProductGrid } from '@/components/catalog/ProductGrid';

/** Vitrine de produtos em destaque na home — leva para o catálogo completo. */
export function FeaturedProducts() {
  const config = useCompanyConfig();
  if (!config.features.showCatalog || !config.pages.products) return null;

  const featured = demoProducts.filter((p) => p.featured).slice(0, 8);
  if (!featured.length) return null;

  return (
    <Section tone="alt">
      <SectionHeading eyebrow="Catálogo" title="Produtos em destaque" description="Uma seleção do que há de melhor por aqui." />
      <div className="mt-12">
        <ProductGrid products={featured} />
      </div>
      <div className="mt-10 flex justify-center">
        <Button to="/produtos" variant="outline" icon={<ArrowRight size={16} />} iconPosition="right">
          Ver catálogo completo
        </Button>
      </div>
    </Section>
  );
}
