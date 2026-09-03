import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import type { CompanyConfig } from '@/types';
import { companyConfig as defaultConfig } from '@/config/site.config';

const CompanyConfigContext = createContext<CompanyConfig | null>(null);

interface ProviderProps {
  config?: CompanyConfig;
  children: ReactNode;
}

/**
 * Disponibiliza o `companyConfig` para toda a árvore de componentes e aplica
 * o tema (cores/raio de borda) como variáveis CSS em `:root`. É assim que a
 * troca de cliente muda a aparência inteira do site sem tocar em CSS.
 */
export function CompanyConfigProvider({ config = defaultConfig, children }: ProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    const { colors } = config.theme;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-dark', colors.primaryDark);
    root.style.setProperty('--color-primary-light', colors.primaryLight);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-soft', colors.textSoft);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-surface-alt', colors.surfaceAlt);
    if (config.theme.radius) root.style.setProperty('--radius', config.theme.radius);
  }, [config]);

  useEffect(() => {
    document.title = config.seo.title;

    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', config.seo.description);
    if (config.seo.keywords?.length) setMeta('keywords', config.seo.keywords.join(', '));
    setMeta('og:title', config.seo.title, 'property');
    setMeta('og:description', config.seo.description, 'property');
    setMeta('og:type', 'website', 'property');
    if (config.seo.ogImage) setMeta('og:image', config.seo.ogImage, 'property');

    if (config.favicon) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = config.favicon;
    }
  }, [config]);

  const value = useMemo(() => config, [config]);

  return <CompanyConfigContext.Provider value={value}>{children}</CompanyConfigContext.Provider>;
}

/** Hook de acesso ao config central da empresa (dados, tema, feature flags). */
export function useCompanyConfig(): CompanyConfig {
  const ctx = useContext(CompanyConfigContext);
  if (!ctx) {
    throw new Error('useCompanyConfig deve ser usado dentro de <CompanyConfigProvider>');
  }
  return ctx;
}
