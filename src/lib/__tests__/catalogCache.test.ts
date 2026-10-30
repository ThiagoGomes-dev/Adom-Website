import { describe, expect, it, vi } from 'vitest';
import { parseCachedCatalog, withRetry } from '../catalogCache';

const DAY = 24 * 60 * 60 * 1000;

describe('parseCachedCatalog', () => {
  it('lê a cópia salva', () => {
    const raw = JSON.stringify({ products: [{ id: 'a' }], categories: [], savedAt: 1000 });
    expect(parseCachedCatalog(raw, 1000 + DAY)).toEqual({ products: [{ id: 'a' }], categories: [], savedAt: 1000 });
  });

  it('descarta cópia com mais de 7 dias', () => {
    const raw = JSON.stringify({ products: [], categories: [], savedAt: 0 });
    expect(parseCachedCatalog(raw, 8 * DAY)).toBeNull();
  });

  it('descarta conteúdo vazio, inválido ou com formato errado', () => {
    expect(parseCachedCatalog(null)).toBeNull();
    expect(parseCachedCatalog('{quebrado')).toBeNull();
    expect(parseCachedCatalog(JSON.stringify({ products: 'x', categories: [], savedAt: 1 }))).toBeNull();
  });
});

describe('withRetry', () => {
  it('tenta de novo até dar certo', async () => {
    const task = vi.fn().mockRejectedValueOnce(new Error('frio')).mockResolvedValue('ok');
    await expect(withRetry(task, { baseDelayMs: 0 })).resolves.toBe('ok');
    expect(task).toHaveBeenCalledTimes(2);
  });

  it('desiste depois do limite de tentativas e devolve o último erro', async () => {
    const task = vi.fn().mockRejectedValue(new Error('fora do ar'));
    await expect(withRetry(task, { attempts: 3, baseDelayMs: 0 })).rejects.toThrow('fora do ar');
    expect(task).toHaveBeenCalledTimes(3);
  });
});
