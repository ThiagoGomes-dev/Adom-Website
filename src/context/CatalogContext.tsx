import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Category, Product } from '@/types';
import { fetchCategories, fetchProducts } from '@/lib/api';
import { readCachedCatalog, saveCachedCatalog, withRetry } from '@/lib/catalogCache';
import { demoProducts } from '@/data/demo/products';
import { demoCategories } from '@/data/demo/categories';
import { buildCategoryTree, type CategoryNode } from '@/lib/categoryTree';

interface CatalogState {
  products: Product[];
  categories: Category[];
  /** true só enquanto ainda não há nenhum catálogo pra mostrar (nem a cópia salva) */
  loading: boolean;
  /** true enquanto o que está na tela é a cópia salva e a versão atual ainda não chegou */
  stale: boolean;
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

// A busca começa assim que o código do site carrega, sem esperar o React
// montar a página. Produtos e categorias vêm separados: uma falha nas
// categorias não esconde os produtos.
const productsRequest = USE_MOCK_CATALOG ? null : withRetry(fetchProducts);
const categoriesRequest = USE_MOCK_CATALOG ? null : withRetry(fetchCategories);
// evita "unhandled rejection" antes do provider se inscrever
productsRequest?.catch(() => {});
categoriesRequest?.catch(() => {});

function initialState(): CatalogState {
  if (USE_MOCK_CATALOG) return { products: demoProducts, categories: demoCategories, loading: false, stale: false, error: null };
  const cached = readCachedCatalog();
  if (cached) return { products: cached.products, categories: cached.categories, loading: false, stale: true, error: null };
  return { products: [], categories: [], loading: true, stale: false, error: null };
}

/**
 * Busca produtos/categorias do painel admin (adom-admin) uma única vez e
 * disponibiliza pra árvore inteira — é o que substitui os antigos arquivos
 * estáticos em `src/data/demo/*`. Mostra na hora a última versão salva neste
 * navegador e troca pela atual quando ela chega.
 */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>(initialState);

  useEffect(() => {
    if (!productsRequest || !categoriesRequest) return;
    let cancelled = false;

    productsRequest.then(
      (products) => {
        if (!cancelled) setState((s) => ({ ...s, products, loading: false, stale: false, error: null }));
      },
      (err: Error) => {
        // mantém a cópia salva, se houver
        if (!cancelled) setState((s) => ({ ...s, loading: false, stale: false, error: err.message }));
      },
    );
    categoriesRequest.then(
      (categories) => {
        if (!cancelled) setState((s) => ({ ...s, categories }));
      },
      () => {},
    );
    Promise.all([productsRequest, categoriesRequest]).then(
      ([products, categories]) => saveCachedCatalog(products, categories),
      () => {},
    );

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
