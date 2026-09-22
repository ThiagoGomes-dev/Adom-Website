import { motion } from 'framer-motion';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/reveal';

export function AboutSection() {
  const config = useCompanyConfig();
  if (!config.features.showAbout || !config.aboutText) return null;

  const paragraphs = config.aboutText.split('\n\n').filter(Boolean);

  return (
    <Section tone="alt" id="sobre">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {config.aboutImage && (
          <div className="relative order-2 lg:order-1">
            <div
              className="absolute -inset-4 -z-10 hidden rounded-3xl border-2 border-accent/25 sm:block"
              aria-hidden="true"
              style={{ transform: 'rotate(-3deg)' }}
            />
            <Reveal effect="clip" duration={0.9}>
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-ink to-brand-dark shadow-card sm:aspect-[3/4]">
                <motion.div
                  aria-hidden="true"
                  className="absolute h-40 w-40 rounded-full bg-accent/30 blur-3xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0.7, 0.35] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.img
                  src={config.aboutImage}
                  alt={`Logo ${config.businessName}`}
                  className="relative z-10 w-1/2 max-w-[200px] drop-shadow-[0_0_25px_rgba(201,173,138,0.35)]"
                  animate={{ y: [0, -14, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </Reveal>
          </div>
        )}
        <div className="order-1 lg:order-2">
          <Reveal effect="right">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Sobre nós</span>
            <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {config.aboutTitle ?? `Conheça a ${config.businessName}`}
            </h2>
          </Reveal>
          <Reveal effect="right" delay={0.12}>
            <div className="mt-5 space-y-4 text-balance text-base leading-relaxed text-ink-soft sm:text-lg">
              {paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          {config.aboutClosing && (
            <Reveal effect="right" delay={0.2}>
              <p className="mt-6 font-display text-xl font-bold uppercase tracking-widest text-accent">
                {config.aboutClosing}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  );
}
