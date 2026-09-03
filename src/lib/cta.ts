import type { CompanyConfig, CtaButton } from '@/types';
import { buildContactWhatsAppLink } from './whatsapp';

export type ResolvedCta = { kind: 'to'; target: string } | { kind: 'href'; target: string; external: boolean };

/**
 * Traduz um `CtaButton` (definido em `companyConfig`) em algo renderizável
 * pelo componente `<Button>` — link interno (React Router) ou externo
 * (WhatsApp, redes sociais, etc.).
 */
export function resolveCta(config: CompanyConfig, cta: CtaButton): ResolvedCta {
  switch (cta.action) {
    case 'whatsapp':
      return {
        kind: 'href',
        target: buildContactWhatsAppLink(config.whatsapp, config.businessName),
        external: true,
      };
    case 'products':
      return { kind: 'to', target: '/produtos' };
    case 'services':
      return { kind: 'to', target: '/servicos' };
    case 'link':
    default:
      return { kind: 'href', target: cta.href ?? '#', external: Boolean(cta.href?.startsWith('http')) };
  }
}
