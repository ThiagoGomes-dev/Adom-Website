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

export interface CreateOrderPayload {
  items: { productId: string; selectedVariants: Record<string, string>; quantity: number }[];
  /** forma de pagamento é escolhida no próprio Checkout Pro do Mercado Pago, não aqui */
  shippingCost: number;
  customerName: string;
  customerPhone: string;
  note?: string;
}

/**
 * Cria o pedido ao finalizar a compra — o admin já reserva/debita o
 * estoque na hora (via RPC `create_order`, security definer) e cria a
 * preference do Checkout Pro, devolvendo a URL de pagamento do Mercado
 * Pago pra redirecionar o cliente.
 */
export async function createOrder(payload: CreateOrderPayload): Promise<{ orderId: string; checkoutUrl: string }> {
  if (!BASE_URL) {
    throw new Error('VITE_ADMIN_API_URL não configurada — defina no .env do site.');
  }
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Falha ao criar pedido: ${res.status}`);
  }
  return res.json();
}
