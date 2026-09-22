/**
 * Tipos centrais da plataforma.
 *
 * Este arquivo é o "contrato" entre configuração (dados de um cliente) e
 * componentes (layout/apresentação). Nenhum componente deve depender de um
 * negócio específico — apenas destes tipos genéricos.
 */

// ---------------------------------------------------------------------------
// Negócio / plano
// ---------------------------------------------------------------------------

export type BusinessType =
  | 'landing'
  | 'institutional'
  | 'catalog'
  | 'catalog-categories'
  | 'services'
  | 'custom';

export type PlanTier = 'basico' | 'catalogo' | 'completo';

// ---------------------------------------------------------------------------
// Navegação
// ---------------------------------------------------------------------------

export interface NavItem {
  label: string;
  href: string;
}

// ---------------------------------------------------------------------------
// Contato / redes sociais / endereço
// ---------------------------------------------------------------------------

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
}

export interface BusinessHours {
  day: string;
  hours: string;
}

export interface AddressInfo {
  street: string;
  neighborhood?: string;
  city: string;
  state: string;
  zip?: string;
  mapsUrl?: string;
  mapsEmbedUrl?: string;
}

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  favicon?: string;
  locale?: string;
}

// ---------------------------------------------------------------------------
// Tema visual
// ---------------------------------------------------------------------------

export interface ThemeColor {
  /** "R G B" — ex: "180 133 74" */
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  text: string;
  textSoft: string;
  surface: string;
  surfaceAlt: string;
}

export interface ThemeConfig {
  colors: ThemeColor;
  radius?: string;
}

// ---------------------------------------------------------------------------
// Recursos ativáveis / páginas ativáveis (por plano ou por escolha do cliente)
// ---------------------------------------------------------------------------

export interface FeatureFlags {
  showCatalog: boolean;
  showPrices: boolean;
  showPromotions: boolean;
  showReviews: boolean;
  showGallery: boolean;
  showAddress: boolean;
  showInstagram: boolean;
  showTestimonials: boolean;
  showFAQ: boolean;
  showServices: boolean;
  showAbout: boolean;
  showBenefits: boolean;
  showAdvancedFilters: boolean;
}

export interface PagesConfig {
  home: boolean;
  products: boolean;
  services: boolean;
  about: boolean;
  contact: boolean;
  gallery: boolean;
}

// ---------------------------------------------------------------------------
// Conteúdo — Hero
// ---------------------------------------------------------------------------

export type CtaAction = 'whatsapp' | 'products' | 'services' | 'link';

export interface CtaButton {
  label: string;
  action: CtaAction;
  href?: string;
}

export interface HeroContent {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  primaryCta: CtaButton;
  secondaryCta?: CtaButton;
  image?: string;
  imageAlt?: string;
  /** Quando houver mais de uma imagem, o Hero exibe um carrossel de fundo (crossfade automático). */
  images?: string[];
}

export interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Stat {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

// ---------------------------------------------------------------------------
// Configuração central da empresa (companyConfig)
// ---------------------------------------------------------------------------

export interface CompanyConfig {
  businessName: string;
  tagline?: string;
  businessType: BusinessType;
  plan: PlanTier;
  logo?: string;
  /** versão compacta da marca (ex: só a inicial), usada em espaços pequenos como o header mobile */
  logoIcon?: string;
  favicon?: string;
  whatsapp: string; // somente dígitos, com DDI. ex: 5511999998888
  whatsappDisplay?: string; // ex: (11) 99999-8888
  /** Link de pagamento (ex: Mercado Pago) incluído na mensagem de finalização do pedido pelo WhatsApp. */
  paymentLink?: string;
  email?: string;
  phone?: string;
  address?: AddressInfo;
  social: SocialLinks;
  hours?: BusinessHours[];
  theme: ThemeConfig;
  seo: SEOConfig;
  hero: HeroContent;
  benefits?: Benefit[];
  stats?: Stat[];
  marqueeItems?: string[];
  highlightQuote?: string;
  aboutTitle?: string;
  aboutText?: string;
  /** Linha de destaque curta exibida ao final do texto (ex: um slogan de fechamento). */
  aboutClosing?: string;
  aboutImage?: string;
  features: FeatureFlags;
  pages: PagesConfig;
  currency?: string; // padrão BRL
}

// ---------------------------------------------------------------------------
// Catálogo de produtos
// ---------------------------------------------------------------------------

export interface ProductVariantOption {
  id: string;
  label: string;
  /** valor extra (ex: código hex para cor) usado para exibição */
  meta?: string;
  /** foto do produto (deve ser uma das URLs em `Product.images`) a mostrar quando esta opção é selecionada */
  image?: string;
}

export interface ProductVariantGroup {
  id: string;
  name: string;
  options: ProductVariantOption[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  promoPrice?: number;
  images: string[];
  category: string; // Category['id']
  variants?: ProductVariantGroup[];
  available: boolean;
  /** Quantidade em estoque, cadastrada no admin. Quando <= 0, o produto aparece no site mas fica bloqueado para compra. */
  stockQuantity?: number;
  featured?: boolean;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  /** Imagem de capa cadastrada no admin — usada na grade "compre por categoria". */
  image?: string;
}

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest';

// ---------------------------------------------------------------------------
// Serviços
// ---------------------------------------------------------------------------

export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  price?: number;
  priceLabel?: string;
  image?: string;
  featured?: boolean;
}

// ---------------------------------------------------------------------------
// Prova social / institucional
// ---------------------------------------------------------------------------

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating?: number; // 1-5
  avatar?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

// ---------------------------------------------------------------------------
// Seleção do usuário no modal/página de produto
// ---------------------------------------------------------------------------

export interface ProductSelection {
  product: Product;
  /** nome do grupo de variante (ex: "Cor") -> rótulo da opção escolhida (ex: "Preto") */
  selectedVariants: Record<string, string>;
  quantity: number;
}

// ---------------------------------------------------------------------------
// Carrinho
// ---------------------------------------------------------------------------

export interface CartItem {
  /** id estável = produto + variantes escolhidas, para poder mesclar quantidades de itens iguais */
  cartItemId: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  /** nome do grupo de variante -> rótulo da opção escolhida */
  selectedVariants: Record<string, string>;
  quantity: number;
}
