import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle, Copy, Check, Truck, Store, MessageCircle, ShoppingBag, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { SEO } from '@/components/layout/SEO';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { fetchOrder, lookupOrder, OrderNotFoundError, type PublicOrder } from '@/lib/api';
import { buildTimeline, stageCopy } from '@/lib/orderStatus';
import { readLastOrder } from '@/lib/lastOrder';
import { formatPrice } from '@/lib/currency';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { cn } from '@/lib/cn';

/** Enquanto o pagamento não confirma, relê o pedido de tempos em tempos (o webhook pode levar alguns segundos). */
const POLL_INTERVAL_MS = 8000;
const POLL_MAX_ATTEMPTS = 40;

const formatDateTime = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : null;

const inputClass =
  'w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';

function TrackingCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // sem permissão de área de transferência: o código continua visível pra copiar à mão
    }
  };

  return (
    <div className="rounded-2xl border border-black/5 bg-surface-alt p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft">Código de rastreio</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <span className="font-mono text-lg font-bold tracking-wider text-ink">{code}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <a
        href="https://rastreamento.correios.com.br/app/index.php"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex text-sm font-semibold text-brand underline"
      >
        Rastrear nos Correios
      </a>
    </div>
  );
}

function OrderDetails({ order }: { order: PublicOrder }) {
  const config = useCompanyConfig();
  const navigate = useNavigate();
  const { replaceItems, openCart } = useCart();
  const copy = stageCopy(order);
  const timeline = buildTimeline(order);
  const isPickup = order.deliveryMethod === 'pickup';
  const lastOrder = readLastOrder();
  const canRebuildCart = order.stage === 'cancelled' && lastOrder?.id === order.id && lastOrder.items.length > 0;
  const helpLink = generateWhatsAppLink(config.whatsapp, `Olá! Tenho uma dúvida sobre o pedido #${order.code}.`);

  const toneClasses = {
    success: 'bg-emerald-100 text-emerald-600',
    pending: 'bg-amber-100 text-amber-600',
    failure: 'bg-red-100 text-red-600',
  } as const;
  const Icon = copy.tone === 'success' ? CheckCircle2 : copy.tone === 'pending' ? Clock : XCircle;

  const rebuildCart = () => {
    if (!lastOrder) return;
    replaceItems(lastOrder.items);
    navigate('/produtos');
    openCart();
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <span className={cn('flex h-16 w-16 items-center justify-center rounded-full', toneClasses[copy.tone])}>
          <Icon size={32} />
        </span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">Pedido #{order.code}</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">{copy.title}</h1>
        <p className="mt-3 max-w-md text-sm text-ink-soft sm:text-base">
          {order.customerFirstName
            ? `${order.customerFirstName}, ${copy.message.charAt(0).toLowerCase()}${copy.message.slice(1)}`
            : copy.message}
        </p>
      </div>

      {order.trackingCode && !isPickup && <TrackingCode code={order.trackingCode} />}

      <ol className="rounded-2xl border border-black/5 bg-surface p-5">
        {timeline.map((step, i) => (
          <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
            {i < timeline.length - 1 && (
              <span
                aria-hidden
                className={cn('absolute left-[11px] top-6 h-[calc(100%-1.25rem)] w-0.5', step.done ? 'bg-emerald-500' : 'bg-black/10')}
              />
            )}
            <span
              className={cn(
                'relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                step.failed
                  ? 'border-red-500 bg-red-500 text-white'
                  : step.done
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-black/15 bg-surface',
              )}
            >
              {step.failed ? <XCircle size={14} /> : step.done && <Check size={14} />}
            </span>
            <div className="flex flex-col">
              <span className={cn('text-sm font-semibold', step.done ? 'text-ink' : 'text-ink-soft')}>{step.label}</span>
              {step.at && <span className="text-xs text-ink-soft">{formatDateTime(step.at)}</span>}
            </div>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-black/5 bg-surface p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          {isPickup ? <Store size={16} /> : <Truck size={16} />}
          {isPickup ? 'Retirada na loja' : 'Entrega no endereço'}
        </p>
        {isPickup && config.address && (
          <p className="mt-1 text-sm text-ink-soft">
            {config.address.street}
            {config.address.neighborhood ? ` – ${config.address.neighborhood}` : ''}, {config.address.city}/
            {config.address.state}
          </p>
        )}
        <ul className="mt-4 divide-y divide-black/5">
          {order.items.map((item, i) => (
            <li key={`${item.name}-${i}`} className="flex justify-between gap-4 py-2.5 text-sm">
              <div className="flex flex-col">
                <span className="font-semibold text-ink">{item.name}</span>
                <span className="text-xs text-ink-soft">
                  {item.variantLabel ? `${item.variantLabel} · ` : ''}
                  {item.quantity} × {formatPrice(item.unitPrice)}
                </span>
              </div>
              <span className="font-semibold text-ink">{formatPrice(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 space-y-1 border-t border-black/5 pt-3 text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>Produtos</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-soft">
            <span>Frete</span>
            <span>{isPickup ? 'Retirada' : order.shippingCost > 0 ? formatPrice(order.shippingCost) : 'Grátis'}</span>
          </div>
          <div className="flex justify-between pt-1 text-base font-bold text-ink">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {canRebuildCart ? (
          <Button type="button" onClick={rebuildCart} icon={<ShoppingBag size={16} />}>
            Montar o carrinho de novo
          </Button>
        ) : (
          <Button to="/produtos">Continuar comprando</Button>
        )}
        <Button href={helpLink} external variant="whatsapp" icon={<MessageCircle size={16} />}>
          Dúvidas sobre o pedido
        </Button>
      </div>
      <p className="text-center text-xs text-ink-soft">
        Guarde o link desta página para acompanhar o pedido, ou use "Acompanhar pedido" com o número #{order.code} e o
        seu telefone.
      </p>
    </div>
  );
}

/** Página "Meu pedido" (`/pedido/:orderId`): status real do pedido, lido do painel. */
export function OrderPage() {
  const { orderId = '' } = useParams();
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const load = async () => {
      try {
        const result = await fetchOrder(orderId);
        if (cancelled) return;
        setOrder(result);
        setError(null);
        attempts += 1;
        if (result.stage === 'pending' && attempts < POLL_MAX_ATTEMPTS) {
          timer = setTimeout(load, POLL_INTERVAL_MS);
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof OrderNotFoundError) setNotFound(true);
        else setError('Não foi possível carregar o pedido agora. Atualize a página em instantes.');
      }
    };
    load();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderId]);

  return (
    <>
      <SEO title={order ? `Pedido #${order.code}` : 'Meu pedido'} />
      <Container className="min-h-[60vh] py-16 sm:py-20">
        {order ? (
          <OrderDetails order={order} />
        ) : notFound ? (
          <div className="flex flex-col items-center text-center">
            <h1 className="font-display text-2xl font-bold text-ink">Pedido não encontrado</h1>
            <p className="mt-3 max-w-md text-sm text-ink-soft">Confira o link ou procure pelo número do pedido e telefone.</p>
            <div className="mt-6">
              <Button to="/acompanhar-pedido">Acompanhar pedido</Button>
            </div>
          </div>
        ) : error ? (
          <p className="text-center text-sm text-red-600">{error}</p>
        ) : (
          <p className="text-center text-sm text-ink-soft">Carregando seu pedido...</p>
        )}
      </Container>
    </>
  );
}

/** "Acompanhar pedido" (`/acompanhar-pedido`): número do pedido + telefone da compra → página do pedido. */
export function TrackOrderPage() {
  const navigate = useNavigate();
  const lastOrder = readLastOrder();
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const orderId = await lookupOrder(code.trim(), phone.replace(/\D/g, ''));
      navigate(`/pedido/${orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível consultar agora.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Acompanhar pedido" />
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 sm:py-20">
        <div className="w-full max-w-md">
          <h1 className="text-center font-display text-2xl font-bold text-ink sm:text-3xl">Acompanhar pedido</h1>
          <p className="mt-3 text-center text-sm text-ink-soft">
            Digite o número do pedido (está na mensagem que enviamos, ex: #7F3A2C1D) e o telefone usado na compra.
          </p>

          {lastOrder && (
            <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-center text-sm text-ink">
              Você tem um pedido feito neste aparelho.
              <div className="mt-3">
                <Button to={`/pedido/${lastOrder.id}`} size="sm">
                  Ver meu último pedido
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <div>
              <label htmlFor="track-code" className="mb-1 block text-sm font-semibold text-ink">
                Número do pedido
              </label>
              <input
                id="track-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: 7F3A2C1D"
                autoCapitalize="characters"
                className={cn(inputClass, 'uppercase')}
              />
            </div>
            <div>
              <label htmlFor="track-phone" className="mb-1 block text-sm font-semibold text-ink">
                Telefone da compra
              </label>
              <input
                id="track-phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: (83) 99999-9999"
                className={inputClass}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" fullWidth disabled={submitting || !code.trim() || !phone.trim()} icon={<Search size={16} />}>
              {submitting ? 'Procurando...' : 'Ver pedido'}
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
}
