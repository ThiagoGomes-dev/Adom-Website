import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { useCart } from '@/context/CartContext';
import { useProductSelection } from '@/hooks/useProductSelection';
import { formatPrice, discountPercent } from '@/lib/currency';
import { cn } from '@/lib/cn';
import { LazyImage } from '@/components/ui/LazyImage';
import { Badge } from '@/components/ui/Badge';

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();

const AUTO_CYCLE_INTERVAL_MS = 4500;

/** Alterna automaticamente entre índices de imagem enquanto habilitado (pausa no hover ou após seleção manual). */
function useAutoCycle(length: number, enabled: boolean): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!enabled || length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % length), AUTO_CYCLE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [enabled, length]);

  return index;
}

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

/** Card de produto reutilizável — usado na grade de catálogo e em "relacionados". */
export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const config = useCompanyConfig();
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [colorTouched, setColorTouched] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { selectedByGroupId, selectVariant, selectedVariants, activeImage } = useProductSelection(product);

  const discount = discountPercent(product.price, product.promoPrice);
  const displayPrice = product.promoPrice ?? product.price;

  // grupo de "cor" ganha um seletor em bolinhas; os demais (tamanho, etc.) em pílulas de texto
  const colorGroup = product.variants?.find((g) => normalize(g.name).includes('cor'));
  const otherGroups = product.variants?.filter((g) => g.id !== colorGroup?.id) ?? [];

  // com mais de uma foto, o card fica passando entre elas sozinho — para de
  // girar assim que o cliente escolhe uma cor (a foto passa a seguir a escolha)
  const autoIndex = useAutoCycle(product.images.length, !colorTouched && !hovered);
  const displayImage = colorTouched
    ? product.images[activeImage] ?? product.images[0]
    : product.images[autoIndex] ?? product.images[0];

  const handleSelectVariant = (e: React.MouseEvent, groupId: string, optionLabel: string) => {
    e.preventDefault();
    e.stopPropagation();
    selectVariant(groupId, optionLabel);
    if (groupId === colorGroup?.id) setColorTouched(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ product, selectedVariants, quantity: 1 });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <Link to={`/produtos/${product.slug}`} className="block" tabIndex={-1} aria-hidden="true">
          {product.images.length > 1 ? (
            <div className="relative aspect-square overflow-hidden bg-surface-alt">
              <AnimatePresence initial={false}>
                <motion.img
                  key={displayImage}
                  src={displayImage}
                  alt={product.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, ease: 'easeInOut' }}
                />
              </AnimatePresence>
            </div>
          ) : (
            <LazyImage
              src={product.images[0]}
              alt={product.name}
              aspect="square"
              className="transition-transform duration-500 group-hover:scale-105"
            />
          )}
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

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link to={`/produtos/${product.slug}`} className="flex flex-1 flex-col">
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

        {colorGroup && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {colorGroup.options.map((opt) => {
              const active = selectedByGroupId[colorGroup.id] === opt.label;
              return (
                <button
                  key={opt.id}
                  type="button"
                  title={opt.label}
                  aria-label={opt.label}
                  aria-pressed={active}
                  onClick={(e) => handleSelectVariant(e, colorGroup.id, opt.label)}
                  className={cn(
                    'h-5 w-5 rounded-full border border-black/10 transition',
                    active && 'ring-2 ring-accent ring-offset-1 ring-offset-surface',
                  )}
                  style={{ backgroundColor: opt.meta || 'rgb(var(--color-surface-alt))' }}
                />
              );
            })}
          </div>
        )}

        {otherGroups.map((group) => (
          <div key={group.id} className="mt-2 flex flex-wrap items-center gap-1.5">
            {group.options.map((opt) => {
              const active = selectedByGroupId[group.id] === opt.label;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={active}
                  onClick={(e) => handleSelectVariant(e, group.id, opt.label)}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[11px] font-semibold transition',
                    active ? 'bg-ink text-white' : 'bg-ink/5 text-ink-soft hover:bg-ink/10',
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        ))}

        {product.available && (
          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              'mt-3 inline-flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition-colors',
              justAdded ? 'bg-accent/10 text-accent' : 'bg-ink text-white hover:bg-ink/90',
            )}
          >
            {justAdded ? (
              <>
                <Check size={14} /> Adicionado
              </>
            ) : (
              <>
                <ShoppingBag size={14} /> Adicionar à sacola
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}
