import { Home, MessageCircle } from 'lucide-react';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { buildContactWhatsAppLink } from '@/lib/whatsapp';
import { SEO } from '@/components/layout/SEO';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  const config = useCompanyConfig();
  const href = buildContactWhatsAppLink(config.whatsapp, config.businessName);

  return (
    <>
      <SEO title="Página não encontrada" />
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="font-display text-7xl font-extrabold text-accent/30 sm:text-8xl">404</span>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">Página não encontrada</h1>
        <p className="mt-3 max-w-md text-sm text-ink-soft sm:text-base">
          A página que você procura não existe ou foi movida. Volte para o início ou fale com a gente.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button to="/" icon={<Home size={16} />}>
            Voltar ao início
          </Button>
          <Button href={href} external variant="whatsapp" icon={<MessageCircle size={16} />}>
            Falar no WhatsApp
          </Button>
        </div>
      </Container>
    </>
  );
}
