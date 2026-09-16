import { ArrowRight } from 'lucide-react';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { useCatalog } from '@/context/CatalogContext';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ProductGrid } from '@/components/catalog/ProductGrid';

const MAX_PER_CATEGORY = 10;

/**
 * Uma vitrine por categoria cadastrada no admin (até 10 produtos cada) — a
 * home passa a refletir automaticamente as categorias reais, sem precisar
 * editar código quando uma categoria nova (Short, Tênis, Boné...) for criada.
 */
export function CategoryShowcase() {
  const config = useCompanyConfig();
  const { categories, products } = useCatalog();
  if (!config.features.showCatalog || !config.pages.products) return null;

  const rows = categories
    .map((category) => ({
      category,
      items: products.filter((p) => p.category === category.slug).slice(0, MAX_PER_CATEGORY),
    }))
    .filter((row) => row.items.length > 0);

  if (!rows.length) return null;

  return (
    <>
      {rows.map(({ category, items }, i) => (
        <Section key={category.id} tone={i % 2 === 0 ? 'surface' : 'alt'}>
          <SectionHeading eyebrow="Categoria" title={category.name} align="left" className="mx-0" />
          <div className="mt-6">
            <ProductGrid products={items} />
          </div>
          <div className="mt-6 flex justify-center">
            <Button
              to={`/produtos?categoria=${category.slug}`}
              variant="outline"
              icon={<ArrowRight size={16} />}
              iconPosition="right"
            >
              Ver tudo em {category.name}
            </Button>
          </div>
        </Section>
      ))}
    </>
  );
}
