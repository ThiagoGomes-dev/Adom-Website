import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Category, Product } from '@/types';
import { fetchCategories, fetchProducts } from '@/lib/api';
import { demoProducts } from '@/data/demo/products';
import { demoCategories } from '@/data/demo/categories';

interface CatalogState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const CatalogContext = createContext<CatalogState | null>(null);

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

  return <CatalogContext.Provider value={state}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogState {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog deve ser usado dentro de <CatalogProvider>');
  return ctx;
}
