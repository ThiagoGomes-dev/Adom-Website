import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, Check, Link as LinkIcon } from 'lucide-react';
import type { Product } from '@/types';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { useCart } from '@/context/CartContext';
import { useProductSelection } from '@/hooks/useProductSelection';
import { useScrollLock } from '@/hooks/useScrollLock';
import { formatPrice, discountPercent } from '@/lib/currency';
import { getComboStock, isOutOfStock, outOfStockLabel, resolvePrice } from '@/lib/stock';
import { LazyImage } from '@/components/ui/LazyImage';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { VariantSelector } from './VariantSelector';
import { QuantitySelector } from './QuantitySelector';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

/**
 * Modal de "visualização rápida" de produto. Contém a mesma lógica de
 * seleção de variante/quantidade e geração de link do WhatsApp da página de
 * detalhe — reutilizada via `useProductSelection`.
 */
export function ProductModal({ product, onClose }: ProductModalProps) {
  const open = Boolean(product);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-surface shadow-lift sm:rounded-3xl"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 rounded-full bg-surface/90 p-2 text-ink shadow-soft hover:bg-surface"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            <ProductModalContent product={product} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function ProductModalContent({ product, onClose }: { product: Product; onClose: () => void }) {
  const config = useCompanyConfig();
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);
  const {
    selectedByGroupId,
    selectVariant,
    quantity,
    increment,
    decrement,
    selectedVariants,
    allGroupsSelected,
    activeImage,
    setActiveImage,
  } = useProductSelection(product);

  const resolved = resolvePrice(product, selectedVariants);
  const price = resolved.promoPrice ?? resolved.price;
  const discount = discountPercent(resolved.price, resolved.promoPrice);
  const outOfStock = isOutOfStock(product, selectedVariants);

  const isOptionDisabled = (groupName: string) => (optionLabel: string) => {
    const stock = getComboStock(product, { ...selectedVariants, [groupName]: optionLabel });
    return stock !== undefined && stock <= 0;
  };

  const handleAddToCart = () => {
    addItem({ product, selectedVariants, quantity });
    setAdded(true);
  };

  const handleViewCart = () => {
    onClose();
    openCart();
  };

  return (
    <div className="grid gap-0 sm:grid-cols-2">
      <div>
        <LazyImage src={product.images[activeImage]} alt={product.name} aspect="square" />
        {product.images.length > 1 && (
          <div className="flex gap-2 p-3">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 ${
                  i === activeImage ? 'border-accent' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.featured && <Badge tone="dark">Destaque</Badge>}
            {config.features.showPromotions && discount && <Badge tone="accent">-{discount}% OFF</Badge>}
            {outOfStock && <Badge tone="muted">{outOfStockLabel(product, selectedVariants)}</Badge>}
          </div>
          <h2 className="mt-2 font-display text-xl font-bold text-ink sm:text-2xl">{product.name}</h2>
          {config.features.showPrices && (
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-ink">{formatPrice(price)}</span>
              {resolved.promoPrice && <span className="text-sm text-ink-soft line-through">{formatPrice(resolved.price)}</span>}
            </div>
          )}
        </div>

        <p className="text-sm leading-relaxed text-ink-soft">{product.description}</p>

        {product.variants?.map((group) => (
          <VariantSelector
            key={group.id}
            group={group}
            selected={selectedByGroupId[group.id]}
            onSelect={(label) => selectVariant(group.id, label)}
            isOptionDisabled={isOptionDisabled(group.name)}
          />
        ))}

        <QuantitySelector quantity={quantity} onIncrement={increment} onDecrement={decrement} />

        {added ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 rounded-2xl bg-accent/10 p-4"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                <Check size={14} />
              </span>
              Adicionado ao carrinho!
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={() => setAdded(false)} variant="secondary" size="md" fullWidth>
                Continuar comprando
              </Button>
              <Button onClick={handleViewCart} variant="primary" size="md" fullWidth icon={<ShoppingBag size={16} />}>
                Ver carrinho
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="mt-1 flex flex-col gap-2 sm:flex-row">
            {!outOfStock && allGroupsSelected ? (
              <Button onClick={handleAddToCart} variant="primary" size="lg" fullWidth icon={<ShoppingBag size={18} />}>
                Adicionar ao carrinho
              </Button>
            ) : (
              <Button type="button" disabled variant="primary" size="lg" fullWidth icon={<ShoppingBag size={18} />}>
                {outOfStock ? outOfStockLabel(product, selectedVariants) : 'Selecione as opções'}
              </Button>
            )}
            <Button to={`/produtos/${product.slug}`} variant="secondary" size="lg" icon={<LinkIcon size={16} />}>
              Ver página
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
