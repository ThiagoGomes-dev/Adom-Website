import type { Product } from '@/types';

type VariantStockEntry = NonNullable<Product['variantStock']>[number];

/** Acha a entrada de `variantStock` cuja combinação bate exatamente com a seleção completa (todos os grupos escolhidos). `undefined` quando o produto não tem dado de estoque por variante, ou a seleção ainda está incompleta. */
function findComboEntry(product: Product, selection: Record<string, string>): VariantStockEntry | undefined {
  if (!product.variantStock || product.variantStock.length === 0) return undefined;

  const entries = Object.entries(selection);
  if (entries.length === 0) return undefined;

  return product.variantStock.find(
    (entry) =>
      entries.every(([group, option]) => entry.selection[group] === option) &&
      Object.keys(entry.selection).length === entries.length,
  );
}

/** Estoque só de uma combinação específica de variantes escolhida (ex: Preta + P). `undefined` quando o produto não tem dado de estoque por variante — nesse caso, use `product.stockQuantity`. */
export function getComboStock(product: Product, selection: Record<string, string>): number | undefined {
  return findComboEntry(product, selection)?.stockQuantity;
}

/** Preço específico da combinação de variantes escolhida, quando o admin cadastrou um — `undefined` quando a variação não tem preço próprio (nesse caso, use `product.price`/`product.promoPrice`). */
export function getComboPrice(product: Product, selection: Record<string, string>): { price: number; promoPrice?: number } | undefined {
  const entry = findComboEntry(product, selection);
  if (!entry || entry.price == null) return undefined;
  return { price: entry.price, promoPrice: entry.promoPrice };
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

/** Preço/promo já resolvidos: usa o da variação selecionada quando ela tem preço próprio, senão cai no preço do produto. */
export function resolvePrice(product: Product, selectedVariants?: Record<string, string>): { price: number; promoPrice?: number } {
  const comboPrice = selectedVariants ? getComboPrice(product, selectedVariants) : undefined;
  if (comboPrice) return comboPrice;
  return { price: product.price, promoPrice: product.promoPrice };
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
