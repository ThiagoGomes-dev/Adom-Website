import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/lib/analytics';

/**
 * A loja é SPA: o navegador não recarrega ao trocar de página, então o Meta
 * Pixel precisa ser avisado a cada troca de rota. (O `<Analytics />` da
 * Vercel já detecta isso sozinho.)
 */
export function PageViewTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackPageView();
  }, [pathname]);
  return null;
}
