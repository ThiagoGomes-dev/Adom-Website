import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SortOption } from '@/types';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { useDebounce } from '@/hooks/useDebounce';
import { products as demoProducts } from '@/data/demo/products';
import { categories as demoCategories } from '@/data/demo/categories';
import { SEO } from '@/components/layout/SEO';
import { Section, SectionHeading } from '@/components/ui/Section';
import { SearchBar } from '@/components/catalog/SearchBar';
import { CategoryFilter } from '@/components/catalog/CategoryFilter';
import { SortSelect } from '@/components/catalog/SortSelect';
import { ProductGrid } from '@/components/catalog/ProductGrid';

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export function ProductsPage() {
  const config = useCompanyConfig();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('q') ?? '';
  const category = searchParams.get('categoria');
  const sort = (searchParams.get('ordenar') as SortOption) ?? 'relevance';
  const debouncedSearch = useDebounce(search, 250);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    let list = [...demoProducts];

    if (category) list = list.filter((p) => p.category === category);

    if (debouncedSearch.trim()) {
      const q = normalize(debouncedSearch);
      list = list.filter((p) => normalize(p.name).includes(q) || normalize(p.description).includes(q));
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => (a.promoPrice ?? a.price) - (b.promoPrice ?? b.price));
        break;
      case 'price-desc':
        list.sort((a, b) => (b.promoPrice ?? b.price) - (a.promoPrice ?? a.price));
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
        break;
      case 'newest':
        list.reverse();
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    // produtos indisponíveis sempre por último, sem sumir da vitrine
    list.sort((a, b) => Number(b.available) - Number(a.available));

    return list;
  }, [category, debouncedSearch, sort]);

  const clearFilters = () => setSearchParams({}, { replace: true });

  if (!config.features.showCatalog) return null;

  return (
    <>
      <SEO title="Produtos" description="Confira o catálogo completo e fale conosco pelo WhatsApp." />
      <Section tone="alt" className="!pb-8">
        <SectionHeading eyebrow="Catálogo" title="Nossos produtos" align="left" className="mx-0" />
      </Section>

      <Section className="!pt-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <SearchBar value={search} onChange={(v) => setParam('q', v || null)} />
            </div>
            <SortSelect value={sort} onChange={(v) => setParam('ordenar', v === 'relevance' ? null : v)} />
          </div>

          <CategoryFilter categories={demoCategories} active={category} onChange={(v) => setParam('categoria', v)} />
        </div>

        <p className="mt-6 text-sm text-ink-soft">
          {filtered.length} {filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>

        <div className="mt-4">
          <ProductGrid products={filtered} onClearFilters={clearFilters} />
        </div>
      </Section>
    </>
  );
}
