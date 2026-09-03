import { MessageCircle } from 'lucide-react';
import type { Service } from '@/types';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { buildServiceWhatsAppLink } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/currency';
import { LazyImage } from '@/components/ui/LazyImage';
import { Button } from '@/components/ui/Button';

interface ServiceCardProps {
  service: Service;
}

/** Card de serviço reutilizável (barbearia, oficina, clínica, prestador de serviço...). */
export function ServiceCard({ service }: ServiceCardProps) {
  const config = useCompanyConfig();
  const href = buildServiceWhatsAppLink(config.whatsapp, service);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      {service.image && (
        <LazyImage
          src={service.image}
          alt={service.name}
          aspect="landscape"
          className="transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold text-ink">{service.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{service.description}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          {(service.priceLabel || service.price) && (
            <span className="text-sm font-semibold text-accent">
              {service.priceLabel ?? formatPrice(service.price!)}
            </span>
          )}
        </div>

        <Button href={href} external variant="whatsapp" size="sm" fullWidth icon={<MessageCircle size={16} />} className="mt-4">
          Agendar pelo WhatsApp
        </Button>
      </div>
    </article>
  );
}
