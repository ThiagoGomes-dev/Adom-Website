import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { useCatalog } from '@/context/CatalogContext';
import { Section, SectionHeading } from '@/components/ui/Section';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { Stagger, StaggerItem } from '@/components/motion/reveal';

/**
 * Grade "compre por categoria" — uma peça (capa) por categoria cadastrada no
 * admin. A capa usa a primeira foto de um produto daquela categoria; sem
 * produto ainda, cai no ícone da categoria.
 */
export function CategoryGrid() {
  const config = useCompanyConfig();
  const { categories, products } = useCatalog();
  if (!config.features.showCatalog || !config.pages.products || !categories.length) return null;

  return (
    <Section>
      <SectionHeading eyebrow="Categorias" title="Compre por categoria" />
      <Stagger className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" amount={0.1} staggerDelay={0.07}>
        {categories.map((category) => {
          const cover = category.image ?? products.find((p) => p.category === category.slug)?.images[0];
          return (
            <StaggerItem key={category.id} effect="scale" duration={0.5}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
                <Link
                  to={`/produtos?categoria=${category.slug}`}
                  className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-surface-alt"
                >
                  {cover ? (
                    <img
                      src={cover}
                      alt={category.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    category.icon && <DynamicIcon name={category.icon} size={32} className="text-ink-soft" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-4 text-center text-sm font-semibold uppercase tracking-wide text-white">
                    {category.name}
                  </span>
                </Link>
              </motion.div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
