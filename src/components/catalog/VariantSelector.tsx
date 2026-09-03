import type { ProductVariantGroup } from '@/types';
import { cn } from '@/lib/cn';

interface VariantSelectorProps {
  group: ProductVariantGroup;
  selected?: string;
  onSelect: (optionLabel: string) => void;
}

const isColorGroup = (name: string) => /cor/i.test(name);

/** Seletor de variante (tamanho, cor, etc.) — cor vira swatch, o resto vira pílula. */
export function VariantSelector({ group, selected, onSelect }: VariantSelectorProps) {
  const color = isColorGroup(group.name);

  return (
    <div>
      <p className="text-sm font-semibold text-ink">
        {group.name}
        {selected && <span className="ml-1.5 font-normal text-ink-soft">— {selected}</span>}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {group.options.map((option) => {
          const active = selected === option.label;
          if (color) {
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option.label)}
                title={option.label}
                aria-label={option.label}
                aria-pressed={active}
                className={cn(
                  'h-9 w-9 rounded-full border-2 transition-all',
                  active ? 'border-accent scale-110' : 'border-black/10 hover:scale-105',
                )}
                style={{ backgroundColor: option.meta ?? '#ccc' }}
              />
            );
          }
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.label)}
              aria-pressed={active}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                active
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-black/10 text-ink-soft hover:border-black/20 hover:text-ink',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
