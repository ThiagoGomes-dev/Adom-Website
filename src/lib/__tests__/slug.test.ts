import { describe, expect, it } from 'vitest';
import { slugify } from '../slug';

describe('slugify', () => {
  it('remove acentos, pontuação e troca espaços por hífen', () => {
    expect(slugify('Camiseta Básica, Preta!')).toBe('camiseta-basica-preta');
  });
});
