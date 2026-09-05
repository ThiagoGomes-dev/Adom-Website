import { useMemo, useState } from 'react';
import type { Product } from '@/types';

function initialActiveImage(product: Product, selectedByGroupId: Record<string, string>): number {
  for (const group of product.variants ?? []) {
    const label = selectedByGroupId[group.id];
    const option = group.options.find((o) => o.label === label);
    if (option?.image) {
      const idx = product.images.indexOf(option.image);
      if (idx !== -1) return idx;
    }
  }
  return 0;
}

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
  const [activeImage, setActiveImage] = useState(() => initialActiveImage(product, selectedByGroupId));

  const selectVariant = (groupId: string, optionLabel: string) => {
    setSelectedByGroupId((prev) => ({ ...prev, [groupId]: optionLabel }));

    // se a opção escolhida tiver uma foto vinculada, a galeria acompanha a seleção
    const group = product.variants?.find((g) => g.id === groupId);
    const option = group?.options.find((o) => o.label === optionLabel);
    if (option?.image) {
      const idx = product.images.indexOf(option.image);
      if (idx !== -1) setActiveImage(idx);
    }
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
    activeImage,
    setActiveImage,
  };
}
