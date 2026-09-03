import { services as demoServices } from '@/data/demo/services';
import { SEO } from '@/components/layout/SEO';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ServiceCard } from '@/components/sections/ServiceCard';
import { CTASection } from '@/components/sections/CTASection';
import { EmptyState } from '@/components/catalog/EmptyState';
import { Stagger, StaggerItem } from '@/components/motion/reveal';

export function ServicesPage() {
  return (
    <>
      <SEO title="Serviços" description="Conheça todos os nossos serviços e agende pelo WhatsApp." />
      <Section>
        <SectionHeading eyebrow="O que fazemos" title="Nossos serviços" description="Escolha um serviço e agende diretamente pelo WhatsApp." />
        <div className="mt-12">
          {demoServices.length ? (
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {demoServices.map((service, i) => (
                <StaggerItem key={service.id} effect={i % 2 === 0 ? 'up' : 'scale'}>
                  <ServiceCard service={service} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <EmptyState title="Nenhum serviço cadastrado" />
          )}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
