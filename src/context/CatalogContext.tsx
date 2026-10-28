import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Category, Product } from '@/types';
import { fetchCategories, fetchProducts } from '@/lib/api';
import { demoProducts } from '@/data/demo/products';
import { demoCategories } from '@/data/demo/categories';
import { buildCategoryTree, type CategoryNode } from '@/lib/categoryTree';

interface CatalogState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

interface CatalogValue extends CatalogState {
  /** categorias principais com as subcategorias dentro (`categories` continua sendo a lista plana) */
  categoryTree: CategoryNode[];
}

const CatalogContext = createContext<CatalogValue | null>(null);

// Liga só localmente (.env.local, nunca commitado/usado em produção) para
// visualizar layout/animações do catálogo sem depender dos produtos reais
// do admin, que vão direto para produção.
const USE_MOCK_CATALOG = import.meta.env.VITE_USE_MOCK_CATALOG === 'true';

/**
 * Busca produtos/categorias do painel admin (adom-admin) uma única vez e
 * disponibiliza pra árvore inteira — é o que substitui os antigos arquivos
 * estáticos em `src/data/demo/*`.
 */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>({ products: [], categories: [], loading: true, error: null });

  useEffect(() => {
    if (USE_MOCK_CATALOG) {
      setState({ products: demoProducts, categories: demoCategories, loading: false, error: null });
      return;
    }

    let cancelled = false;

    Promise.all([fetchProducts(), fetchCategories()])
      .then(([products, categories]) => {
        if (!cancelled) setState({ products, categories, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ products: [], categories: [], loading: false, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ ...state, categoryTree: buildCategoryTree(state.categories) }), [state]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog deve ser usado dentro de <CatalogProvider>');
  return ctx;
}
