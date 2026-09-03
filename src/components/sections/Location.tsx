import { MapPin, Clock, Navigation } from 'lucide-react';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/reveal';

export function Location() {
  const config = useCompanyConfig();
  if (!config.features.showAddress || !config.address) return null;

  const { address } = config;

  return (
    <Section tone="alt" id="localizacao">
      <SectionHeading eyebrow="Onde estamos" title="Localização e horário" />

      <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Reveal effect="left" className="overflow-hidden rounded-2xl border border-black/5 shadow-soft">
          {address.mapsEmbedUrl ? (
            <iframe
              src={address.mapsEmbedUrl}
              title={`Mapa — ${config.businessName}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full sm:h-96"
            />
          ) : (
            <div className="flex h-72 items-center justify-center bg-surface text-ink-soft sm:h-96">
              <MapPin size={32} />
            </div>
          )}
        </Reveal>

        <Reveal effect="right" className="flex flex-col justify-center gap-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-full bg-accent/10 p-2.5 text-accent">
              <MapPin size={18} />
            </span>
            <div>
              <p className="font-semibold text-ink">Endereço</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {address.street}
                {address.neighborhood ? `, ${address.neighborhood}` : ''}
                <br />
                {address.city} / {address.state}
                {address.zip ? ` — ${address.zip}` : ''}
              </p>
            </div>
          </div>

          {config.hours && config.hours.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-full bg-accent/10 p-2.5 text-accent">
                <Clock size={18} />
              </span>
              <div>
                <p className="font-semibold text-ink">Horário de funcionamento</p>
                <ul className="mt-1 space-y-1 text-sm text-ink-soft">
                  {config.hours.map((h) => (
                    <li key={h.day}>
                      {h.day}: {h.hours}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {address.mapsUrl && (
            <Button href={address.mapsUrl} external variant="outline" size="md" icon={<Navigation size={16} />} className="w-fit">
              Como chegar
            </Button>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
