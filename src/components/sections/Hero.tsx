import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, MessageCircle, Sparkles, Star } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { resolveCta } from '@/lib/cta';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { EASE_EXPO } from '@/components/motion/reveal';

function ctaProps(resolved: ReturnType<typeof resolveCta>) {
  return resolved.kind === 'to' ? { to: resolved.target } : { href: resolved.target, external: resolved.external };
}

const titleContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.15 } },
};

const wordVariant = {
  hidden: { opacity: 0, y: '110%' },
  visible: { opacity: 1, y: '0%', transition: { duration: 0.7, ease: EASE_EXPO } },
};

/** Remove pontuação para comparar palavras independente de vírgula/ponto final. */
const normalizeWord = (w: string) => w.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();

interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  maxOpacity: number;
}

/** Poeira dourada sutil flutuando sobre a foto — gerada uma única vez por sessão de montagem. */
function useHeroParticles(count: number): Particle[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, id) => ({
        id,
        left: Math.random() * 100,
        size: 1.5 + Math.random() * 2,
        duration: 6 + Math.random() * 5,
        delay: Math.random() * -6, // negativo: começa "no meio" do ciclo, sem esperar tudo aparecer de uma vez
        drift: 12 + Math.random() * 20,
        maxOpacity: 0.7 + Math.random() * 0.3,
      })),
    [count],
  );
}

/**
 * Poeira flutuando sobre a foto, em CSS puro (sem Framer Motion) — evita
 * qualquer problema de animação controlada por JS sumir após remounts/HMR.
 */
function HeroParticles() {
  const particles = useHeroParticles(16);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-white animate-float-up"
          style={
            {
              left: `${p.left}%`,
              bottom: '-5%',
              width: p.size,
              height: p.size,
              boxShadow: '0 0 6px 1.5px rgb(var(--color-accent) / 1)',
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              '--particle-drift': `${p.drift}px`,
              '--particle-opacity': p.maxOpacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

const HERO_CAROUSEL_INTERVAL_MS = 6000;

/**
 * Carrossel de imagens de fundo com crossfade. Cada imagem é ancorada ao topo
 * (object-top) para que o corte por enquadramento — quando a foto é mais alta
 * que a seção — sempre remova a parte de baixo (ex.: pernas) e nunca a cabeça.
 */
function HeroBackgroundCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, HERO_CAROUSEL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <AnimatePresence>
      <motion.img
        key={images[index]}
        src={images[index]}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-top"
        fetchPriority="high"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: EASE_EXPO }}
      />
    </AnimatePresence>
  );
}

export function Hero() {
  const config = useCompanyConfig();
  const { hero } = config;
  const primary = resolveCta(config, hero.primaryCta);
  const secondary = hero.secondaryCta ? resolveCta(config, hero.secondaryCta) : null;
  const lines = hero.title.split('\n');
  const highlightWords = (hero.highlight?.split(' ') ?? []).map(normalizeWord);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <section ref={sectionRef} className="relative flex min-h-[52vh] items-center justify-center overflow-hidden bg-ink sm:min-h-[62vh] lg:min-h-[78vh] xl:min-h-[86vh]">
      {/* Imagem(ns) de fundo em tela cheia com leve zoom contínuo no scroll (efeito Ken Burns) */}
      {hero.images && hero.images.length > 1 ? (
        <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
          <HeroBackgroundCarousel images={hero.images} alt={hero.imageAlt ?? config.businessName} />
        </motion.div>
      ) : (
        (hero.images?.[0] ?? hero.image) && (
          <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
            <img
              src={hero.images?.[0] ?? hero.image}
              alt={hero.imageAlt ?? config.businessName}
              className="h-full w-full object-cover object-top"
              fetchPriority="high"
            />
          </motion.div>
        )
      )}

      {/* Overlay escuro uniforme para garantir contraste do texto centralizado sobre a foto */}
      <div className="absolute inset-0 bg-ink/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60" />

      {/* Poeira dourada flutuando sobre a foto, em loop — toque de elegância minimalista */}
      <HeroParticles />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 w-full">
        <Container className="flex flex-col items-center px-6 py-16 text-center sm:py-20 lg:py-24">
          {hero.eyebrow && (
            <motion.span
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_EXPO }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-sm"
            >
              <Sparkles size={12} className="text-accent" />
              {hero.eyebrow}
            </motion.span>
          )}

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={titleContainer}
            className="mt-6 max-w-4xl text-balance font-display text-3xl font-medium uppercase leading-[1.18] tracking-normal text-white sm:text-4xl lg:text-5xl"
          >
            {lines.map((line, li) => (
              <span key={li} className="block">
                {line.split(' ').map((word, i) => {
                  const isHighlight = highlightWords.includes(normalizeWord(word));
                  return (
                    <span key={`${li}-${word}-${i}`} className="mx-[0.16em] inline-block overflow-hidden pb-1 align-top">
                      <motion.span variants={wordVariant} className="inline-block">
                        {isHighlight && config.logo ? (
                          <img
                            src={config.logo}
                            alt={word}
                            className="inline-block h-[0.68em] w-auto align-[-0.03em]"
                          />
                        ) : (
                          word
                        )}
                      </motion.span>
                    </span>
                  );
                })}
              </span>
            ))}
          </motion.h1>

          {hero.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: EASE_EXPO }}
              className="mt-6 max-w-md text-balance text-base leading-relaxed text-white/70 sm:text-lg"
            >
              {hero.subtitle}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE_EXPO }}
            className="mt-8 flex flex-col items-center gap-4"
          >
            <motion.span whileHover={{ scale: 1.035 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Button
                {...ctaProps(primary)}
                size="lg"
                variant="secondary"
                className="!bg-white/10 !text-white backdrop-blur-sm hover:!bg-white hover:!text-ink"
                icon={<ArrowRight size={18} />}
                iconPosition="right"
              >
                {hero.primaryCta.label}
              </Button>
            </motion.span>
            {secondary && (
              <motion.span whileHover={{ scale: 1.03 }} className="inline-block">
                <Button
                  {...ctaProps(secondary)}
                  variant="ghost"
                  size="sm"
                  className="!text-white/70 hover:!text-white"
                  icon={<MessageCircle size={14} />}
                >
                  {hero.secondaryCta!.label}
                </Button>
              </motion.span>
            )}
          </motion.div>

          {config.stats?.[3] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="mt-8 flex items-center gap-2 text-white/80"
            >
              <div className="flex" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-accent text-accent" />
                ))}
              </div>
              <span className="text-sm">
                <strong className="text-white">{config.stats[3].value}</strong> · +
                {config.stats[2]?.value.toLocaleString('pt-BR')} clientes satisfeitos
              </span>
            </motion.div>
          )}
        </Container>
      </motion.div>
    </section>
  );
}
