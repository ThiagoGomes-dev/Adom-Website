import type { Product } from '@/types';

const colorGroup = (options: { id: string; label: string; meta: string }[]) => ({
  id: 'cor',
  name: 'Cor',
  options,
});

const sizeGroup = (labels: string[]) => ({
  id: 'tamanho',
  name: 'Tamanho',
  options: labels.map((label) => ({ id: label.toLowerCase(), label })),
});

const sizes = sizeGroup(['P', 'M', 'G', 'GG']);

/**
 * Catálogo ADOM — camisetas básicas premium, fotografadas na loja física.
 * Cada cor é o próprio produto (uma peça, uma foto real), no padrão comum
 * de marcas de básicos.
 */
export const products: Product[] = [
  {
    id: 'p01',
    slug: 'camiseta-basica-preta',
    name: 'Camiseta Básica Preta',
    description:
      'Camiseta básica em algodão penteado, corte reto e caimento confortável para o dia a dia. Gola careca reforçada e etiqueta ADOM bordada no peito.',
    shortDescription: 'Algodão penteado, corte reto.',
    price: 99.9,
    promoPrice: 79.9,
    images: ['/img/camisa5.jpeg'],
    category: 'camisetas',
    variants: [sizes],
    available: true,
    featured: true,
    tags: ['mais vendido'],
  },
  {
    id: 'p02',
    slug: 'camiseta-basica-branca',
    name: 'Camiseta Básica Branca',
    description:
      'Camiseta básica branca em algodão penteado, essencial no guarda-roupa. Corte reto, tecido macio e resistente à lavagem.',
    shortDescription: 'Algodão penteado, essencial.',
    price: 99.9,
    images: ['/img/camisa7.jpeg'],
    category: 'camisetas',
    variants: [sizes],
    available: true,
    featured: true,
  },
  {
    id: 'p03',
    slug: 'camiseta-basica-azul-marinho',
    name: 'Camiseta Básica Azul Marinho',
    description:
      'Camiseta básica azul-marinho em algodão penteado, corte reto e caimento confortável. Combina com qualquer produção, do casual ao mais arrumado.',
    shortDescription: 'Algodão penteado, azul-marinho.',
    price: 99.9,
    images: ['/img/camisa2.jpeg', '/img/camisa4.jpeg'],
    category: 'camisetas',
    variants: [sizes],
    available: true,
    featured: true,
    tags: ['promoção'],
  },
  {
    id: 'p04',
    slug: 'camiseta-basica-areia',
    name: 'Camiseta Básica Areia',
    description: 'Camiseta básica no tom areia, algodão penteado com toque macio e caimento reto que não deforma na lavagem.',
    shortDescription: 'Algodão penteado, tom areia.',
    price: 99.9,
    images: ['/img/camisa1.jpeg'],
    category: 'camisetas',
    variants: [sizes],
    available: true,
  },
  {
    id: 'p05',
    slug: 'camiseta-basica-marrom',
    name: 'Camiseta Básica Marrom',
    description: 'Camiseta básica marrom em algodão penteado, corte reto e gola careca reforçada. Uma cor curinga para fechar qualquer look.',
    shortDescription: 'Algodão penteado, tom marrom.',
    price: 99.9,
    images: ['/img/camisa3.jpeg'],
    category: 'camisetas',
    variants: [sizes],
    available: true,
  },
  {
    id: 'p06',
    slug: 'camiseta-basica-verde-musgo',
    name: 'Camiseta Básica Verde Musgo',
    description: 'Camiseta básica verde-musgo em algodão penteado, corte reto e caimento confortável para usar em qualquer ocasião.',
    shortDescription: 'Algodão penteado, verde-musgo.',
    price: 99.9,
    images: ['/img/camisa6.jpeg'],
    category: 'camisetas',
    variants: [sizes],
    available: true,
    featured: true,
  },
  {
    id: 'p07',
    slug: 'regata-basica-adom',
    name: 'Regata Básica ADOM',
    description:
      'Regata de corte reto com cava larga, em algodão penteado. Modelagem confortável para treino ou para usar por baixo de camisas abertas. Disponível em 6 cores.',
    shortDescription: 'Algodão penteado, cava larga.',
    price: 79.9,
    images: ['/img/combo-camisas.jpeg'],
    category: 'regatas',
    variants: [
      colorGroup([
        { id: 'branco', label: 'Branco', meta: '#efece4' },
        { id: 'caramelo', label: 'Caramelo', meta: '#b9793f' },
        { id: 'verde-salvia', label: 'Verde Sálvia', meta: '#7c9483' },
        { id: 'azul-acinzentado', label: 'Azul Acinzentado', meta: '#4b566b' },
        { id: 'vinho', label: 'Vinho', meta: '#4a2326' },
        { id: 'preto', label: 'Preto', meta: '#151316' },
      ]),
      sizes,
    ],
    available: true,
    featured: true,
  },
];
