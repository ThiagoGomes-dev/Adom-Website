import type { CartItem } from '@/types';

const STORAGE_KEY = 'last-order:v1';

/**
 * Último pedido feito neste navegador. Gravado ao finalizar a compra, junto
 * com uma cópia dos itens: o carrinho é esvaziado antes de ir pro Mercado
 * Pago (o cliente nem sempre volta pro site depois de pagar), e se o
 * pagamento não for concluído a página do pedido usa essa cópia pra montar o
 * carrinho de novo.
 */
export interface LastOrder {
  id: string;
  items: CartItem[];
  createdAt: string;
}

export function parseLastOrder(raw: string | null): LastOrder | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.id !== 'string' || !Array.isArray(parsed.items)) return null;
    return { id: parsed.id, items: parsed.items, createdAt: String(parsed.createdAt ?? '') };
  } catch {
    return null;
  }
}

export function readLastOrder(): LastOrder | null {
  try {
    return parseLastOrder(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function saveLastOrder(order: LastOrder): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // navegador sem storage (aba anônima bloqueada): só perde o atalho
  }
}
