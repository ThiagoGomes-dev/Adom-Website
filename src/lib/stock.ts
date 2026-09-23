import type { Product } from '@/types';

/** Estoque só de uma combinação específica de variantes escolhida (ex: Preta + P). `undefined` quando o produto não tem dado de estoque por variante — nesse caso, use `product.stockQuantity`. */
export function getComboStock(product: Product, selection: Record<string, string>): number | undefined {
  if (!product.variantStock || product.variantStock.length === 0) return undefined;

  const entries = Object.entries(selection);
  if (entries.length === 0) return undefined;

  const match = product.variantStock.find(
    (entry) =>
      entries.every(([group, option]) => entry.selection[group] === option) &&
      Object.keys(entry.selection).length === entries.length,
  );
  return match?.stockQuantity;
}

/** Esgotado (estoque zerado) ou marcado como indisponível no admin — em ambos os casos o produto fica visível na vitrine, mas bloqueado para compra. Quando `selectedVariants` é informado e o produto tem estoque por variante, considera o estoque daquela combinação específica em vez do total do produto. */
export function isOutOfStock(product: Product, selectedVariants?: Record<string, string>): boolean {
  if (!product.available) return true;

  if (selectedVariants) {
    const comboStock = getComboStock(product, selectedVariants);
    if (comboStock !== undefined) return comboStock <= 0;
  }

  return typeof product.stockQuantity === 'number' && product.stockQuantity <= 0;
}

/** Rótulo do badge exibido quando o produto (ou a combinação de variantes selecionada) não pode ser comprado. */
export function outOfStockLabel(product: Product, selectedVariants?: Record<string, string>): string {
  if (selectedVariants) {
    const comboStock = getComboStock(product, selectedVariants);
    if (comboStock !== undefined) return comboStock <= 0 ? 'Esgotado' : 'Indisponível';
  }
  if (typeof product.stockQuantity === 'number' && product.stockQuantity <= 0) return 'Esgotado';
  return 'Indisponível';
}
