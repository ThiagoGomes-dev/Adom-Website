import { useEffect } from 'react';
import { useCompanyConfig } from '@/context/CompanyConfigContext';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

/**
 * Ajusta title/description/OG por página, mantendo a base do
 * `companyConfig.seo` como fallback. Sem dependências externas — usa a API
 * nativa do document, suficiente para uma SPA deste porte.
 */
export function SEO({ title, description, image }: SEOProps) {
  const config = useCompanyConfig();

  useEffect(() => {
    const fullTitle = title ? `${title} | ${config.businessName}` : config.seo.title;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const desc = description ?? config.seo.description;
    setMeta('description', desc);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:image', image ?? config.seo.ogImage ?? '', 'property');
  }, [title, description, image, config]);

  return null;
}
