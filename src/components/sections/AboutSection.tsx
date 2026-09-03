import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { Section } from '@/components/ui/Section';
import { LazyImage } from '@/components/ui/LazyImage';
import { Reveal } from '@/components/motion/reveal';

export function AboutSection() {
  const config = useCompanyConfig();
  if (!config.features.showAbout || !config.aboutText) return null;

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
              <LazyImage
                src={config.aboutImage}
                alt={`Sobre a ${config.businessName}`}
                aspect="portrait"
                containerClassName="rounded-2xl shadow-card"
              />
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
            <p className="mt-5 text-balance text-base leading-relaxed text-ink-soft sm:text-lg">{config.aboutText}</p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
