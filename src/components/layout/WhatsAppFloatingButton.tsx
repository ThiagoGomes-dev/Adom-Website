import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { buildContactWhatsAppLink } from '@/lib/whatsapp';

/**
 * Botão flutuante de WhatsApp, fixo no canto inferior direito, visível em
 * qualquer página. Mostra texto no desktop e apenas o ícone no celular.
 */
export function WhatsAppFloatingButton() {
  const config = useCompanyConfig();
  const href = buildContactWhatsAppLink(config.whatsapp, config.businessName);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      initial={{ opacity: 0, scale: 0.4, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 1 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="group fixed bottom-5 right-5 z-30 flex items-center gap-2.5 rounded-full bg-whatsapp px-4 py-4 text-white shadow-lift sm:bottom-6 sm:right-6 sm:px-5"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-whatsapp animate-pulse-ring" aria-hidden="true" />
      <MessageCircle size={24} className="shrink-0" fill="currentColor" strokeWidth={0} />
      <span className="hidden text-sm font-semibold sm:inline">Fale conosco</span>
    </motion.a>
  );
}
