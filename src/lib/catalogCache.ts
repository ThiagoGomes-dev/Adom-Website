import type { Category, Product } from '@/types';

const STORAGE_KEY = 'catalog:v1';
/** Depois disso a cópia salva é descartada em vez de mostrada enquanto o catálogo novo carrega. */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Última versão do catálogo vista neste navegador. Quem já visitou o site vê
 * os produtos na hora, enquanto a versão atual chega do painel por trás e
 * substitui a cópia.
 */
export interface CachedCatalog {
  products: Product[];
  categories: Category[];
  savedAt: number;
}

export function parseCachedCatalog(raw: string | null, now = Date.now()): CachedCatalog | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.products) || !Array.isArray(parsed?.categories)) return null;
    const savedAt = Number(parsed.savedAt);
    if (!Number.isFinite(savedAt) || now - savedAt > MAX_AGE_MS) return null;
    return { products: parsed.products, categories: parsed.categories, savedAt };
  } catch {
    return null;
  }
}

export function readCachedCatalog(): CachedCatalog | null {
  try {
    return parseCachedCatalog(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function saveCachedCatalog(products: Product[], categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ products, categories, savedAt: Date.now() }));
  } catch {
    // sem espaço ou bloqueado (aba anônima): o site só perde o atalho
  }
}

/**
 * Tenta de novo quando a chamada falha. A primeira visita depois de um tempo
 * parado pega o painel "frio" (a função da Vercel e o banco acordando), e
 * essa primeira resposta às vezes falha ou demora demais.
 */
export async function withRetry<T>(
  task: () => Promise<T>,
  { attempts = 3, baseDelayMs = 800 }: { attempts?: number; baseDelayMs?: number } = {},
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await task();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) await new Promise((resolve) => setTimeout(resolve, baseDelayMs * 2 ** i));
    }
  }
  throw lastError;
}
