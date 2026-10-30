import type { Category, Product, Testimonial } from '@/types';
import type { DeliveryMethod } from '@/lib/shipping';

const BASE_URL = (import.meta.env.VITE_ADMIN_API_URL ?? '').replace(/\/$/, '');

/** Uma tentativa que passa disso é abandonada (e repetida pelo `withRetry` do catálogo). */
const TIMEOUT_MS = 12_000;

function timeoutSignal(): AbortSignal | undefined {
  // navegadores antigos (Safari < 16) não têm AbortSignal.timeout: ficam sem limite
  return typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(TIMEOUT_MS) : undefined;
}

async function getJson<T>(path: string): Promise<T> {
  if (!BASE_URL) {
    throw new Error('VITE_ADMIN_API_URL não configurada — defina no .env do site.');
  }
  const res = await fetch(`${BASE_URL}${path}`, { signal: timeoutSignal() });
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

export interface GoogleReviews {
  placeUrl: string | null;
  rating: number | null;
  totalReviews: number | null;
  reviews: Testimonial[];
}

interface GoogleReviewsResponse {
  placeUrl: string | null;
  rating: number | null;
  totalReviews: number | null;
  reviews: { id: string; name: string; content: string; rating: number; avatar?: string; authorUrl?: string; reviewUrl?: string; relativeTime?: string }[];
}

/** Avaliações do Google Maps que o painel guarda por 1 dia (`GET /api/reviews`). */
export async function fetchGoogleReviews(): Promise<GoogleReviews> {
  const data = await getJson<GoogleReviewsResponse>('/api/reviews');
  return {
    placeUrl: data.placeUrl,
    rating: data.rating,
    totalReviews: data.totalReviews,
    reviews: (data.reviews ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      role: r.relativeTime,
      content: r.content,
      rating: r.rating,
      avatar: r.avatar,
      authorUrl: r.authorUrl,
      reviewUrl: r.reviewUrl,
      source: 'google' as const,
    })),
  };
}

export interface CreateOrderPayload {
  items: { productId: string; selectedVariants: Record<string, string>; quantity: number }[];
  /**
   * Entrega ou retirada + CEP — o admin calcula o frete a partir disso (não
   * mandamos valor de frete). A forma de pagamento é escolhida no próprio
   * Checkout Pro do Mercado Pago, não aqui.
   */
  deliveryMethod: DeliveryMethod;
  cep?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
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

/** Etapa do pedido como o painel calcula (ver `src/lib/orderTracking.ts` do adom-admin). */
export type OrderStage = 'pending' | 'toShip' | 'ready' | 'shipped' | 'cancelled';

/** O que a página "Meu pedido" recebe do painel — sem telefone, e-mail ou endereço. */
export interface PublicOrder {
  id: string;
  code: string;
  stage: OrderStage;
  deliveryMethod: 'delivery' | 'pickup' | null;
  customerFirstName: string | null;
  items: { name: string; variantLabel: string | null; quantity: number; unitPrice: number }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  trackingCode: string | null;
  createdAt: string;
  confirmedAt: string | null;
  readyAt: string | null;
  shippedAt: string | null;
  cancelledAt: string | null;
}

export class OrderNotFoundError extends Error {}

/** Situação atual de um pedido, pelo id completo (o link que o cliente recebe). */
export async function fetchOrder(orderId: string): Promise<PublicOrder> {
  if (!BASE_URL) {
    throw new Error('VITE_ADMIN_API_URL não configurada — defina no .env do site.');
  }
  const res = await fetch(`${BASE_URL}/api/orders/${encodeURIComponent(orderId)}`, { cache: 'no-store' });
  if (res.status === 404) throw new OrderNotFoundError('Pedido não encontrado.');
  if (!res.ok) throw new Error(`Falha ao consultar o pedido: ${res.status}`);
  return res.json();
}

/** "Acompanhar pedido": troca número curto + telefone pelo id completo do pedido. */
export async function lookupOrder(code: string, phone: string): Promise<string> {
  if (!BASE_URL) {
    throw new Error('VITE_ADMIN_API_URL não configurada — defina no .env do site.');
  }
  const res = await fetch(`${BASE_URL}/api/orders/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, phone }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.error ?? 'Não foi possível consultar agora. Tente em instantes.');
  return body.orderId as string;
}
