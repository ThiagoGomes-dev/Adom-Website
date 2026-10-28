import type { CategoryNode } from '@/lib/categoryTree';
import { categoryPath } from '@/lib/categoryTree';
import { cn } from '@/lib/cn';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

interface CategoryFilterProps {
  tree: CategoryNode[];
  active: string | null;
  onChange: (categorySlug: string | null) => void;
}

/**
 * Filtro de categorias em pílulas roláveis — confortável no celular. A
 * primeira linha tem as categorias principais; ao escolher uma que tem
 * subcategorias, aparece uma linha com elas embaixo (e assim por diante).
 */
export function CategoryFilter({ tree, active, onChange }: CategoryFilterProps) {
  const path = categoryPath(tree, active);
  const levels = [
    { parent: null as CategoryNode | null, nodes: tree },
    ...path.filter((node) => node.children.length).map((node) => ({ parent: node, nodes: node.children })),
  ];

  return (
    <div className="flex flex-col gap-2">
      {levels.map(({ parent, nodes }) => (
        <div
          key={parent?.id ?? 'root'}
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0"
        >
          <Pill active={parent ? active === parent.slug : active === null} onClick={() => onChange(parent?.slug ?? null)} small={!!parent}>
            {parent ? `Tudo em ${parent.name}` : 'Todos'}
          </Pill>
          {nodes.map((category) => (
            <Pill
              key={category.id}
              active={path.some((p) => p.id === category.id)}
              onClick={() => onChange(category.slug)}
              small={!!parent}
            >
              {category.icon && <DynamicIcon name={category.icon} size={14} />}
              {category.name}
            </Pill>
          ))}
        </div>
      ))}
    </div>
  );
}

function Pill({
  active,
  small,
  onClick,
  children,
}: {
  active: boolean;
  small: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex shrink-0 items-center gap-1.5 rounded-full border font-medium transition-colors',
        small ? 'px-3.5 py-1.5 text-[13px]' : 'px-4 py-2 text-sm',
        active ? 'border-ink bg-ink text-white' : 'border-black/10 text-ink-soft hover:border-black/20 hover:text-ink',
      )}
    >
      {children}
    </button>
  );
}
