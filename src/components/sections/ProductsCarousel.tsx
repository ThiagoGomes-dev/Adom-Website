import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/types';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { useCatalog } from '@/context/CatalogContext';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { chunk, shuffle } from '@/lib/carousel';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductModal } from '@/components/catalog/ProductModal';
import { EASE_EXPO } from '@/components/motion/reveal';

const MAX_ITEMS = 24;
const AUTOPLAY_MS = 6000;
const SWIPE_PX = 60;

const pageVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
};

/**
 * Seção "Produtos" da home: produtos de todas as categorias misturados, num
 * carrossel de 3 colunas x 2 linhas (2 x 2 no celular) que troca de página
 * sozinho e aceita setas, bolinhas e arrastar.
 */
export function ProductsCarousel() {
  const config = useCompanyConfig();
  const { products } = useCatalog();
  const isMobile = useIsMobile();
  const perPage = isMobile ? 4 : 6;

  // embaralha uma vez por carregamento do catálogo, não a cada render
  const mixed = useMemo(() => shuffle(products).slice(0, MAX_ITEMS), [products]);
  const pages = useMemo(() => chunk(mixed, perPage), [mixed, perPage]);

  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const current = pages.length ? page % pages.length : 0;

  const go = (dir: number) => setPage(([p]) => [(p + dir + pages.length) % pages.length, dir]);

  useEffect(() => {
    if (paused || quickViewProduct || pages.length < 2) return;
    const id = window.setInterval(() => setPage(([p]) => [(p + 1) % pages.length, 1]), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, quickViewProduct, pages.length]);

  if (!config.features.showCatalog || !config.pages.products || !pages.length) return null;

  return (
    <Section tone="alt">
      <SectionHeading eyebrow="Catálogo" title="Produtos" description="Um pouco de tudo o que tem na ADOM." />

      <div
        className="relative mt-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={`${current}-${perPage}`}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: EASE_EXPO }}
              drag={pages.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -SWIPE_PX) go(1);
                else if (info.offset.x > SWIPE_PX) go(-1);
              }}
              className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:gap-6"
            >
              {pages[current].map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.05 * i, ease: EASE_EXPO }}
                >
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {pages.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Produtos anteriores"
              onClick={() => go(-1)}
              className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-black shadow-md transition hover:bg-white md:block lg:-left-5"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Próximos produtos"
              onClick={() => go(1)}
              className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-black shadow-md transition hover:bg-white md:block lg:-right-5"
            >
              <ChevronRight size={20} />
            </button>
            <div className="mt-6 flex justify-center gap-2">
              {pages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ir para a página ${i + 1}`}
                  aria-current={i === current}
                  onClick={() => setPage([i, i > current ? 1 : -1])}
                  className={`h-2 rounded-full transition-all ${i === current ? 'w-6 bg-accent' : 'w-2 bg-current opacity-30'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <Button to="/produtos" variant="outline" icon={<ArrowRight size={16} />} iconPosition="right">
          Ver todos os produtos
        </Button>
      </div>

      <ProductModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </Section>
  );
}
