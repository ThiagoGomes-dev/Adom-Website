import { isSameCity } from '@/hooks/useCepLookup';

/**
 * Regra de frete — só pra EXIBIR no carrinho. Quem decide o valor cobrado é o
 * admin (`/api/orders`, arquivo src/lib/shipping.ts de lá), com a mesma
 * regra: se mudar algo aqui, mude lá também.
 */

export type DeliveryMethod = 'delivery' | 'pickup';

export const LOCAL_SHIPPING_CITY = 'Campina Grande';
export const LOCAL_SHIPPING_COST = 12;
export const REMOTE_SHIPPING_COST = 49.9;
/** mesmo valor anunciado na faixa do site ("FRETE GRÁTIS A PARTIR DE R$ 399,90") */
export const FREE_SHIPPING_MIN_SUBTOTAL = 399.9;

export function computeShippingCost(params: { method: DeliveryMethod; city: string | null; subtotal: number }): number {
  if (params.method === 'pickup') return 0;
  if (params.subtotal >= FREE_SHIPPING_MIN_SUBTOTAL) return 0;
  return isSameCity(params.city, LOCAL_SHIPPING_CITY) ? LOCAL_SHIPPING_COST : REMOTE_SHIPPING_COST;
}
