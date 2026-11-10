import { track as vercelTrack } from '@vercel/analytics';

/**
 * Medição de acessos e do funil de compra:
 * visita → viu produto → adicionou ao carrinho → abriu o carrinho → finalizou (foi pro Mercado Pago).
 * (Pagamento aprovado não é medido aqui: quem paga no Pix muitas vezes nem volta
 * pro site; as vendas reais já estão no painel.)
 *
 * Manda cada passo para dois lugares:
 * - Vercel Web Analytics (`<Analytics />` no App): visitas, páginas, origem e UTM.
 *   Os eventos do funil só aparecem no painel da Vercel no plano Pro; no
 *   Hobby a chamada é ignorada sem erro.
 * - Meta Pixel, quando `VITE_META_PIXEL_ID` está definido: o Gerenciador de
 *   Anúncios passa a mostrar quantos do tráfego pago chegaram em cada passo,
 *   e o Meta usa isso para otimizar as campanhas.
 *
 * Tudo aqui é "melhor esforço": qualquer falha (bloqueador de anúncio, script
 * fora do ar) é engolida, nunca quebra a loja.
 */

type FbqFn = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim();

let pixelReady = false;

/** Carrega o Meta Pixel (snippet oficial, reescrito em TS). Só roda uma vez. */
export function initAnalytics() {
  if (pixelReady || !PIXEL_ID || typeof window === 'undefined') return;
  try {
    if (!window.fbq) {
      const fbq: FbqFn = function (...args: unknown[]) {
        if (fbq.callMethod) fbq.callMethod(...args);
        else fbq.queue!.push(args);
      };
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
      window.fbq = fbq;
      window._fbq = fbq;
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
    }
    window.fbq('init', PIXEL_ID);
    pixelReady = true;
  } catch {
    // sem pixel, segue a vida
  }
}

function pixel(kind: 'track' | 'trackCustom', event: string, data?: Record<string, unknown>) {
  if (!pixelReady || !window.fbq) return;
  try {
    window.fbq(kind, event, data);
  } catch {
    // ignora
  }
}

function vercel(event: string, data?: Record<string, string | number | boolean | null>) {
  try {
    vercelTrack(event, data);
  } catch {
    // ignora
  }
}

/** Uma visita a uma página. Chamado a cada troca de rota (a loja é SPA). */
export function trackPageView() {
  pixel('track', 'PageView');
}

interface ProductInfo {
  id: string;
  name: string;
  price: number;
}

export function trackViewProduct(product: ProductInfo) {
  vercel('Viu produto', { produto: product.name });
  pixel('track', 'ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: 'BRL',
  });
}

export function trackAddToCart(product: ProductInfo, quantity: number) {
  vercel('Adicionou ao carrinho', { produto: product.name, quantidade: quantity });
  pixel('track', 'AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price * quantity,
    currency: 'BRL',
  });
}

export function trackOpenCart(totalItems: number, value: number) {
  vercel('Abriu o carrinho', { itens: totalItems, valor: value });
  pixel('trackCustom', 'AbriuCarrinho', { num_items: totalItems, value, currency: 'BRL' });
}

/** Pedido criado e cliente mandado pro Mercado Pago. */
export function trackBeginCheckout(productIds: string[], totalItems: number, value: number) {
  vercel('Foi para o pagamento', { itens: totalItems, valor: value });
  pixel('track', 'InitiateCheckout', {
    content_ids: productIds,
    content_type: 'product',
    num_items: totalItems,
    value,
    currency: 'BRL',
  });
}

export function trackWhatsAppClick(where: string) {
  vercel('Clicou no WhatsApp', { onde: where });
  pixel('track', 'Contact', { content_name: where });
}
