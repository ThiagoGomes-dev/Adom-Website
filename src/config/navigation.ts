import type { CompanyConfig, NavItem } from '@/types';
import type { CategoryNode } from '@/lib/categoryTree';

/**
 * Monta o menu de navegação dinamicamente a partir das páginas/recursos
 * habilitados no `companyConfig`. Assim, ativar/desativar uma página no
 * config já reflete automaticamente no Header e no Footer.
 */
export function buildNavItems(config: CompanyConfig): NavItem[] {
  const items: NavItem[] = [{ label: 'Início', href: '/' }];

  if (config.pages.products && config.features.showCatalog) {
    items.push({ label: 'Produtos', href: '/produtos' });
    items.push({ label: 'Acompanhar pedido', href: '/acompanhar-pedido' });
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

/**
 * Menu principal do Header/MobileMenu para o modelo "catálogo por categoria":
 * uma entrada por categoria cadastrada no admin, em vez de páginas fixas —
 * quem cadastra a categoria no admin já reflete no menu do site. As
 * subcategorias vêm em `children`, na mesma ordem e profundidade do painel.
 */
export function buildCategoryNavItems(tree: CategoryNode[]): NavItem[] {
  return tree.map((category) => ({
    label: category.name,
    href: `/produtos?categoria=${category.slug}`,
    ...(category.children.length ? { children: buildCategoryNavItems(category.children) } : {}),
  }));
}
