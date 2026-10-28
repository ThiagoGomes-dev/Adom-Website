import { describe, expect, it } from 'vitest';
import { buildCategoryTree, categoryPath, slugsWithin } from '../categoryTree';
import type { Category } from '@/types';

const categories: Category[] = [
  { id: 'r', name: 'Regatas', slug: 'regatas', sortOrder: 1 },
  { id: 'c', name: 'Camisetas', slug: 'camisetas', sortOrder: 0 },
  { id: 'c2', name: 'Oversized', slug: 'camisetas-oversized', parentId: 'c', sortOrder: 0 },
  { id: 'c1', name: 'Básicas', slug: 'camisetas-basicas', parentId: 'c', sortOrder: 1 },
  { id: 'c21', name: 'Estampadas', slug: 'estampadas', parentId: 'c2' },
];

const tree = buildCategoryTree(categories);

describe('buildCategoryTree', () => {
  it('monta os níveis na ordem do painel', () => {
    expect(tree.map((c) => c.name)).toEqual(['Camisetas', 'Regatas']);
    expect(tree[0].children.map((c) => c.name)).toEqual(['Oversized', 'Básicas']);
    expect(tree[0].children[0].children.map((c) => c.name)).toEqual(['Estampadas']);
  });

  it('funciona com a API antiga, sem parentId nem sortOrder', () => {
    const flat = buildCategoryTree([
      { id: 'b', name: 'Regatas', slug: 'regatas' },
      { id: 'a', name: 'Camisetas', slug: 'camisetas' },
    ]);
    expect(flat.map((c) => [c.name, c.children.length])).toEqual([
      ['Camisetas', 0],
      ['Regatas', 0],
    ]);
  });
});

describe('categoryPath', () => {
  it('devolve o caminho da raiz até a categoria', () => {
    expect(categoryPath(tree, 'estampadas').map((c) => c.name)).toEqual(['Camisetas', 'Oversized', 'Estampadas']);
    expect(categoryPath(tree, 'nao-existe')).toEqual([]);
  });
});

describe('slugsWithin', () => {
  it('inclui as subcategorias de todos os níveis', () => {
    expect([...slugsWithin(tree, 'camisetas')].sort()).toEqual([
      'camisetas',
      'camisetas-basicas',
      'camisetas-oversized',
      'estampadas',
    ]);
    expect([...slugsWithin(tree, 'regatas')]).toEqual(['regatas']);
  });
});
