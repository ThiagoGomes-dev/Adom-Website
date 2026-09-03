import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

/** Seletor de quantidade com toque confortável no celular. */
export function QuantitySelector({ quantity, onIncrement, onDecrement }: QuantitySelectorProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink">Quantidade</p>
      <div className="mt-2.5 inline-flex items-center rounded-full border border-black/10">
        <button
          type="button"
          onClick={onDecrement}
          disabled={quantity <= 1}
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 disabled:opacity-30"
          aria-label="Diminuir quantidade"
        >
          <Minus size={16} />
        </button>
        <span className="w-10 text-center text-sm font-semibold text-ink" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
          aria-label="Aumentar quantidade"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
