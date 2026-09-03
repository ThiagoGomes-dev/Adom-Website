import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Rola para o topo a cada troca de rota — comportamento esperado em um site tradicional. */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}
