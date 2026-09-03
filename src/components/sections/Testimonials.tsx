import { Star, Quote } from 'lucide-react';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { testimonials as demoTestimonials } from '@/data/demo/testimonials';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/reveal';

function TestimonialCard({ t, showRating }: { t: (typeof demoTestimonials)[number]; showRating: boolean }) {
  return (
    <figure className="flex w-[19rem] shrink-0 flex-col rounded-2xl border border-black/5 bg-surface p-6 shadow-soft sm:w-96">
      <Quote className="text-accent/30" size={28} aria-hidden="true" />
      {showRating && t.rating && (
        <div className="mt-3 flex gap-0.5" aria-label={`${t.rating} de 5 estrelas`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={15} className={i < t.rating! ? 'fill-accent text-accent' : 'text-black/10'} />
          ))}
        </div>
      )}
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">"{t.content}"</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {t.avatar && <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />}
        <div>
          <p className="text-sm font-semibold text-ink">{t.name}</p>
          {t.role && <p className="text-xs text-ink-soft">{t.role}</p>}
        </div>
      </figcaption>
    </figure>
  );
}

/** Carrossel contínuo (marquee) de depoimentos — pausa ao passar o mouse. */
export function Testimonials() {
  const config = useCompanyConfig();
  if (!config.features.showTestimonials || !demoTestimonials.length) return null;

  // duplicado para permitir o loop infinito sem "salto" visível
  const track = [...demoTestimonials, ...demoTestimonials];

  return (
    <section className="overflow-hidden bg-surface-alt py-16 sm:py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Depoimentos" title="Quem compra, recomenda" />
      </Container>

      <Reveal
        effect="fade"
        className="group relative mt-12 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <div className="flex w-max gap-6 animate-marquee group-hover:[animation-play-state:paused]">
          {track.map((t, i) => (
            <TestimonialCard key={`${t.id}-${i}`} t={t} showRating={config.features.showReviews} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
