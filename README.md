# Plataforma de Sites e Catálogos para Pequenos Negócios

Base comercial reutilizável em **React + Vite + TypeScript + Tailwind CSS** para criar rapidamente
sites de pequenos negócios: landing pages, sites institucionais, catálogos de produtos e páginas de
serviços — todos com conversão via **WhatsApp**.

Este repositório contém o site da **ADOM**, loja de camisetas básicas premium, construído em cima
dessa base — serve como referência real de como a plataforma fica quando os dados/fotos de um
cliente substituem o conteúdo de exemplo.

## Rodando o projeto

```bash
npm install
npm run dev        # ambiente de desenvolvimento (http://localhost:5173)
npm run build       # build de produção em /dist
npm run typecheck    # checagem de tipos
npm run lint        # lint
npm run preview      # serve o build de produção localmente
```

## Como transformar esta base em outro cliente

Praticamente toda a personalização acontece em **um único arquivo**:

```
src/config/site.config.ts
```

Nele você define nome da empresa, WhatsApp, endereço, redes sociais, cores do tema, textos do Hero,
texto institucional e quais recursos/páginas ficam ativos. Nenhum componente tem texto, cor ou
número de telefone fixo — tudo é lido de lá através do hook `useCompanyConfig()`.

Passos para um novo cliente:

1. Duplique/ajuste `src/config/site.config.ts` com os dados reais do cliente.
2. Troque as cores em `theme.colors` (formato `"R G B"`, sem vírgulas — usado pelas variáveis CSS em
   `src/index.css`).
3. Substitua os arquivos em `src/data/demo/*` pelo catálogo, serviços, depoimentos, FAQ e galeria
   reais (mesmo formato dos dados de exemplo).
4. Escolha o `plan` (`basico` | `catalogo` | `completo`) — isso já ativa o conjunto certo de
   páginas/seções (ver `src/config/plans.ts`). Flags individuais podem ser sobrescritas em
   `features`/`pages` se o cliente quiser uma combinação diferente do padrão do plano.
5. Troque `public/favicon.svg` e, se houver, adicione o logo do cliente e aponte `logo` no config.

Nenhum outro arquivo de componente precisa ser tocado para uma personalização básica.

## Planos comerciais

| | Básico | Catálogo | Completo |
|---|---|---|---|
| Hero, Sobre, Serviços, Contato, WhatsApp, Mapa | ✅ | ✅ | ✅ |
| Catálogo de produtos, categorias, busca, página de produto | — | ✅ | ✅ |
| Galeria, depoimentos, FAQ, avaliações | — | — | ✅ |

Definido em `src/config/plans.ts` (`PLAN_FEATURES` / `PLAN_PAGES`).

## Integração com WhatsApp

Toda a geração de links/mensagens do WhatsApp está centralizada em `src/lib/whatsapp.ts`:

- `generateWhatsAppLink(phone, message)` — função genérica reutilizável.
- `buildProductWhatsAppLink` — mensagem de compra com variantes/quantidade.
- `buildQuoteWhatsAppLink` — orçamento.
- `buildServiceWhatsAppLink` — agendamento de serviço.
- `buildContactWhatsAppLink` — contato geral (header, botão flutuante, footer).

## Estrutura de pastas

```
src/
  config/       companyConfig, planos, navegação (o "cérebro" da personalização)
  types/        contrato de tipos entre config e componentes
  data/demo/    dados de exemplo (produtos, categorias, serviços, depoimentos, FAQ, galeria)
  lib/          funções puras: WhatsApp, moeda, slug, cn, CTA
  hooks/        hooks reutilizáveis (debounce, media query, scroll lock, seleção de produto)
  context/      CompanyConfigProvider (injeta tema + config na árvore)
  components/
    ui/         Button, Section, Container, Badge, LazyImage, DynamicIcon...
    layout/      Header, Footer, MobileMenu, WhatsAppFloatingButton, SEO
    sections/    Hero, Destaque, Sobre, Galeria, Depoimentos, Localização, CTA
    catalog/     ProductCard, ProductGrid, CategoryFilter, ProductModal, VariantSelector...
  pages/        uma página por rota
  routes/       registro condicional de rotas conforme `companyConfig.pages`
```

## Admin futuro

Os dados hoje vivem em arquivos TypeScript (`src/data/demo/*`) seguindo os tipos de
`src/types/index.ts`. Essa separação foi pensada para que, no futuro, uma tela em `/admin` (ou uma
API) possa alimentar os mesmos tipos sem exigir mudanças nos componentes.
