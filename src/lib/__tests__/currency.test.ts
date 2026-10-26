import { describe, expect, it } from 'vitest';
import { discountPercent } from '../currency';

describe('discountPercent', () => {
  it('calcula o percentual arredondado', () => {
    expect(discountPercent(100, 79.9)).toBe(20);
  });

  it('sem promoção ou promoção maior que o preço devolve null', () => {
    expect(discountPercent(100)).toBeNull();
    expect(discountPercent(100, 100)).toBeNull();
    expect(discountPercent(100, 120)).toBeNull();
  });
});
