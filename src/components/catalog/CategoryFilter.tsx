import type { Category } from '@/types';
import { cn } from '@/lib/cn';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

interface CategoryFilterProps {
  categories: Category[];
  active: string | null;
  onChange: (categoryId: string | null) => void;
}

/** Filtro de categorias em pílulas roláveis — confortável no celular. */
export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
          active === null
            ? 'border-ink bg-ink text-white'
            : 'border-black/10 text-ink-soft hover:border-black/20 hover:text-ink',
        )}
      >
        Todos
      </button>
      {categories.map((category) => {
        const isActive = active === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'border-ink bg-ink text-white'
                : 'border-black/10 text-ink-soft hover:border-black/20 hover:text-ink',
            )}
          >
            {category.icon && <DynamicIcon name={category.icon} size={14} />}
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
