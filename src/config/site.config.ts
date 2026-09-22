import type { CompanyConfig } from '@/types';
import { resolveFeatures, resolvePages } from './plans';

/**
 * ⚙️ ARQUIVO DE PERSONALIZAÇÃO POR CLIENTE
 * ------------------------------------------------------------------
 * Este é o ÚNICO arquivo que precisa mudar para transformar esta base em
 * outro negócio (loja de roupas → barbearia → oficina → clínica...). Nenhum
 * componente deve conter texto, cor ou número de WhatsApp fixo — tudo lê
 * daqui através de `useCompanyConfig()`.
 *
 * Para trocar de cliente:
 *  1. Ajuste os dados abaixo (nome, contatos, textos, tema);
 *  2. Troque os arquivos em `src/data/demo/*` pelos dados reais do cliente;
 *  3. Escolha o `plan` correspondente ao pacote contratado.
 */
const plan = 'completo' as const;

export const companyConfig: CompanyConfig = {
  businessName: 'ADOM',
  tagline: 'Camisetas básicas premium para o seu dia a dia',
  businessType: 'catalog-categories',
  plan,
  logo: '/img/adom.png', // logotipo oficial vetorizado, fundo transparente
  logoIcon: '/img/adom-icon-white.png', // só o "A" em branco — usado em espaços compactos (header mobile)
  favicon: '/favicon-192.png',
  currency: 'BRL',

  whatsapp: '5583991826139',
  whatsappDisplay: '(83) 99182-6139',
  paymentLink: 'https://link.mercadopago.com.br/siteadom',
  email: 'contato@adom.com.br',
  phone: '(83) 99182-6139',

  address: {
    street: 'Rua Tiradentes, 21',
    neighborhood: 'Centro (Metroshop)',
    city: 'Campina Grande',
    state: 'PB',
    mapsUrl: 'https://maps.google.com/?q=Rua+Tiradentes+21+Centro+Campina+Grande+PB',
    // Formato "output=embed" funciona sem precisar de chave de API do Google Maps —
    // basta trocar o texto da busca pelo endereço real do cliente.
    mapsEmbedUrl: 'https://www.google.com/maps?q=Rua+Tiradentes,+21,+Centro,+Campina+Grande,+PB&output=embed',
  },

  social: {
    instagram: 'https://instagram.com/adom',
    facebook: 'https://facebook.com/adom',
  },

  hours: [
    { day: 'Segunda a sexta', hours: '9h às 18h' },
    { day: 'Sábado', hours: '9h às 14h' },
    { day: 'Domingo', hours: 'Fechado' },
  ],

  theme: {
    colors: {
      // Paleta oficial ADOM: azul-marinho (#001444) como tom dominante, mesclado
      // com cinza e branco. Preto reservado só para detalhes bem pontuais —
      // não é mais usado como fundo de seção (header, hero etc.).
      primary: '0 20 68', // #001444 — azul-marinho oficial da marca
      primaryDark: '0 12 41', // variação mais escura do mesmo azul
      primaryLight: '46 74 128',
      accent: '201 173 138', // bege — destaque por cima do azul-marinho
      text: '0 20 68', // texto no mesmo azul-marinho, em vez de preto puro
      textSoft: '110 120 135', // cinza — neutro de apoio
      surface: '255 255 255',
      surfaceAlt: '241 242 244', // cinza bem claro, em vez do bege-claro anterior
    },
    radius: '0.625rem',
  },

  seo: {
    title: 'ADOM — Camisetas Básicas Premium',
    description:
      'Camisetas básicas premium em algodão de qualidade. Monte seu pedido e finalize direto pelo WhatsApp.',
    keywords: ['camiseta básica', 'camiseta premium', 'loja de camisetas', 'moda masculina', 'ADOM'],
    ogImage: '/img/hero-combo-wide.jpg',
    favicon: '/favicon-192.png',
    locale: 'pt_BR',
  },

  hero: {
    eyebrow: 'Nova coleção',
    title: 'Onde ser único\né ser o primeiro\nSeja ADOM.',
    highlight: 'ADOM',
    primaryCta: { label: 'Ver camisetas', action: 'products' },
    secondaryCta: { label: 'Falar no WhatsApp', action: 'whatsapp' },
    image: '/img/hero-combo-wide.jpg',
    imageAlt: 'Camisetas ADOM em exposição na loja, sob o letreiro da marca',
    images: ['/img/imagem-fundo01.jpeg', '/img/imagem-fundo02.jpeg'],
  },

  marqueeItems: [
    'FRETE GRÁTIS A PARTIR DE R$ 399,90',
    'DIVIDIMOS EM ATÉ 6X SEM JUROS',
  ],
  highlightQuote: 'Onde ser único é ser o primeiro. Seja ADOM.',

  stats: [
    { id: 'anos', value: 6, suffix: '+', label: 'anos de estrada' },
    { id: 'pedidos', value: 8400, suffix: '+', label: 'pedidos entregues' },
    { id: 'clientes', value: 3100, suffix: '+', label: 'clientes satisfeitos' },
    { id: 'avaliacao', value: 4.8, label: 'avaliação média' },
  ],

  aboutTitle: 'Sobre a ADOM',
  aboutText:
    'A ADOM nasceu para o homem que acredita que estilo está nos detalhes.\n\n' +
    'Criamos peças que unem qualidade, conforto e sofisticação, com um design moderno e atemporal pensado para acompanhar diferentes momentos da rotina masculina.\n\n' +
    'Nossa essência está na simplicidade bem-feita. Valorizamos tecidos selecionados, modelagens que proporcionam um bom caimento e acabamentos que fazem a diferença. Do básico essencial às peças que completam o visual, cada produto ADOM é desenvolvido para oferecer versatilidade, personalidade e elegância.\n\n' +
    'Mais do que vestir, queremos representar um estilo de vida: autêntico, confiante e sem excessos.\n\n' +
    'ADOM — para quem escolhe ser único.',
  aboutClosing: 'Seja ADOM',
  aboutImage: '/img/adom.png',

  features: resolveFeatures(plan, { showServices: false }),
  // Sobre virou uma seção dentro da própria home (antes do rodapé) em vez de
  // página separada; Galeria e Contato não são usados neste site.
  pages: resolvePages(plan, { about: false, gallery: false, contact: false }),
};
