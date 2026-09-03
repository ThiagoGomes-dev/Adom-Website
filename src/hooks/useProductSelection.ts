import { useMemo, useState } from 'react';
import type { Product } from '@/types';

/**
 * Estado compartilhado de seleção de variantes + quantidade de um produto.
 * Usado tanto pela página de detalhe quanto pelo modal de visualização
 * rápida, para não duplicar essa lógica.
 */
export function useProductSelection(product: Product) {
  const [selectedByGroupId, setSelectedByGroupId] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.variants?.forEach((group) => {
      if (group.options[0]) initial[group.id] = group.options[0].label;
    });
    return initial;
  });
  const [quantity, setQuantity] = useState(1);

  const selectVariant = (groupId: string, optionLabel: string) => {
    setSelectedByGroupId((prev) => ({ ...prev, [groupId]: optionLabel }));
  };

  const increment = () => setQuantity((q) => Math.min(q + 1, 99));
  const decrement = () => setQuantity((q) => Math.max(q - 1, 1));

  /** Pronto para ser enviado a `buildProductMessage` (nome do grupo -> opção). */
  const selectedVariants = useMemo(() => {
    const map: Record<string, string> = {};
    product.variants?.forEach((group) => {
      const value = selectedByGroupId[group.id];
      if (value) map[group.name] = value;
    });
    return map;
  }, [selectedByGroupId, product.variants]);

  const allGroupsSelected = useMemo(
    () => (product.variants ?? []).every((group) => Boolean(selectedByGroupId[group.id])),
    [product.variants, selectedByGroupId],
  );

  return {
    selectedByGroupId,
    selectVariant,
    quantity,
    setQuantity,
    increment,
    decrement,
    selectedVariants,
    allGroupsSelected,
  };
}
