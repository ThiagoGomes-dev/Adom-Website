import { ArrowRight } from 'lucide-react';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { useCatalog } from '@/context/CatalogContext';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ProductGrid } from '@/components/catalog/ProductGrid';

const MAX_ITEMS = 10;

/** Vitrine de "novidades" na home — o admin já devolve os produtos mais recentes primeiro. */
export function NewArrivals() {
  const config = useCompanyConfig();
  const { products } = useCatalog();
  if (!config.features.showCatalog || !config.pages.products) return null;

  const newest = products.slice(0, MAX_ITEMS);
  if (!newest.length) return null;

  return (
    <Section tone="alt">
      <SectionHeading eyebrow="Novidades" title="Chegou agora" description="As últimas peças adicionadas ao catálogo." />
      <div className="mt-6">
        <ProductGrid products={newest} />
      </div>
      <div className="mt-6 flex justify-center">
        <Button to="/produtos" variant="outline" icon={<ArrowRight size={16} />} iconPosition="right">
          Ver catálogo completo
        </Button>
      </div>
    </Section>
  );
}
