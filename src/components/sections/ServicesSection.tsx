import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { services as demoServices } from '@/data/demo/services';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Stagger, StaggerItem } from '@/components/motion/reveal';
import { ServiceCard } from './ServiceCard';

interface ServicesSectionProps {
  limit?: number;
}

/** Seção "Serviços" usada na home/landing page. A página /servicos lista todos. */
export function ServicesSection({ limit }: ServicesSectionProps) {
  const config = useCompanyConfig();
  if (!config.features.showServices) return null;

  const list = limit ? demoServices.slice(0, limit) : demoServices;
  if (!list.length) return null;

  return (
    <Section>
      <SectionHeading
        eyebrow="O que fazemos"
        title="Serviços"
        description="Além dos produtos, ajudamos você a planejar e montar cada ambiente."
      />
      <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((service, i) => (
          <StaggerItem key={service.id} effect={i % 2 === 0 ? 'up' : 'scale'}>
            <ServiceCard service={service} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
