import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import type { CategoryNode } from '@/lib/categoryTree';
import { categoryPath } from '@/lib/categoryTree';
import { cn } from '@/lib/cn';

const categoryHref = (slug: string) => `/produtos?categoria=${slug}`;

// Ao clicar num item o foco ficaria no link e o dropdown (aberto por
// focus-within) continuaria aberto na página seguinte.
const blurAfterClick = () => (document.activeElement as HTMLElement | null)?.blur();

/**
 * Menu de categorias do topo (desktop). Categoria com subcategorias abre um
 * dropdown ao passar o mouse ou focar pelo teclado, com os níveis de baixo
 * recuados — tudo na ordem definida arrastando no painel.
 */
export function CategoryNav({ tree, activeSlug }: { tree: CategoryNode[]; activeSlug: string | null }) {
  const activeRoot = categoryPath(tree, activeSlug)[0]?.id;

  return (
    <nav className="hidden items-center gap-8 lg:flex" aria-label="Categorias">
      {tree.map((category) => {
        const linkClass = cn(
          'text-xs font-semibold uppercase tracking-[0.18em] transition-colors',
          activeRoot === category.id ? 'text-white' : 'text-white/55 hover:text-white group-hover:text-white',
        );

        if (!category.children.length) {
          return (
            <Link key={category.id} to={categoryHref(category.slug)} className={linkClass}>
              {category.name}
            </Link>
          );
        }

        return (
          <div key={category.id} className="group relative">
            <Link
              to={categoryHref(category.slug)}
              onClick={blurAfterClick}
              aria-haspopup="true"
              className={cn(linkClass, 'inline-flex items-center gap-1 py-2')}
            >
              {category.name}
              <ChevronDown size={13} className="transition-transform group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="min-w-56 rounded-xl border border-white/10 bg-ink p-2 shadow-2xl">
                <Link
                  to={categoryHref(category.slug)}
                  onClick={blurAfterClick}
                  className="block whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55 hover:bg-white/5 hover:text-white"
                >
                  Ver tudo em {category.name}
                </Link>
                <SubcategoryList nodes={category.children} depth={0} activeSlug={activeSlug} />
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

function SubcategoryList({ nodes, depth, activeSlug }: { nodes: CategoryNode[]; depth: number; activeSlug: string | null }) {
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.id}>
          <Link
            to={categoryHref(node.slug)}
            onClick={blurAfterClick}
            style={{ paddingLeft: 12 + depth * 14 }}
            className={cn(
              'block whitespace-nowrap rounded-lg py-2 pr-3 text-sm transition-colors hover:bg-white/5 hover:text-white',
              activeSlug === node.slug ? 'text-white' : depth === 0 ? 'text-white/85' : 'text-white/60',
            )}
          >
            {node.name}
          </Link>
          {node.children.length > 0 && <SubcategoryList nodes={node.children} depth={depth + 1} activeSlug={activeSlug} />}
        </li>
      ))}
    </ul>
  );
}
