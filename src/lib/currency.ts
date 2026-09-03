/** Formata um valor numérico como moeda (padrão: Real brasileiro). */
export function formatPrice(value: number, currency = 'BRL', locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/** Calcula o percentual de desconto entre preço cheio e preço promocional. */
export function discountPercent(price: number, promoPrice?: number): number | null {
  if (!promoPrice || promoPrice >= price) return null;
  return Math.round(((price - promoPrice) / price) * 100);
}
