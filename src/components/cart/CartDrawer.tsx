import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { useScrollLock } from '@/hooks/useScrollLock';
import { buildCartWhatsAppLink } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/currency';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const config = useCompanyConfig();
  const { items, removeItem, updateQuantity, clear, totalPrice, isOpen: open, closeCart: onClose } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const whatsappHref = buildCartWhatsAppLink(config.whatsapp, items, config.businessName);

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
                </div>

                <div className="space-y-3 border-t border-black/5 px-5 py-5">
                  <div className="flex items-center justify-between text-base">
                    <span className="font-semibold text-ink">Total</span>
                    <span className="font-display text-xl font-bold text-ink">{formatPrice(totalPrice)}</span>
                  </div>
                  <Button href={whatsappHref} external variant="whatsapp" size="lg" fullWidth icon={<MessageCircle size={18} />}>
                    Finalizar pelo WhatsApp
                  </Button>
                  <p className="text-center text-xs text-ink-soft">
                    Você confirma o pagamento e a entrega diretamente com a gente pelo WhatsApp.
                  </p>
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
