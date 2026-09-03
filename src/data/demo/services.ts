import type { Service } from '@/types';

/** Serviços de exemplo — consultoria de estilo e ajustes, oferecidos pela loja. */
export const services: Service[] = [
  {
    id: 's01',
    slug: 'consultoria-de-estilo',
    name: 'Consultoria de Estilo',
    description: 'Sessão individual para montar looks e definir as peças-chave do seu guarda-roupa.',
    priceLabel: 'A partir de R$ 150',
    image: 'https://picsum.photos/seed/haus-s01/800/600',
    featured: true,
  },
  {
    id: 's02',
    slug: 'ajustes-sob-medida',
    name: 'Ajustes Sob Medida',
    description: 'Bainha, cintura e caimento ajustados por costureira parceira para a peça vestir perfeita em você.',
    priceLabel: 'A partir de R$ 40',
    image: 'https://picsum.photos/seed/haus-s02/800/600',
    featured: true,
  },
  {
    id: 's03',
    slug: 'personal-shopper',
    name: 'Personal Shopper',
    description: 'Nosso time seleciona peças combinando com seu estilo e te acompanha na escolha pelo WhatsApp.',
    priceLabel: 'Sob consulta',
    image: 'https://picsum.photos/seed/haus-s03/800/600',
  },
];
