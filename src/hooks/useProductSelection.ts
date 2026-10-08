import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/types';
import { getAvailableStock } from '@/lib/stock';

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
 * Seleção inicial dos grupos de variante. Prioriza uma combinação que
 * tenha estoque (`variantStock`) em vez de simplesmente pegar a primeira
 * opção de cada grupo — senão, quando o lote recebido não cobre a
 * primeira opção da lista (ex: tamanho P esgotado, mas M/G com estoque),
 * a página abre travada em "Esgotado" mesmo o produto tendo peças
 * disponíveis em outro tamanho/cor.
 */
function initialSelection(product: Product): Record<string, string> {
  const groups = product.variants ?? [];
  if (groups.length === 0) return {};

  const inStockEntry = product.variantStock?.find((entry) => entry.stockQuantity > 0);
  if (inStockEntry) {
    const fromStock: Record<string, string> = {};
    const matchesAllGroups = groups.every((group) => {
      const label = inStockEntry.selection[group.name];
      if (!label || !group.options.some((o) => o.label === label)) return false;
      fromStock[group.id] = label;
      return true;
    });
    if (matchesAllGroups) return fromStock;
  }

  const initial: Record<string, string> = {};
  groups.forEach((group) => {
    if (group.options[0]) initial[group.id] = group.options[0].label;
  });
  return initial;
}

/**
 * Estado compartilhado de seleção de variantes + quantidade de um produto.
 * Usado tanto pela página de detalhe quanto pelo modal de visualização
 * rápida, para não duplicar essa lógica.
 */
export function useProductSelection(product: Product) {
  const [selectedByGroupId, setSelectedByGroupId] = useState<Record<string, string>>(() =>
    initialSelection(product),
  );
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

  /** Pronto para ser enviado a `buildProductMessage` (nome do grupo -> opção). */
  const selectedVariants = useMemo(() => {
    const map: Record<string, string> = {};
    product.variants?.forEach((group) => {
      const value = selectedByGroupId[group.id];
      if (value) map[group.name] = value;
    });
    return map;
  }, [selectedByGroupId, product.variants]);

  // Teto real de quantidade — antes era um número fixo (99) que ignorava
  // completamente o estoque, deixando adicionar ao carrinho mais peças do
  // que existiam de verdade.
  const maxQuantity = useMemo(() => getAvailableStock(product, selectedVariants), [product, selectedVariants]);

  // se trocar pra uma combinação com menos estoque (ex: de "Preto" com 25 pra
  // "Branco" com 15) enquanto já tinha uma quantidade maior escolhida, baixa
  // sozinho pro novo limite em vez de deixar a quantidade antiga "pendurada"
  useEffect(() => {
    setQuantity((q) => Math.min(q, Math.max(1, maxQuantity)));
  }, [maxQuantity]);

  const increment = () => setQuantity((q) => Math.min(q + 1, maxQuantity));
  const decrement = () => setQuantity((q) => Math.max(q - 1, 1));

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
    maxQuantity,
    selectedVariants,
    allGroupsSelected,
    activeImage,
    setActiveImage,
  };
}
