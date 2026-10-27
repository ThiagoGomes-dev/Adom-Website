import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, CreditCard, Receipt, Truck, Store, PackageSearch } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCatalog } from '@/context/CatalogContext';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useCepLookup, formatCep } from '@/hooks/useCepLookup';
import { formatPrice } from '@/lib/currency';
import { getAvailableStock } from '@/lib/stock';
import { createOrder } from '@/lib/api';
import { readLastOrder, saveLastOrder } from '@/lib/lastOrder';
import {
  computeShippingCost,
  FREE_SHIPPING_MIN_SUBTOTAL,
  LOCAL_SHIPPING_CITY,
  type DeliveryMethod,
} from '@/lib/shipping';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const { items, removeItem, updateQuantity, clear, totalPrice, isOpen: open, closeCart: onClose } = useCart();
  const { products } = useCatalog();
  const { address: storeAddress } = useCompanyConfig();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useScrollLock(open);

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [number, setNumber] = useState('');
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const cepDigits = cep.replace(/\D/g, '');
  const phoneDigits = customerPhone.replace(/\D/g, '');
  const phoneInvalid = customerPhone !== '' && (phoneDigits.length < 10 || phoneDigits.length > 11);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customerEmail.trim());
  const lastOrder = open ? readLastOrder() : null;
  const cepLookup = useCepLookup(cep);
  const isPickup = deliveryMethod === 'pickup';
  const freeShipping = totalPrice >= FREE_SHIPPING_MIN_SUBTOTAL;
  // só pra exibir — o valor cobrado é recalculado no admin com a mesma regra
  const shippingCost = computeShippingCost({ method: deliveryMethod, city: cepLookup.city, subtotal: totalPrice });
  const canFinalize =
    customerName.trim() !== '' &&
    phoneDigits.length >= 10 &&
    phoneDigits.length <= 11 &&
    emailValid &&
    (isPickup ||
      (cepDigits.length === 8 &&
        !cepLookup.notFound &&
        street.trim() !== '' &&
        neighborhood.trim() !== '' &&
        number.trim() !== ''));

  // preenche rua/bairro sozinhos quando o CEP resolve — só se a pessoa ainda não tiver digitado nada
  useEffect(() => {
    if (cepLookup.street && !street) setStreet(cepLookup.street);
    if (cepLookup.neighborhood && !neighborhood) setNeighborhood(cepLookup.neighborhood);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cepLookup.street, cepLookup.neighborhood]);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const addressNote = isPickup
    ? 'Retirada na loja'
    : [
        `${street}${number ? `, ${number}` : ''}${neighborhood ? ` - ${neighborhood}` : ''}`,
        reference ? `Referência: ${reference}` : null,
        `CEP: ${cep}${cepLookup.city ? ` (${cepLookup.city})` : ''}`,
      ]
        .filter(Boolean)
        .join('\n');

  // Cria o pedido (reserva o estoque na hora) e redireciona pro Checkout Pro
  // do Mercado Pago — a forma de pagamento (cartão/Pix/boleto) é escolhida
  // lá, não mais aqui; pra nós só importa se foi pago. O carrinho é
  // esvaziado já aqui, porque o cliente nem sempre volta pro site depois de
  // pagar (no Pix é comum fechar a aba). Uma cópia dos itens fica em
  // `lastOrder`: se o pagamento não for concluído, a página do pedido monta
  // o carrinho de novo com um clique.
  const handleFinalize = async () => {
    if (submitting) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const { orderId, checkoutUrl } = await createOrder({
        // o frete NÃO vai no payload: o admin calcula pelo tipo de entrega + CEP
        items: items.map((item) => ({
          productId: item.productId,
          selectedVariants: item.selectedVariants,
          quantity: item.quantity,
        })),
        deliveryMethod,
        cep: isPickup ? undefined : cepDigits,
        customerName: customerName.trim(),
        customerPhone: phoneDigits,
        customerEmail: customerEmail.trim(),
        note: addressNote,
      });
      saveLastOrder({ id: orderId, items, createdAt: new Date().toISOString() });
      clear();
      window.location.href = checkoutUrl;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Não foi possível registrar o pedido. Tente novamente.');
      setSubmitting(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className="absolute inset-y-0 right-0 flex w-[92%] max-w-md flex-col bg-surface shadow-lift"
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho de compras"
          >
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
              <span className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                <ShoppingBag size={20} />
                Seu carrinho
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-ink hover:bg-ink/5"
                aria-label="Fechar carrinho"
              >
                <X size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <span className="rounded-full bg-surface-alt p-4 text-ink-soft">
                  <ShoppingBag size={28} />
                </span>
                <p className="font-semibold text-ink">Seu carrinho está vazio</p>
                <p className="text-sm text-ink-soft">Adicione produtos do catálogo para começar seu pedido.</p>
                <Button to="/produtos" size="sm" onClick={onClose} className="mt-2">
                  Ver produtos
                </Button>
                <Link
                  to={lastOrder ? `/pedido/${lastOrder.id}` : '/acompanhar-pedido'}
                  onClick={onClose}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft underline hover:text-ink"
                >
                  <PackageSearch size={15} />
                  {lastOrder ? 'Acompanhar meu último pedido' : 'Acompanhar um pedido'}
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="space-y-4">
                    <AnimatePresence initial={false}>
                      {items.map((item) => {
                        const itemProduct = products.find((p) => p.id === item.productId);
                        const itemMaxStock = itemProduct ? getAvailableStock(itemProduct, item.selectedVariants) : Infinity;
                        return (
                        <motion.li
                          key={item.cartItemId}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex gap-3 overflow-hidden border-b border-black/5 pb-4"
                        >
                          <img src={item.image} alt={item.name} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <Link to={`/produtos/${item.slug}`} onClick={onClose} className="text-sm font-semibold text-ink hover:underline">
                                {item.name}
                              </Link>
                              <button
                                type="button"
                                onClick={() => removeItem(item.cartItemId)}
                                className="shrink-0 rounded-full p-1.5 text-ink-soft hover:bg-ink/5 hover:text-red-600"
                                aria-label={`Remover ${item.name}`}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <p className="mt-0.5 text-xs text-ink-soft">
                              {Object.entries(item.selectedVariants)
                                .map(([group, option]) => `${group}: ${option}`)
                                .join(' · ')}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="inline-flex items-center rounded-full border border-black/10">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                  className="flex h-7 w-7 items-center justify-center rounded-full text-ink hover:bg-ink/5"
                                  aria-label="Diminuir quantidade"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-6 text-center text-xs font-semibold text-ink">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                  disabled={item.quantity >= itemMaxStock}
                                  className="flex h-7 w-7 items-center justify-center rounded-full text-ink hover:bg-ink/5 disabled:opacity-30"
                                  aria-label="Aumentar quantidade"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <span className="text-sm font-bold text-ink">{formatPrice(item.unitPrice * item.quantity)}</span>
                            </div>
                            {Number.isFinite(itemMaxStock) && item.quantity >= itemMaxStock && (
                              <p className="mt-1 text-xs text-ink-soft">Estoque disponível: {itemMaxStock}</p>
                            )}
                          </div>
                        </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>

                  <button type="button" onClick={clear} className="mt-4 text-xs font-medium text-ink-soft underline hover:text-ink">
                    Esvaziar carrinho
                  </button>

                  <div className="mt-5 space-y-4 border-t border-black/5 pt-4">
                    <div>
                      <p className="text-sm font-semibold text-ink">Seus dados</p>
                      <div className="mt-2 space-y-2">
                        <div>
                          <label htmlFor="cart-customer-name" className="sr-only">
                            Seu nome
                          </label>
                          <input
                            id="cart-customer-name"
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Seu nome"
                            className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                        <div>
                          <label htmlFor="cart-customer-phone" className="sr-only">
                            Seu WhatsApp
                          </label>
                          <input
                            id="cart-customer-phone"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel-national"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="WhatsApp com DDD: (83) 99999-9999"
                            aria-describedby="cart-customer-phone-hint"
                            className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                          />
                          <p
                            id="cart-customer-phone-hint"
                            className={cn('mt-1 text-xs', phoneInvalid ? 'text-red-600' : 'text-ink-soft')}
                          >
                            {phoneInvalid
                              ? 'Confira o número: DDD + número, ex: (83) 99999-9999.'
                              : 'DDD + número, ex: (83) 99999-9999. Usamos para avisar sobre o pedido.'}
                          </p>
                        </div>
                        <div>
                          <label htmlFor="cart-customer-email" className="sr-only">
                            Seu e-mail
                          </label>
                          <input
                            id="cart-customer-email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="Seu e-mail: nome@exemplo.com"
                            aria-invalid={customerEmail !== '' && !emailValid}
                            className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                          />
                          {customerEmail !== '' && !emailValid && (
                            <p className="mt-1 text-xs text-red-600">Confira o e-mail, ex: nome@exemplo.com.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-ink">Como você quer receber?</p>
                      <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Forma de entrega">
                        {(
                          [
                            { value: 'delivery', label: 'Entrega', icon: <Truck size={16} /> },
                            { value: 'pickup', label: 'Retirar na loja', icon: <Store size={16} /> },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            role="radio"
                            aria-checked={deliveryMethod === opt.value}
                            onClick={() => setDeliveryMethod(opt.value)}
                            className={cn(
                              'flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors',
                              deliveryMethod === opt.value
                                ? 'border-accent bg-accent/10 text-ink'
                                : 'border-black/10 text-ink-soft hover:border-black/20',
                            )}
                          >
                            {opt.icon}
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {isPickup ? (
                      <div className="rounded-xl bg-surface-alt p-3.5 text-sm text-ink">
                        <p className="font-semibold">Retirada sem custo de frete</p>
                        {storeAddress && (
                          <p className="mt-1 text-ink-soft">
                            {storeAddress.street} – {storeAddress.neighborhood}, {storeAddress.city}/{storeAddress.state}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-ink-soft">
                          Avisamos pelo WhatsApp quando o pedido estiver separado para retirada.
                        </p>
                      </div>
                    ) : (
                    <>
                    <div>
                      <label htmlFor="cart-cep" className="text-sm font-semibold text-ink">
                        CEP para entrega
                      </label>
                      <input
                        id="cart-cep"
                        type="text"
                        inputMode="numeric"
                        value={cep}
                        onChange={(e) => setCep(formatCep(e.target.value))}
                        placeholder="00000-000"
                        maxLength={9}
                        className="mt-2 w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                      {cepDigits.length === 8 && (
                        <p className="mt-2 text-xs text-ink-soft">
                          {cepLookup.loading
                            ? 'Consultando CEP...'
                            : cepLookup.notFound
                              ? 'CEP não encontrado — confira e tente novamente.'
                              : cepLookup.city
                                ? freeShipping
                                  ? `Entrega em ${cepLookup.city}: frete grátis acima de ${formatPrice(FREE_SHIPPING_MIN_SUBTOTAL)}.`
                                  : `Entrega em ${cepLookup.city}: frete de ${formatPrice(shippingCost)}${
                                      cepLookup.city.localeCompare(LOCAL_SHIPPING_CITY, 'pt-BR', { sensitivity: 'base' }) === 0
                                        ? ' (valor fixo na cidade)'
                                        : ''
                                    }.`
                                : null}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="cart-street" className="text-sm font-semibold text-ink">
                        Rua
                      </label>
                      <input
                        id="cart-street"
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Nome da rua"
                        className="mt-2 w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label htmlFor="cart-neighborhood" className="text-sm font-semibold text-ink">
                          Bairro
                        </label>
                        <input
                          id="cart-neighborhood"
                          type="text"
                          value={neighborhood}
                          onChange={(e) => setNeighborhood(e.target.value)}
                          placeholder="Nome do bairro"
                          className="mt-2 w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                      </div>
                      <div>
                        <label htmlFor="cart-number" className="text-sm font-semibold text-ink">
                          Número
                        </label>
                        <input
                          id="cart-number"
                          type="text"
                          inputMode="numeric"
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                          placeholder="Nº"
                          className="mt-2 w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="cart-reference" className="text-sm font-semibold text-ink">
                        Ponto de referência <span className="font-normal text-ink-soft">(opcional)</span>
                      </label>
                      <input
                        id="cart-reference"
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Ex: perto do mercado, casa azul..."
                        className="mt-2 w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    </div>
                    </>
                    )}
                  </div>
                </div>

                <div className="space-y-3 border-t border-black/5 px-5 py-5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm text-ink-soft">
                      <span>Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-ink-soft">
                      <span>{isPickup ? 'Frete (retirada na loja)' : 'Frete'}</span>
                      <span>
                        {isPickup || freeShipping
                          ? 'Grátis'
                          : !isPickup && !cepLookup.city
                            ? 'Informe o CEP'
                            : formatPrice(shippingCost)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-base">
                      <span className="font-semibold text-ink">Total</span>
                      <span className="font-display text-xl font-bold text-ink">
                        {formatPrice(totalPrice + (!isPickup && !cepLookup.city ? 0 : shippingCost))}
                      </span>
                    </div>
                  </div>
                  {submitError && <p className="text-sm text-red-600">{submitError}</p>}
                  {canFinalize ? (
                    <Button
                      type="button"
                      onClick={handleFinalize}
                      disabled={submitting}
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={<CreditCard size={18} />}
                    >
                      {submitting ? 'Enviando pedido...' : 'Pagar com Mercado Pago'}
                    </Button>
                  ) : (
                    <Button type="button" disabled variant="primary" size="lg" fullWidth icon={<CreditCard size={18} />}>
                      Preencha os dados
                    </Button>
                  )}
                  <div className="flex items-start gap-2 rounded-xl bg-accent/10 p-3 text-xs text-ink">
                    <Receipt size={16} className="mt-0.5 shrink-0 text-accent" />
                    <p>
                      Você será redirecionado ao Mercado Pago para escolher a forma de pagamento (cartão, Pix ou
                      boleto) e pagar com segurança. Assim que o pagamento for aprovado, separamos seu pedido para
                      envio ou retirada.
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
