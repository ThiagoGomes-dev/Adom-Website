import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle, Receipt } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useCepLookup, formatCep, isSameCity } from '@/hooks/useCepLookup';
import { buildCartWhatsAppLink, type PaymentMethod } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/currency';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

const FIXED_SHIPPING_CITY = 'Campina Grande';

export function CartDrawer() {
  const config = useCompanyConfig();
  const { items, removeItem, updateQuantity, clear, totalPrice, isOpen: open, closeCart: onClose } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useScrollLock(open);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [number, setNumber] = useState('');
  const [reference, setReference] = useState('');
  const [installments, setInstallments] = useState(1);
  const cepDigits = cep.replace(/\D/g, '');
  const cepLookup = useCepLookup(cep);
  const fixedShipping = isSameCity(cepLookup.city, FIXED_SHIPPING_CITY);
  const canFinalize =
    Boolean(paymentMethod) &&
    cepDigits.length === 8 &&
    street.trim() !== '' &&
    neighborhood.trim() !== '' &&
    number.trim() !== '';

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

  const whatsappHref = buildCartWhatsAppLink(
    config.whatsapp,
    items,
    config.businessName,
    {
      cep,
      city: cepLookup.city,
      fixedShipping,
      street,
      neighborhood,
      number,
      reference,
      paymentMethod: paymentMethod ?? undefined,
      installments,
    },
    config.paymentLink,
  );

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
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="space-y-4">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
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
                                  className="flex h-7 w-7 items-center justify-center rounded-full text-ink hover:bg-ink/5"
                                  aria-label="Aumentar quantidade"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <span className="text-sm font-bold text-ink">{formatPrice(item.unitPrice * item.quantity)}</span>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  <button type="button" onClick={clear} className="mt-4 text-xs font-medium text-ink-soft underline hover:text-ink">
                    Esvaziar carrinho
                  </button>

                  <div className="mt-5 space-y-4 border-t border-black/5 pt-4">
                    <div>
                      <p className="text-sm font-semibold text-ink">Forma de pagamento</p>
                      <div className="mt-2 flex gap-2">
                        {(['pix', 'credito'] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            aria-pressed={paymentMethod === method}
                            className={cn(
                              'flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors',
                              paymentMethod === method
                                ? 'border-accent bg-accent/10 text-ink'
                                : 'border-black/10 text-ink-soft hover:border-black/20 hover:text-ink',
                            )}
                          >
                            {method === 'pix' ? 'Pix' : 'Cartão de crédito'}
                          </button>
                        ))}
                      </div>
                      {paymentMethod === 'credito' && (
                        <div className="mt-3">
                          <label htmlFor="cart-installments" className="text-sm font-semibold text-ink">
                            Parcelas
                          </label>
                          <select
                            id="cart-installments"
                            value={installments}
                            onChange={(e) => setInstallments(Number(e.target.value))}
                            className="mt-2 w-full rounded-xl border border-black/10 bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                              <option key={n} value={n}>
                                {n}x {n <= 2 ? 'sem juros' : 'com juros da maquininha'}
                              </option>
                            ))}
                          </select>
                          <p className="mt-2 text-xs text-ink-soft">
                            Até 2x sem juros. Acima disso, juros da maquininha — consulte no WhatsApp.
                          </p>
                        </div>
                      )}
                    </div>

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
                              : fixedShipping
                                ? `Entrega em ${cepLookup.city}: frete fixo de R$ 12,00.`
                                : cepLookup.city
                                  ? `Entrega em ${cepLookup.city}: frete a consultar no WhatsApp.`
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
                  </div>
                </div>

                <div className="space-y-3 border-t border-black/5 px-5 py-5">
                  <div className="flex items-center justify-between text-base">
                    <span className="font-semibold text-ink">Total</span>
                    <span className="font-display text-xl font-bold text-ink">{formatPrice(totalPrice)}</span>
                  </div>
                  {canFinalize ? (
                    <Button href={whatsappHref} external variant="whatsapp" size="lg" fullWidth icon={<MessageCircle size={18} />}>
                      Finalizar Compra
                    </Button>
                  ) : (
                    <Button type="button" disabled variant="whatsapp" size="lg" fullWidth icon={<MessageCircle size={18} />}>
                      Preencha pagamento e endereço
                    </Button>
                  )}
                  <div className="flex items-start gap-2 rounded-xl bg-accent/10 p-3 text-xs text-ink">
                    <Receipt size={16} className="mt-0.5 shrink-0 text-accent" />
                    <p>
                      Você vai receber o link de pagamento no WhatsApp. Pague o valor do pedido e envie o
                      comprovante na conversa — assim que recebermos, separamos seu pedido para envio ou retirada.
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
