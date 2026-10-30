/** Divide uma lista em páginas de tamanho fixo (a última pode ficar menor). */
export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (size < 1) return [items.slice()];
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages;
}

/** Embaralha uma cópia da lista (Fisher-Yates). `random` é injetável para os testes. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
