import type { Category } from '@/types';

export interface CategoryNode extends Category {
  children: CategoryNode[];
}

/** Mesma ordem do painel: a posição definida arrastando, depois o nome. */
function compareCategories(a: Category, b: Category): number {
  return (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name, 'pt-BR');
}

/**
 * Monta a árvore de categorias (quantos níveis o painel tiver) a partir da
 * lista plana da API. Categoria cujo pai não veio na lista fica na raiz.
 */
export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const ids = new Set(categories.map((c) => c.id));
  const childrenOf = new Map<string | null, Category[]>();
  for (const c of categories) {
    const key = c.parentId && ids.has(c.parentId) ? c.parentId : null;
    childrenOf.set(key, [...(childrenOf.get(key) ?? []), c]);
  }

  const seen = new Set<string>();
  const build = (parentId: string | null): CategoryNode[] =>
    (childrenOf.get(parentId) ?? [])
      .filter((c) => !seen.has(c.id) && seen.add(c.id))
      .sort(compareCategories)
      .map((c) => ({ ...c, children: build(c.id) }));

  return build(null);
}

/** Caminho da raiz até a categoria do slug (ex: [Camisetas, Oversized]); vazio se não existir. */
export function categoryPath(tree: CategoryNode[], slug: string | null | undefined): CategoryNode[] {
  if (!slug) return [];
  for (const node of tree) {
    if (node.slug === slug) return [node];
    const sub = categoryPath(node.children, slug);
    if (sub.length) return [node, ...sub];
  }
  return [];
}

/** Slugs de uma categoria e de todas as subcategorias abaixo dela. */
export function subtreeSlugs(node: CategoryNode): Set<string> {
  const out = new Set<string>();
  const walk = (n: CategoryNode) => {
    out.add(n.slug);
    n.children.forEach(walk);
  };
  walk(node);
  return out;
}

/**
 * Slugs que contam como "dentro" do filtro: escolher Camisetas mostra também
 * os produtos de Camisetas › Oversized. Slug desconhecido filtra só por ele mesmo.
 */
export function slugsWithin(tree: CategoryNode[], slug: string): Set<string> {
  const path = categoryPath(tree, slug);
  return path.length ? subtreeSlugs(path[path.length - 1]) : new Set([slug]);
}
