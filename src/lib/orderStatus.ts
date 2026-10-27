import type { PublicOrder } from '@/lib/api';

export interface TimelineStep {
  label: string;
  at: string | null;
  done: boolean;
  /** passo final de um pedido cancelado — a página mostra em vermelho */
  failed?: boolean;
}

/**
 * Passos que a página "Meu pedido" mostra, na ordem. Entrega: pedido feito →
 * pago → enviado. Retirada: pedido feito → pago → pronto para retirada →
 * retirado. Pedido cancelado mostra só o que chegou a acontecer + o cancelamento.
 */
export function buildTimeline(order: PublicOrder): TimelineStep[] {
  const isPickup = order.deliveryMethod === 'pickup';
  const steps: TimelineStep[] = [
    { label: 'Pedido feito', at: order.createdAt, done: true },
    { label: 'Pagamento confirmado', at: order.confirmedAt, done: Boolean(order.confirmedAt) },
  ];

  if (order.stage === 'cancelled') {
    return [...steps.filter((s) => s.done), { label: 'Pedido não concluído', at: order.cancelledAt, done: true, failed: true }];
  }

  if (isPickup) {
    steps.push(
      { label: 'Pronto para retirada', at: order.readyAt, done: Boolean(order.readyAt || order.shippedAt) },
      { label: 'Retirado', at: order.shippedAt, done: Boolean(order.shippedAt) },
    );
  } else {
    steps.push({ label: 'Enviado', at: order.shippedAt, done: Boolean(order.shippedAt) });
  }
  return steps;
}

export interface StageCopy {
  title: string;
  message: string;
  tone: 'success' | 'pending' | 'failure';
}

export function stageCopy(order: PublicOrder): StageCopy {
  const isPickup = order.deliveryMethod === 'pickup';
  switch (order.stage) {
    case 'pending':
      return {
        tone: 'pending',
        title: 'Aguardando pagamento',
        message:
          'Ainda não recebemos a confirmação do Mercado Pago. No Pix e no cartão costuma levar poucos segundos, esta página atualiza sozinha.',
      };
    case 'toShip':
      return {
        tone: 'success',
        title: 'Pagamento confirmado!',
        message: isPickup
          ? 'Estamos separando suas peças. Avisamos pelo WhatsApp ou e-mail quando estiver pronto para retirada.'
          : 'Estamos separando suas peças. Avisamos pelo WhatsApp ou e-mail quando for enviado, com o código de rastreio.',
      };
    case 'ready':
      return {
        tone: 'success',
        title: 'Pronto para retirada',
        message: 'Seu pedido está separado. É só passar na loja e informar o número do pedido.',
      };
    case 'shipped':
      return isPickup
        ? { tone: 'success', title: 'Pedido retirado', message: 'Obrigado pela compra! Esperamos que goste.' }
        : {
            tone: 'success',
            title: 'Pedido enviado!',
            message: order.trackingCode
              ? 'Use o código de rastreio abaixo para acompanhar a entrega.'
              : 'Seu pedido já está a caminho. Assim que tivermos o código de rastreio, ele aparece aqui.',
          };
    case 'cancelled':
      return {
        tone: 'failure',
        title: 'Pagamento não concluído',
        message:
          'O pagamento não foi aprovado ou o prazo para pagar terminou, e as peças voltaram para o estoque. Você pode montar o pedido de novo.',
      };
  }
}
