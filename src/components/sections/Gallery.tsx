import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { gallery as demoGallery } from '@/data/demo/gallery';
import { Section, SectionHeading } from '@/components/ui/Section';
import { LazyImage } from '@/components/ui/LazyImage';
import { useScrollLock } from '@/hooks/useScrollLock';
import { Stagger, StaggerItem, EASE_EXPO } from '@/components/motion/reveal';

const slideVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -60 : 60 }),
};

export function Gallery() {
  const config = useCompanyConfig();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const open = activeIndex !== null;
  useScrollLock(open);

  const close = () => setActiveIndex(null);
  const next = () => {
    setDirection(1);
    setActiveIndex((i) => (i === null ? null : (i + 1) % demoGallery.length));
  };
  const prev = () => {
    setDirection(-1);
    setActiveIndex((i) => (i === null ? null : (i - 1 + demoGallery.length) % demoGallery.length));
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!config.features.showGallery || !demoGallery.length) return null;

  return (
    <Section id="galeria">
      <SectionHeading eyebrow="Ambientes" title="Galeria" description="Inspirações reais de projetos e produtos." />

      <Stagger className="mt-12 columns-2 gap-4 sm:columns-3 [&>*]:mb-4" amount={0.05}>
        {demoGallery.map((image, index) => (
          <StaggerItem key={image.id} effect="scale">
            <button
              type="button"
              onClick={() => {
                setDirection(0);
                setActiveIndex(index);
              }}
              className="block w-full overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <LazyImage
                src={image.src}
                alt={image.alt}
                aspect="portrait"
                className="transition-transform duration-500 hover:scale-105"
              />
            </button>
          </StaggerItem>
        ))}
      </Stagger>

      {createPortal(
        <AnimatePresence>
          {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Visualização de imagem"
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20"
              aria-label="Fechar"
            >
              <X size={22} />
            </button>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 sm:left-4"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="relative flex max-h-[85vh] max-w-full items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.img
                  key={activeIndex}
                  src={demoGallery[activeIndex].src}
                  alt={demoGallery[activeIndex].alt}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: EASE_EXPO }}
                  className="max-h-[85vh] max-w-full rounded-lg object-contain"
                />
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 sm:right-4"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </Section>
  );
}
