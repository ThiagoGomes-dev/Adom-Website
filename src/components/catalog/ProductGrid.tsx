import { useState } from 'react';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui/Button';
import { Stagger, StaggerItem } from '@/components/motion/reveal';

interface ProductGridProps {
  products: Product[];
  onClearFilters?: () => void;
}

/** Grade de produtos altamente reutilizável — usada no catálogo e em "destaques". */
export function ProductGrid({ products, onClearFilters }: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (!products.length) {
    return (
      <EmptyState
        title="Nenhum produto encontrado"
        description="Tente ajustar a busca ou os filtros selecionados."
        action={
          onClearFilters ? (
            <Button variant="secondary" size="sm" onClick={onClearFilters}>
              Limpar filtros
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <>
      <Stagger className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4" amount={0.05} staggerDelay={0.06}>
        {products.map((product) => (
          <StaggerItem key={product.id} effect="up" duration={0.5}>
            <ProductCard product={product} onQuickView={setQuickViewProduct} />
          </StaggerItem>
        ))}
      </Stagger>

      <ProductModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
