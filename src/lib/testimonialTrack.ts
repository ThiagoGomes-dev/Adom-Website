/**
 * Monta a faixa do carrossel de depoimentos. O Google devolve no máximo 5
 * avaliações, então repetimos a lista até ter cartões suficientes para
 * preencher telas largas, e duplicamos para o loop (a animação anda -50%).
 */
export function buildTestimonialTrack<T>(items: T[], minItems = 8): T[] {
  if (!items.length) return [];
  const base: T[] = [];
  while (base.length < minItems) base.push(...items);
  return [...base, ...base];
}
