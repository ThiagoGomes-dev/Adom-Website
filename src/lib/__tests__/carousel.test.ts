import { describe, expect, it } from 'vitest';
import { chunk, shuffle } from '../carousel';

describe('chunk', () => {
  it('divide em páginas e deixa a última menor', () => {
    expect(chunk([1, 2, 3, 4, 5, 6, 7], 3)).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it('lista vazia não gera páginas', () => {
    expect(chunk([], 6)).toEqual([]);
  });
});

describe('shuffle', () => {
  it('mantém os mesmos itens sem alterar a lista original', () => {
    const original = [1, 2, 3, 4, 5];
    const result = shuffle(original, () => 0);
    expect(result).not.toBe(original);
    expect([...result].sort()).toEqual(original);
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });
});
