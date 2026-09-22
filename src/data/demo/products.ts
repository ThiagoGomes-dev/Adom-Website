import type { Product } from '@/types';

/**
 * Produtos fictícios só para visualizar layout/animações localmente sem tocar
 * no catálogo real (que vem do admin e vai direto para produção). Ativado
 * via VITE_USE_MOCK_CATALOG=true no .env.local — nunca usado em build de produção.
 */
export const demoProducts: Product[] = [
  {
    id: 'mock-1',
    slug: 'camiseta-basica-preta',
    name: 'Camiseta Básica Preta',
    description: 'Camiseta 100% algodão penteado, corte reto e caimento perfeito para o dia a dia.',
    shortDescription: 'Algodão penteado, corte reto.',
    price: 79.9,
    promoPrice: 59.9,
    images: [
      'https://placehold.co/600x600/1a1a1a/f5f5f5?text=ADOM',
      'https://placehold.co/600x600/2e2e2e/f5f5f5?text=ADOM',
    ],
    category: 'camisetas',
    variants: [
      {
        id: 'cor',
        name: 'Cor',
        options: [
          { id: 'preto', label: 'Preto', meta: '#1a1a1a', image: 'https://placehold.co/600x600/1a1a1a/f5f5f5?text=ADOM' },
          { id: 'cinza', label: 'Cinza', meta: '#8a8a8a', image: 'https://placehold.co/600x600/2e2e2e/f5f5f5?text=ADOM' },
        ],
      },
      {
        id: 'tamanho',
        name: 'Tamanho',
        options: [
          { id: 'p', label: 'P' },
          { id: 'm', label: 'M' },
          { id: 'g', label: 'G' },
          { id: 'gg', label: 'GG' },
        ],
      },
    ],
    available: true,
    featured: true,
    tags: ['Mais vendida'],
  },
  {
    id: 'mock-2',
    slug: 'camiseta-basica-branca',
    name: 'Camiseta Básica Branca',
    description: 'A camiseta branca que combina com tudo. Tecido leve e resistente.',
    shortDescription: 'Tecido leve, combina com tudo.',
    price: 79.9,
    images: [
      'https://placehold.co/600x600/f5f5f5/1a1a1a?text=ADOM',
      'https://placehold.co/600x600/e5e0d8/1a1a1a?text=ADOM',
    ],
    category: 'camisetas',
    variants: [
      {
        id: 'cor',
        name: 'Cor',
        options: [
          { id: 'branco', label: 'Branco', meta: '#f5f5f5', image: 'https://placehold.co/600x600/f5f5f5/1a1a1a?text=ADOM' },
          { id: 'bege', label: 'Bege', meta: '#e5e0d8', image: 'https://placehold.co/600x600/e5e0d8/1a1a1a?text=ADOM' },
        ],
      },
      {
        id: 'tamanho',
        name: 'Tamanho',
        options: [
          { id: 'p', label: 'P' },
          { id: 'm', label: 'M' },
          { id: 'g', label: 'G' },
        ],
      },
    ],
    available: true,
    featured: true,
  },
  {
    id: 'mock-3',
    slug: 'camiseta-azul-marinho',
    name: 'Camiseta Azul Marinho',
    description: 'Tom sóbrio, ótima pra compor looks mais fechados sem perder o conforto do algodão.',
    shortDescription: 'Tom sóbrio, conforto do algodão.',
    price: 84.9,
    promoPrice: 69.9,
    images: ['https://placehold.co/600x600/001444/f5f5f5?text=ADOM'],
    category: 'camisetas',
    variants: [
      {
        id: 'tamanho',
        name: 'Tamanho',
        options: [
          { id: 'p', label: 'P' },
          { id: 'm', label: 'M' },
          { id: 'g', label: 'G' },
          { id: 'gg', label: 'GG' },
        ],
      },
    ],
    available: true,
    featured: true,
    tags: ['Promoção'],
  },
  {
    id: 'mock-4',
    slug: 'camiseta-vinho',
    name: 'Camiseta Vinho',
    description: 'Cor de destaque pra sair do básico sem perder a essência ADOM.',
    shortDescription: 'Cor de destaque, essência ADOM.',
    price: 84.9,
    images: [
      'https://placehold.co/600x600/5c1a2b/f5f5f5?text=ADOM',
      'https://placehold.co/600x600/2f4d3a/f5f5f5?text=ADOM',
    ],
    category: 'camisetas',
    variants: [
      {
        id: 'cor',
        name: 'Cor',
        options: [
          { id: 'vinho', label: 'Vinho', meta: '#5c1a2b', image: 'https://placehold.co/600x600/5c1a2b/f5f5f5?text=ADOM' },
          { id: 'verde', label: 'Verde musgo', meta: '#2f4d3a', image: 'https://placehold.co/600x600/2f4d3a/f5f5f5?text=ADOM' },
        ],
      },
      {
        id: 'tamanho',
        name: 'Tamanho',
        options: [
          { id: 'm', label: 'M' },
          { id: 'g', label: 'G' },
        ],
      },
    ],
    available: true,
    featured: false,
  },
  {
    id: 'mock-5',
    slug: 'camiseta-cinza-mescla',
    name: 'Camiseta Cinza Mescla',
    description: 'Visual descontraído com um toque premium — perfeita pra qualquer ocasião casual.',
    shortDescription: 'Visual descontraído e premium.',
    price: 79.9,
    images: ['https://placehold.co/600x600/9a9a9a/1a1a1a?text=ADOM'],
    category: 'camisetas',
    available: false,
    featured: false,
  },
  {
    id: 'mock-6',
    slug: 'camiseta-oversized-preta',
    name: 'Camiseta Oversized Preta',
    description: 'Modelagem ampla, ombro caído — a favorita de quem gosta de um caimento mais streetwear.',
    shortDescription: 'Modelagem ampla, estilo streetwear.',
    price: 94.9,
    promoPrice: 84.9,
    images: ['https://placehold.co/600x600/1a1a1a/c9ad8a?text=ADOM'],
    category: 'camisetas',
    variants: [
      {
        id: 'tamanho',
        name: 'Tamanho',
        options: [
          { id: 'm', label: 'M' },
          { id: 'g', label: 'G' },
          { id: 'gg', label: 'GG' },
        ],
      },
    ],
    available: true,
    stockQuantity: 0,
    featured: true,
    tags: ['Lançamento'],
  },
];
