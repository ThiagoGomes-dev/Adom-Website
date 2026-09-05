import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingBag, Check } from 'lucide-react';
import type { Product } from '@/types';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { useCatalog } from '@/context/CatalogContext';
import { useCart } from '@/context/CartContext';
import { useProductSelection } from '@/hooks/useProductSelection';
import { formatPrice, discountPercent } from '@/lib/currency';
import { SEO } from '@/components/layout/SEO';
import { Container } from '@/components/ui/Container';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LazyImage } from '@/components/ui/LazyImage';
import { VariantSelector } from '@/components/catalog/VariantSelector';
import { QuantitySelector } from '@/components/catalog/QuantitySelector';
import { ProductGrid } from '@/components/catalog/ProductGrid';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const config = useCompanyConfig();
  const { products: demoProducts, categories: demoCategories, loading } = useCatalog();
  const product = demoProducts.find((p) => p.slug === slug);

  if (!config.features.showCatalog) return <Navigate to="/" replace />;
  if (loading) return null;
  if (!product) return <Navigate to="/produtos" replace />;

  const category = demoCategories.find((c) => c.slug === product.category);
  const related = demoProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <ProductDetailContent product={product} categoryName={category?.name} related={related} />
  );
}

function ProductDetailContent({
  product,
  categoryName,
  related,
}: {
  product: Product;
  categoryName?: string;
  related: Product[];
}) {
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

  const price = product.promoPrice ?? product.price;
  const discount = discountPercent(product.price, product.promoPrice);
  const canBuy = product.available && allGroupsSelected;

  const handleAddToCart = () => {
    addItem({ product, selectedVariants, quantity });
    setAdded(true);
  };

  return (
    <>
      <SEO title={product.name} description={product.shortDescription ?? product.description} image={product.images[0]} />

      <Container className="pt-6">
        <nav className="flex items-center gap-1.5 text-xs text-ink-soft" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-ink">
            Início
          </Link>
          <ChevronRight size={12} />
          <Link to="/produtos" className="hover:text-ink">
            Produtos
          </Link>
          {categoryName && (
            <>
              <ChevronRight size={12} />
              <Link to={`/produtos?categoria=${product.category}`} className="hover:text-ink">
                {categoryName}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-ink">{product.name}</span>
        </nav>
      </Container>

      <Section className="!pt-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <LazyImage
              src={product.images[activeImage]}
              alt={product.name}
              aspect="square"
              containerClassName="rounded-2xl shadow-card"
            />
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                      i === activeImage ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {categoryName && <Badge tone="muted">{categoryName}</Badge>}
                {product.featured && <Badge tone="dark">Destaque</Badge>}
                {config.features.showPromotions && discount && <Badge tone="accent">-{discount}% OFF</Badge>}
                {!product.available && <Badge tone="muted">Indisponível</Badge>}
              </div>
              <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">{product.name}</h1>
              {config.features.showPrices && (
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-ink">{formatPrice(price)}</span>
                  {product.promoPrice && (
                    <span className="text-base text-ink-soft line-through">{formatPrice(product.price)}</span>
                  )}
                </div>
              )}
            </div>

            <p className="text-base leading-relaxed text-ink-soft">{product.description}</p>

            {product.variants?.map((group) => (
              <VariantSelector
                key={group.id}
                group={group}
                selected={selectedByGroupId[group.id]}
                onSelect={(label) => selectVariant(group.id, label)}
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
                  <Button onClick={openCart} variant="primary" size="md" fullWidth icon={<ShoppingBag size={16} />}>
                    Ver carrinho
                  </Button>
                </div>
              </motion.div>
            ) : canBuy ? (
              <Button onClick={handleAddToCart} variant="primary" size="lg" fullWidth icon={<ShoppingBag size={18} />}>
                Adicionar ao carrinho
              </Button>
            ) : (
              <Button type="button" disabled variant="primary" size="lg" fullWidth icon={<ShoppingBag size={18} />}>
                {product.available ? 'Selecione as opções' : 'Indisponível no momento'}
              </Button>
            )}
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="alt">
          <SectionHeading eyebrow="Você também pode gostar" title="Produtos relacionados" />
          <div className="mt-10">
            <ProductGrid products={related} />
          </div>
        </Section>
      )}
    </>
  );
}
