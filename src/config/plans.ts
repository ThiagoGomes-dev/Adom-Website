import type { FeatureFlags, PagesConfig, PlanTier } from '@/types';

/**
 * Padrões de funcionalidades/páginas por plano comercial.
 *
 * Isso é o que torna a base "vendável" em níveis: ao criar o site de um
 * cliente, basta escolher `plan` em `companyConfig.ts` e o produto certo de
 * seções/páginas já vem habilitado. Qualquer flag pode ser sobrescrita
 * manualmente em `features`/`pages` no config do cliente.
 *
 * PLANO BÁSICO   — landing page (hero, sobre, serviços, contato, whatsapp, mapa)
 * PLANO CATÁLOGO — básico + produtos, categorias, busca, página de produto
 * PLANO COMPLETO — catálogo + galeria, depoimentos, FAQ, filtros avançados
 */
export const PLAN_FEATURES: Record<PlanTier, FeatureFlags> = {
  basico: {
    showCatalog: false,
    showPrices: false,
    showPromotions: false,
    showReviews: false,
    showGallery: false,
    showAddress: true,
    showInstagram: true,
    showTestimonials: false,
    showFAQ: false,
    showServices: true,
    showAbout: true,
    showBenefits: true,
    showAdvancedFilters: false,
  },
  catalogo: {
    showCatalog: true,
    showPrices: true,
    showPromotions: true,
    showReviews: false,
    showGallery: false,
    showAddress: true,
    showInstagram: true,
    showTestimonials: true,
    showFAQ: false,
    showServices: true,
    showAbout: true,
    showBenefits: true,
    showAdvancedFilters: false,
  },
  completo: {
    showCatalog: true,
    showPrices: true,
    showPromotions: true,
    showReviews: true,
    showGallery: true,
    showAddress: true,
    showInstagram: true,
    showTestimonials: true,
    showFAQ: true,
    showServices: true,
    showAbout: true,
    showBenefits: true,
    showAdvancedFilters: true,
  },
};

export const PLAN_PAGES: Record<PlanTier, PagesConfig> = {
  basico: {
    home: true,
    products: false,
    services: true,
    about: true,
    contact: true,
    gallery: false,
  },
  catalogo: {
    home: true,
    products: true,
    services: true,
    about: true,
    contact: true,
    gallery: false,
  },
  completo: {
    home: true,
    products: true,
    services: true,
    about: true,
    contact: true,
    gallery: true,
  },
};

/** Mescla os padrões do plano com overrides explícitos do cliente. */
export function resolveFeatures(plan: PlanTier, overrides?: Partial<FeatureFlags>): FeatureFlags {
  return { ...PLAN_FEATURES[plan], ...overrides };
}

export function resolvePages(plan: PlanTier, overrides?: Partial<PagesConfig>): PagesConfig {
  return { ...PLAN_PAGES[plan], ...overrides };
}
