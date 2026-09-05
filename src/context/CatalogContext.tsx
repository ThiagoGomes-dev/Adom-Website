import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Category, Product } from '@/types';
import { fetchCategories, fetchProducts } from '@/lib/api';

interface CatalogState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const CatalogContext = createContext<CatalogState | null>(null);

/**
 * Busca produtos/categorias do painel admin (adom-admin) uma única vez e
 * disponibiliza pra árvore inteira — é o que substitui os antigos arquivos
 * estáticos em `src/data/demo/*`.
 */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>({ products: [], categories: [], loading: true, error: null });

  useEffect(() => {
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
