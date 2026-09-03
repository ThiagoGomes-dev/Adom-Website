import { ShoppingBag } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/cn';

interface CartButtonProps {
  className?: string;
}

/** Ícone de carrinho com contador animado — usado no header. */
export function CartButton({ className }: CartButtonProps) {
  const { totalItems, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className={cn('relative inline-flex items-center justify-center rounded-full p-2.5', className ?? 'text-ink hover:bg-ink/5')}
      aria-label={`Abrir carrinho${totalItems > 0 ? ` (${totalItems} ${totalItems === 1 ? 'item' : 'itens'})` : ''}`}
    >
      <ShoppingBag size={20} />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            key={totalItems}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white"
          >
            {totalItems > 9 ? '9+' : totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
