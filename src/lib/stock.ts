import type { Product } from '@/types';

/** Esgotado (estoque zerado) ou marcado como indisponível no admin — em ambos os casos o produto fica visível na vitrine, mas bloqueado para compra. */
export function isOutOfStock(product: Product): boolean {
  if (!product.available) return true;
  return typeof product.stockQuantity === 'number' && product.stockQuantity <= 0;
}

/** Rótulo do badge exibido quando o produto não pode ser comprado. */
export function outOfStockLabel(product: Product): string {
  if (typeof product.stockQuantity === 'number' && product.stockQuantity <= 0) return 'Esgotado';
  return 'Indisponível';
}
