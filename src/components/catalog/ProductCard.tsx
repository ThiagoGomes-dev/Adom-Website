import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import type { Product } from '@/types';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { formatPrice, discountPercent } from '@/lib/currency';
import { LazyImage } from '@/components/ui/LazyImage';
import { Badge } from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

/** Card de produto reutilizável — usado na grade de catálogo e em "relacionados". */
export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const config = useCompanyConfig();
  const discount = discountPercent(product.price, product.promoPrice);
  const displayPrice = product.promoPrice ?? product.price;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="relative">
        <Link to={`/produtos/${product.slug}`} className="block" tabIndex={-1} aria-hidden="true">
          <LazyImage
            src={product.images[0]}
            alt={product.name}
            aspect="square"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {product.featured && <Badge tone="dark">Destaque</Badge>}
          {config.features.showPromotions && discount && <Badge tone="accent">-{discount}%</Badge>}
          {!product.available && <Badge tone="muted">Indisponível</Badge>}
        </div>

        {onQuickView && product.available && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-ink opacity-0 shadow-soft transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <Eye size={14} /> Ver rápido
          </button>
        )}
      </div>

      <Link to={`/produtos/${product.slug}`} className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-ink line-clamp-1 sm:text-base">{product.name}</h3>
        {product.shortDescription && (
          <p className="mt-1 flex-1 text-xs text-ink-soft line-clamp-2 sm:text-sm">{product.shortDescription}</p>
        )}

        {config.features.showPrices && (
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-base font-bold text-ink sm:text-lg">{formatPrice(displayPrice)}</span>
            {product.promoPrice && (
              <span className="text-xs text-ink-soft line-through">{formatPrice(product.price)}</span>
            )}
          </div>
        )}
      </Link>
    </article>
  );
}
