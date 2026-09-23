import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, Product } from '@/types';
import { isOutOfStock } from '@/lib/stock';

const STORAGE_KEY = 'cart:v1';

interface AddToCartInput {
  product: Product;
  selectedVariants: Record<string, string>;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (input: AddToCartInput) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Chave estável por produto + combinação de variantes, para somar quantidades de itens idênticos. */
function buildCartItemId(productId: string, selectedVariants: Record<string, string>): string {
  const variantKey = Object.entries(selectedVariants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, option]) => `${group}:${option}`)
    .join('|');
  return `${productId}__${variantKey}`;
}

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Estado global do carrinho, persistido em localStorage. O fluxo é:
 * selecionar variantes/quantidade de um produto -> `addItem` -> repetir para
 * outros produtos -> abrir o carrinho -> "Finalizar pelo WhatsApp" envia o
 * histórico completo (ver `buildCartWhatsAppLink` em `src/lib/whatsapp.ts`).
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());
  const [isOpen, setIsOpen] = useState(false);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback(({ product, selectedVariants, quantity }: AddToCartInput) => {
    if (isOutOfStock(product, selectedVariants)) return;
    const cartItemId = buildCartItemId(product.id, selectedVariants);

    setItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      const newItem: CartItem = {
        cartItemId,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        unitPrice: product.promoPrice ?? product.price,
        selectedVariants,
        quantity,
      };
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.cartItemId !== cartItemId)
        : prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clear, totalItems, totalPrice, isOpen, openCart, closeCart }),
    [items, addItem, removeItem, updateQuantity, clear, totalItems, totalPrice, isOpen, openCart, closeCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>');
  return ctx;
}
