import { describe, expect, it } from 'vitest';
import type { Product } from '@/types';
import { getAvailableStock, isOutOfStock, outOfStockLabel, resolvePrice } from '../stock';

function product(overrides: Partial<Product> = {}): Product {
  return {
    id: '1',
    slug: 'camiseta',
    name: 'Camiseta',
    description: '',
    price: 100,
    images: [],
    category: 'camisetas',
    available: true,
    ...overrides,
  };
}

const withVariants = product({
  stockQuantity: 5,
  variantStock: [
    { selection: { Cor: 'Preta', Tamanho: 'P' }, stockQuantity: 0 },
    { selection: { Cor: 'Preta', Tamanho: 'M' }, stockQuantity: 3, price: 120, promoPrice: 110 },
  ],
});

describe('getAvailableStock', () => {
  it('usa o estoque da combinação quando existe', () => {
    expect(getAvailableStock(withVariants, { Cor: 'Preta', Tamanho: 'M' })).toBe(3);
  });

  it('cai no estoque do produto quando a seleção está incompleta', () => {
    expect(getAvailableStock(withVariants, { Cor: 'Preta' })).toBe(5);
  });

  it('sem estoque cadastrado não trava a quantidade', () => {
    expect(getAvailableStock(product())).toBe(Infinity);
  });
});

describe('isOutOfStock', () => {
  it('combinação zerada fica esgotada', () => {
    expect(isOutOfStock(withVariants, { Cor: 'Preta', Tamanho: 'P' })).toBe(true);
    expect(outOfStockLabel(withVariants, { Cor: 'Preta', Tamanho: 'P' })).toBe('Esgotado');
  });

  it('produto marcado como indisponível fica bloqueado', () => {
    expect(isOutOfStock(product({ available: false, stockQuantity: 10 }))).toBe(true);
  });
});

describe('resolvePrice', () => {
  it('usa o preço da variação quando cadastrado', () => {
    expect(resolvePrice(withVariants, { Cor: 'Preta', Tamanho: 'M' })).toEqual({ price: 120, promoPrice: 110 });
  });

  it('herda o preço do produto quando a variação não tem preço próprio', () => {
    expect(resolvePrice(withVariants, { Cor: 'Preta', Tamanho: 'P' })).toEqual({ price: 100, promoPrice: undefined });
  });
});
