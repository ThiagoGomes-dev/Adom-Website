import { useMemo, useRef } from 'react';
import { ArrowRight, MessageCircle, Sparkles, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { resolveCta } from '@/lib/cta';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { EASE_EXPO } from '@/components/motion/reveal';
import { cn } from '@/lib/cn';

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
        size: 5 + Math.random() * 6,
        duration: 6 + Math.random() * 5,
        delay: Math.random() * 3,
        drift: 12 + Math.random() * 20,
        maxOpacity: 0.7 + Math.random() * 0.3,
      })),
    [count],
  );
}

function HeroParticles() {
  const particles = useHeroParticles(16);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.left}%`,
            bottom: '-5%',
            width: p.size,
            height: p.size,
            boxShadow: '0 0 14px 4px rgb(var(--color-accent) / 1)',
          }}
          animate={{
            y: ['0%', '-130vh'],
            x: [0, p.drift, -p.drift, 0],
            opacity: [0, p.maxOpacity, p.maxOpacity, 0],
            scale: [0.8, 1.15, 0.8],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const config = useCompanyConfig();
  const { hero } = config;
  const primary = resolveCta(config, hero.primaryCta);
  const secondary = hero.secondaryCta ? resolveCta(config, hero.secondaryCta) : null;
  const words = hero.title.split(' ');
  const highlightWords = (hero.highlight?.split(' ') ?? []).map(normalizeWord);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink">
      {/* Imagem de fundo em tela cheia com leve zoom contínuo no scroll (efeito Ken Burns) */}
      {hero.image && (
        <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
          <img
            src={hero.image}
            alt={hero.imageAlt ?? config.businessName}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </motion.div>
      )}

      {/* Overlay escuro uniforme para garantir contraste do texto centralizado sobre a foto */}
      <div className="absolute inset-0 bg-ink/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60" />

      {/* Glow de destaque animado, sutil, para reforçar identidade da marca sobre a foto */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      {/* Poeira dourada flutuando sobre a foto, em loop — toque de elegância minimalista */}
      <HeroParticles />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 w-full">
        <Container className="flex flex-col items-center px-6 py-32 text-center">
          {hero.eyebrow && (
            <motion.span
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_EXPO }}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm"
            >
              <Sparkles size={12} className="text-accent" />
              {hero.eyebrow}
            </motion.span>
          )}

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={titleContainer}
            className="mt-6 max-w-5xl text-balance font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {words.map((word, i) => {
              const isHighlight = highlightWords.includes(normalizeWord(word));
              return (
                <span key={`${word}-${i}`} className="mx-[0.14em] inline-block overflow-hidden pb-1 align-top">
                  <motion.span
                    variants={wordVariant}
                    className={cn(
                      'inline-block',
                      isHighlight &&
                        'bg-[image:linear-gradient(110deg,rgb(var(--color-accent))_20%,#f6ecd9_45%,rgb(var(--color-accent))_70%)] bg-[length:250%_100%] bg-clip-text text-transparent animate-shine drop-shadow-[0_2px_24px_rgb(var(--color-accent)/0.35)]',
                    )}
                  >
                    {word}
                  </motion.span>
                </span>
              );
            })}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: EASE_EXPO }}
            className="mt-5 max-w-lg text-balance text-base leading-relaxed text-white/75 sm:text-lg"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE_EXPO }}
            className="mt-9 flex flex-col items-center gap-4"
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
              className="mt-10 flex items-center gap-2 text-white/80"
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
