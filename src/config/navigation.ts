import type { CompanyConfig, NavItem } from '@/types';

/**
 * Monta o menu de navegação dinamicamente a partir das páginas/recursos
 * habilitados no `companyConfig`. Assim, ativar/desativar uma página no
 * config já reflete automaticamente no Header e no Footer.
 */
export function buildNavItems(config: CompanyConfig): NavItem[] {
  const items: NavItem[] = [{ label: 'Início', href: '/' }];

  if (config.pages.products && config.features.showCatalog) {
    items.push({ label: 'Produtos', href: '/produtos' });
  }
  if (config.pages.services && config.features.showServices) {
    items.push({ label: 'Serviços', href: '/servicos' });
  }
  if (config.pages.gallery && config.features.showGallery) {
    items.push({ label: 'Galeria', href: '/galeria' });
  }
  if (config.pages.about && config.features.showAbout) {
    items.push({ label: 'Sobre', href: '/sobre' });
  }
  if (config.pages.contact) {
    items.push({ label: 'Contato', href: '/contato' });
  }

  return items;
}
