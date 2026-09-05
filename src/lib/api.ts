import type { Category, Product } from '@/types';

const BASE_URL = import.meta.env.VITE_ADMIN_API_URL ?? '';

async function getJson<T>(path: string): Promise<T> {
  if (!BASE_URL) {
    throw new Error('VITE_ADMIN_API_URL não configurada — defina no .env do site.');
  }
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Falha ao buscar ${path}: ${res.status}`);
  return res.json();
}

/** Busca o catálogo de produtos publicado no painel admin (adom-admin). */
export function fetchProducts(): Promise<Product[]> {
  return getJson<Product[]>('/api/products');
}

/** Busca as categorias cadastradas no painel admin (adom-admin). */
export function fetchCategories(): Promise<Category[]> {
  return getJson<Category[]>('/api/categories');
}
