import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { testimonials as demoTestimonials } from '@/data/demo/testimonials';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/reveal';
import { fetchGoogleReviews, type GoogleReviews } from '@/lib/api';
import { buildTestimonialTrack } from '@/lib/testimonialTrack';
import type { Testimonial } from '@/types';

const STORAGE_KEY = 'google-reviews:v1';

function readSavedReviews(): GoogleReviews | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return Array.isArray(parsed?.reviews) && parsed.reviews.length ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Avaliações do Google Maps (via painel). Começa com a última cópia salva no
 * navegador; se o painel não tiver avaliações ou falhar, a seção usa os
 * depoimentos fixos.
 */
function useGoogleReviews(): GoogleReviews | null {
  const [google, setGoogle] = useState<GoogleReviews | null>(readSavedReviews);

  useEffect(() => {
    let active = true;
    fetchGoogleReviews()
      .then((data) => {
        if (!active || !data.reviews.length) return;
        setGoogle(data);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch {
          // navegador sem espaço ou em modo privado: só não guarda
        }
      })
      .catch(() => {
        // sem avaliações do Google: segue com o que já está na tela
      });
    return () => {
      active = false;
    };
  }, []);

  return google;
}

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function TestimonialCard({ t, showRating }: { t: Testimonial; showRating: boolean }) {
  return (
    <figure className="flex w-[19rem] shrink-0 flex-col rounded-2xl border border-black/5 bg-surface p-6 shadow-soft sm:w-96">
      <div className="flex items-start justify-between">
        <Quote className="text-accent/30" size={28} aria-hidden="true" />
        {t.source === 'google' && (
          <a
            href={t.reviewUrl ?? t.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-ink-soft hover:text-ink"
          >
            <GoogleMark className="h-3.5 w-3.5" />
            Google
          </a>
        )}
      </div>
      {showRating && t.rating && (
        <div className="mt-3 flex gap-0.5" aria-label={`${t.rating} de 5 estrelas`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={15} className={i < t.rating! ? 'fill-accent text-accent' : 'text-black/10'} />
          ))}
        </div>
      )}
      <blockquote className="mt-3 line-clamp-6 flex-1 text-sm leading-relaxed text-ink-soft">"{t.content}"</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {t.avatar && (
          <img
            src={t.avatar}
            alt={t.name}
            className="h-10 w-10 rounded-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}
        <div>
          {t.authorUrl ? (
            <a href={t.authorUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-ink hover:underline">
              {t.name}
            </a>
          ) : (
            <p className="text-sm font-semibold text-ink">{t.name}</p>
          )}
          {t.role && <p className="text-xs text-ink-soft">{t.role}</p>}
        </div>
      </figcaption>
    </figure>
  );
}

/** Carrossel contínuo (marquee) de depoimentos — pausa ao passar o mouse. */
export function Testimonials() {
  const config = useCompanyConfig();
  const google = useGoogleReviews();
  if (!config.features.showTestimonials) return null;

  const items = google?.reviews.length ? google.reviews : demoTestimonials;
  if (!items.length) return null;

  // repetido/duplicado para permitir o loop infinito sem "salto" visível
  const track = buildTestimonialTrack(items);

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

      {google?.placeUrl && (
        <Container>
          <a
            href={google.placeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto mt-8 flex w-fit items-center gap-2 text-sm text-ink-soft hover:text-ink"
          >
            <GoogleMark className="h-4 w-4" />
            {google.rating ? `${google.rating.toFixed(1).replace('.', ',')} no Google` : 'Avaliações no Google'}
            {google.totalReviews ? ` · ${google.totalReviews} avaliações` : ''}
            <span className="underline underline-offset-2">ver todas</span>
          </a>
        </Container>
      )}
    </section>
  );
}
