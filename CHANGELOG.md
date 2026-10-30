# Changelog

Todas as subidas para produção do site da ADOM ficam registradas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

Cada PR para `develop` adiciona uma linha em **Não lançado**. No PR de release
(`develop` → `main`), essa seção vira uma versão com a data da subida.

## [Não lançado]

## [0.5.2] - 2026-10-30

### Removido
- Vitrines por categoria da home. A página fica: Compre por categoria, Produtos, Chegou agora, frase de destaque, depoimentos e Sobre.

## [0.5.1] - 2026-10-30

### Corrigido
- Faixa branca à direita da página no celular: elementos que entram deslizando pela lateral alargavam a página.

## [0.5.0] - 2026-10-30

### Adicionado
- Seção "Produtos" na home: produtos de todas as categorias misturados num carrossel animado de 3 colunas x 2 linhas (2 x 2 no celular), com troca automática, setas, bolinhas e arrastar.

### Alterado
- Botão principal do topo agora é "Ver produtos" e leva à página de produtos.
- Nova ordem da home: Compre por categoria, Produtos, Chegou agora e, depois, as vitrines por categoria.

## [0.4.1] - 2026-10-30

### Alterado
- Retirado o selo "Nova coleção" do topo da página inicial.
- Frase do rodapé agora é "Onde ser único é ser o primeiro".

## [0.4.0] - 2026-10-28

### Adicionado
- Subcategorias no menu: categoria com subcategorias abre um dropdown no topo do site (vários níveis, na ordem definida no painel) e vira sanfona no menu do celular.
- Filtro da página de produtos por níveis: escolher uma categoria mostra os produtos das subcategorias dela e uma linha com as subcategorias para refinar. Breadcrumb do produto mostra o caminho completo.

### Corrigido
- O menu do celular marcava todas as categorias como ativas na página de produtos.

## [0.3.0] - 2026-10-27

### Adicionado
- Página "Meu pedido" (`/pedido/<id>`) com o status real do pedido, linha do tempo, itens, total, código de rastreio e etapa de retirada. Atualiza sozinha enquanto o pagamento não confirma.
- Página "Acompanhar pedido" (`/acompanhar-pedido`), com número do pedido + telefone, e atalhos no topo do site, no rodapé e no carrinho vazio.
- E-mail obrigatório no carrinho e exemplo de preenchimento no campo de WhatsApp.
- Botão "Montar o carrinho de novo" quando o pagamento não é concluído.

### Corrigido
- O carrinho agora esvazia ao finalizar a compra. Antes só esvaziava se o cliente voltasse na tela de pagamento aprovado, o que quase nunca acontecia no Pix.

## [0.2.0] - 2026-10-26

### Adicionado
- Processo de release: branch `develop` (homologação), CI com lint, tipos, testes e build, testes com Vitest, template de PR e este changelog.
- Retirada na loja no carrinho, com o frete calculado pelo painel.

### Segurança
- Sem mudanças.

## [0.1.0] - 2026-10-26

Estado de produção no momento em que o processo de release foi criado
(vitrine, carrinho e finalização de compra pelo Mercado Pago).
