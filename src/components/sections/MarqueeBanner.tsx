import { Sparkles } from 'lucide-react';
import { useCompanyConfig } from '@/context/CompanyConfigContext';

/**
 * Faixa de texto rolando infinitamente — o tipo de elemento "vivo" que
 * diferencia um site na hora de sites genéricos. Some se o cliente não
 * definir `marqueeItems`.
 */
export function MarqueeBanner() {
  const config = useCompanyConfig();
  const items = config.marqueeItems;
  if (!items?.length) return null;

  const track = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-white/10 bg-ink py-3.5 sm:py-4">
      <div className="flex w-max items-center gap-8 animate-marquee [animation-duration:26s] hover:[animation-play-state:paused] sm:gap-10">
        {track.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-8 sm:gap-10">
            <span className="font-display text-sm font-bold uppercase tracking-widest text-white/90 sm:text-base">
              {item}
            </span>
            <Sparkles size={14} className="shrink-0 text-accent" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
