import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { buildContactWhatsAppLink } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/reveal';

interface CTASectionProps {
  title?: string;
  description?: string;
}

/** Bloco final de conversão — sempre presente antes do footer. */
export function CTASection({ title, description }: CTASectionProps) {
  const config = useCompanyConfig();
  const href = buildContactWhatsAppLink(config.whatsapp, config.businessName);

  return (
    <section className="relative overflow-hidden bg-ink py-16 sm:py-20">
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      <Container className="relative flex flex-col items-center gap-6 text-center">
        <Reveal effect="scale" duration={0.6}>
          <h2 className="text-balance font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            {title ?? `Pronto para falar com a ${config.businessName}?`}
          </h2>
        </Reveal>
        <Reveal effect="up" delay={0.1}>
          <p className="max-w-xl text-balance text-sm leading-relaxed text-white/70 sm:text-base">
            {description ?? 'Tire suas dúvidas, peça um orçamento ou finalize sua compra direto pelo WhatsApp.'}
          </p>
        </Reveal>
        <Reveal effect="up" delay={0.2}>
          <motion.span
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-block"
            animate={{ y: [0, -4, 0] }}
            transition={{ y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <Button href={href} external variant="whatsapp" size="lg" icon={<MessageCircle size={18} />}>
              Falar no WhatsApp agora
            </Button>
          </motion.span>
        </Reveal>
      </Container>
    </section>
  );
}
