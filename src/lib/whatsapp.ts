import type { CartItem, Product, ProductSelection, Service } from '@/types';
import { formatPrice } from './currency';

/**
 * Gera o link do WhatsApp (wa.me) a partir de um número e uma mensagem.
 * Função reutilizável — usada por todos os botões de WhatsApp da aplicação.
 *
 * @param phone   Número com DDI, apenas dígitos ou formatado (ex: "5511999998888"
 *                ou "(11) 99999-8888" — a máscara é removida automaticamente).
 * @param message Texto da mensagem (pode conter quebras de linha).
 */
export function generateWhatsAppLink(phone: string, message = ''): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}${encoded ? `?text=${encoded}` : ''}`;
}

/** Monta a mensagem de interesse em um produto, com variantes e quantidade. */
export function buildProductMessage(selection: ProductSelection): string {
  const { product, selectedVariants, quantity } = selection;
  const price = product.promoPrice ?? product.price;

  const lines = [
    'Olá! Tenho interesse neste produto:',
    '',
    `Produto: ${product.name}`,
  ];

  for (const [groupName, optionLabel] of Object.entries(selectedVariants)) {
    lines.push(`${groupName}: ${optionLabel}`);
  }

  lines.push(`Quantidade: ${quantity}`);
  lines.push(`Valor unitário: ${formatPrice(price)}`);
  lines.push('', 'Gostaria de saber mais informações.');

  return lines.join('\n');
}

export type PaymentMethod = 'pix' | 'credito';

export interface CheckoutInfo {
  /** CEP digitado pelo cliente, formatado (ex: "58400-000"). */
  cep?: string;
  /** Cidade resolvida a partir do CEP (via ViaCEP), quando disponível. */
  city?: string | null;
  /** true quando a cidade resolvida é Campina Grande (frete fixo). */
  fixedShipping?: boolean;
  street?: string;
  neighborhood?: string;
  number?: string;
  reference?: string;
  paymentMethod?: PaymentMethod;
  /** Nº de parcelas escolhido, quando a forma de pagamento é cartão de crédito. */
  installments?: number;
}

/**
 * Monta a mensagem com o histórico completo do carrinho — nome, variantes,
 * quantidade e valor de cada item, mais o total — seguida do CEP/frete e da
 * forma de pagamento escolhidos no carrinho. É o coração do fluxo
 * "adicionar ao carrinho -> finalizar pelo WhatsApp".
 */
export function buildCartMessage(items: CartItem[], businessName: string, checkout?: CheckoutInfo): string {
  const lines = [`Olá, ${businessName}! Gostaria de finalizar este pedido:`, ''];

  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name}`);
    for (const [groupName, optionLabel] of Object.entries(item.selectedVariants)) {
      lines.push(`   ${groupName}: ${optionLabel}`);
    }
    lines.push(`   Quantidade: ${item.quantity} — ${formatPrice(item.unitPrice * item.quantity)}`);
    lines.push('');
  });

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  lines.push(`Total: ${formatPrice(total)}`);

  if (checkout?.cep || checkout?.street) {
    lines.push('', 'Endereço de entrega:');
    if (checkout.street) {
      const line1 = `${checkout.street}${checkout.number ? `, ${checkout.number}` : ''}`;
      lines.push(checkout.neighborhood ? `${line1} - ${checkout.neighborhood}` : line1);
    }
    if (checkout.reference) lines.push(`Referência: ${checkout.reference}`);
    if (checkout.cep) lines.push(`CEP: ${checkout.cep}${checkout.city ? ` (${checkout.city})` : ''}`);
    lines.push(
      checkout.fixedShipping
        ? 'Frete: R$ 12,00 (entrega fixa em Campina Grande)'
        : 'Frete: a consultar (fora de Campina Grande)',
    );
  }

  if (checkout?.paymentMethod) {
    lines.push('', `Forma de pagamento: ${checkout.paymentMethod === 'credito' ? 'Cartão de crédito' : 'Pix'}`);
    if (checkout.paymentMethod === 'credito') {
      const installments = checkout.installments ?? 1;
      lines.push(`Parcelamento: ${installments}x${installments <= 2 ? ' sem juros' : ' com juros da maquininha'}`);
      lines.push('Até 2x sem juros. Acima disso, juros da maquininha — a consultar no WhatsApp.');
    }
  }

  lines.push('', 'Poderiam confirmar disponibilidade e finalizar o pedido?');

  return lines.join('\n');
}

/** Atalho: link de WhatsApp já pronto com o pedido completo do carrinho. */
export function buildCartWhatsAppLink(
  phone: string,
  items: CartItem[],
  businessName: string,
  checkout?: CheckoutInfo,
): string {
  return generateWhatsAppLink(phone, buildCartMessage(items, businessName, checkout));
}

/** Mensagem de orçamento genérico (sem produto específico). */
export function buildQuoteMessage(context?: string): string {
  const lines = ['Olá! Gostaria de solicitar um orçamento.'];
  if (context) lines.push('', context);
  return lines.join('\n');
}

/** Mensagem de agendamento de um serviço específico. */
export function buildServiceMessage(service: Service): string {
  const lines = [
    'Olá! Gostaria de agendar o seguinte serviço:',
    '',
    `Serviço: ${service.name}`,
  ];
  if (service.priceLabel || service.price) {
    lines.push(`Valor: ${service.priceLabel ?? formatPrice(service.price!)}`);
  }
  lines.push('', 'Qual a disponibilidade?');
  return lines.join('\n');
}

/** Mensagem padrão de "falar com a empresa" (contato geral). */
export function buildContactMessage(businessName: string): string {
  return `Olá, ${businessName}! Vim pelo site e gostaria de mais informações.`;
}

/** Atalho: link de WhatsApp já pronto para comprar um produto. */
export function buildProductWhatsAppLink(phone: string, selection: ProductSelection): string {
  return generateWhatsAppLink(phone, buildProductMessage(selection));
}

/** Atalho: link de WhatsApp já pronto para orçamento. */
export function buildQuoteWhatsAppLink(phone: string, context?: string): string {
  return generateWhatsAppLink(phone, buildQuoteMessage(context));
}

/** Atalho: link de WhatsApp já pronto para agendar um serviço. */
export function buildServiceWhatsAppLink(phone: string, service: Service): string {
  return generateWhatsAppLink(phone, buildServiceMessage(service));
}

/** Atalho: link de WhatsApp já pronto para contato geral. */
export function buildContactWhatsAppLink(phone: string, businessName: string): string {
  return generateWhatsAppLink(phone, buildContactMessage(businessName));
}

/** Helper simples usado pelo botão flutuante e pelo CTA do Hero. */
export function buildSimpleMessageLink(phone: string, message: string): string {
  return generateWhatsAppLink(phone, message);
}

// Reexport para quem precisar formatar preço junto de uma mensagem sem
// importar dois módulos diferentes.
export { formatPrice } from './currency';

export type { Product };
