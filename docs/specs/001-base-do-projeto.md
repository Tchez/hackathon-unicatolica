# SPEC 001: base do projeto

- **Issue:** #4 (E4)
- **Requisitos do PRD:** F04, RNF01, RNF03
- **Status:** Feita

## Objetivo

Deixar o projeto rodando com a stack do SDD, o tema do piloto, os dados simulados e uma tela vazia por rota, para o time construir as telas dos módulos em paralelo sem mexer na estrutura.

## Escopo

- **Dentro:**
  - Scaffold com a stack do [SDD §3](../sdd.md#3-stack) e as pastas da [§9](../sdd.md#9-convenções-de-código).
  - Tema do [design §2](../design.md#2-tema-do-piloto) no Tailwind.
  - Tipos do [SDD §5](../sdd.md#5-modelo-de-dados) e dados simulados.
  - Estado persistido e acesso sem login, com escolha de usuário de exemplo.
  - Layouts de aplicativo e web, rotas com telas vazias.
  - `SimulatedBadge` e aviso de protótipo; restauração dos dados.
  - PWA instalável; testes das regras puras; README atualizado.
- **Fora:**
  - O conteúdo das telas (specs 002 a 006).
  - Deploy (decisão pendente no SDD §7).
  - Easter Egg (RNF02, spec própria).

## Comportamento esperado

1. Dado o repositório clonado, quando a pessoa roda `npm install` e `npm run dev`, então o app abre em http://localhost:5173 sem configuração.
2. Dado o app aberto sem login, quando a pessoa está na tela inicial, então vê o topo do app (menu, logo do shopping, busca) e o aviso "Protótipo com dados simulados".
3. Dada a pessoa sem login, quando abre Perfil › "Entrar ou criar conta" (ou o "Entrar" do layout web) ou tenta uma ação que exige conta, então vai para `/login`, escolhe um usuário de exemplo e cai na tela de onde veio; sem tela de origem, na tela inicial do perfil (visitante `/visitor`, lojista `/merchant`, shopping `/mall`). Vale para os três perfis. "Sair" leva a `/login`, ainda sem login; trocar de usuário é Sair e escolher outro.
4. Dado um usuário logado numa aba, quando outra aba do mesmo navegador é aberta, então ela começa sem login (a sessão é por aba), mas os dados (ofertas, cupons, pontos) são os mesmos e se atualizam nas duas.
5. Dada uma rota de outro perfil (ex.: `/merchant` logado como visitante), quando a pessoa a acessa, então volta à tela inicial do próprio perfil. `/login` só abre sem login.
6. Dado "Restaurar dados de demonstração" no perfil, quando a pessoa confirma, então os dados voltam aos simulados iniciais e a sessão é encerrada.
7. Dada uma tela com largura menor que 1024 px, então aparece o layout de aplicativo; a partir de 1024 px, o layout web com o mesmo conteúdo centralizado e menu de perfil no topo.
8. Dado o build publicado em HTTPS (ou `npm run build && npm run preview` em `localhost`), então o app pode ser instalado como PWA, opcionalmente; nenhum fluxo exige a instalação. No Perfil:
   - "Instalar app" aparece só quando o navegador oferece a instalação (Chromium, no Android e no computador);
   - no Safari do iPhone e do iPad, uma dica "Compartilhar › Adicionar à Tela de Início";
   - com o app já instalado, nada sobre instalação aparece.

   O service worker atualiza o app aberto após uma nova publicação. A instalação não funciona sob `npm run dev`.

## Estrutura e nomes

Rotas (React Router), cada tela no módulo indicado; a tela inicial de cada rota nasce vazia, só com o título, e as specs 002 a 006 preenchem o conteúdo:

| Rota | Tela | Módulo | Perfil |
|---|---|---|---|
| `/` | Início (carrossel e atalhos) | `offers` | Todos; logado como visitante redireciona para `/visitor` |
| `/login` | Escolher usuário de exemplo e criar conta | `account` | Sem login |
| `/visitor` | Início do visitante | `offers` | Visitante |
| `/visitor/campaigns` · `/visitor/offers/:offerId` | Campanhas e ofertas · detalhe | `offers` | Visitante e sem login |
| `/visitor/coupons` | Meus cupons | `points` | Visitante |
| `/visitor/purchase-code` | Comprovar compra | `points` | Visitante |
| `/visitor/points` | Pontos e troca | `points` | Visitante |
| `/visitor/referral` | Indicar | `referral` | Visitante |
| `/profile` | Perfil (consentimento, instalar app, restaurar dados, sair) | `account` | Todos |
| `/merchant` · `/merchant/offers/new` · `/merchant/offers/:offerId` · `/merchant/confirm-purchase` | Início · criar · acompanhar oferta · confirmar compra | `offers` e `points` | Lojista |
| `/mall` · `/mall/campaigns` · `/mall/flash-offers` | Painel · campanhas · ofertas relâmpago | `mall` | Shopping |

Telas que exigem conta, acessadas sem login, levam a `/login`; depois do login, a pessoa volta à tela que tentou abrir.

## Dados e integrações

- **Tipos** em `src/types/`, exatamente os do SDD §5.
- **Dados iniciais** em `src/data/`. Nomes e lojas fictícios:
  - **Usuários:** Ana (visitante, 0 pontos), Bruno (visitante, 420 pontos em 3 compras, 1 cupom ativo, código `BRUNO100`), Carla (visitante, código `CARLA100`, indicada pelo Bruno, bônus pendente), TechPlay (lojista, eletrônicos), Café Ipê (lojista, café) e Administração do shopping (`mall`).
  - **Lojas:** TechPlay, Café Ipê e mais 4 lojas fictícias, cada uma com `slogan` (lista em `src/data/stores.ts`).
  - **Campanha "11/11 no Capim":** datada de 11/11 do ano corrente; oferta "TV 50 polegadas 50% OFF" da TechPlay, de R$ 2.999 por R$ 1.499, com 5 unidades num lote sem horário; o lote sai pelo painel do shopping. Mais 2 ofertas de outras lojas.
  - **Ofertas relâmpago:** "Café Ipê · 2 cafés por R$ 12" e "TechPlay · Fone Bluetooth 30% OFF".
  - **Recompensas:** R$ 10 de desconto e estacionamento 2 h por 500 pontos; R$ 25 de desconto por 1.200 pontos.
- **Regras provisórias** em `src/config/business-rules.ts`, cada uma com comentário citando a pergunta do PRD:
  - 1 ponto a cada R$ 10, arredondado para baixo (Q03);
  - recompensas de 500 e 1.200 pontos, com um resgate de cada recompensa por pessoa (Q03);
  - bônus de indicação de 100 pontos para cada lado, creditado na primeira compra comprovada do indicado depois do registro da indicação, uma única vez (F27);
  - código de compra com 6 dígitos, válido por 10 min (Q14);
  - cupom válido por 60 min (Q10).
- **Shopping** em `src/config/mall.ts`:
  - nome "Capim Dourado Shopping";
  - `logoUrl` remoto `https://www.capimdouradosc.com.br/images/logo.png`, nunca salvo no repositório. Em branco sobre fundo escuro (`brightness-0 invert`).
- **Dados de demonstração:** relativos ao tempo (a campanha termina 24 h e as ofertas relâmpago 2 h depois da primeira carga). São gravados na primeira carga e sobrevivem a recargas; "Restaurar dados de demonstração" os gera de novo.
- **Estado:**
  - um store Zustand por módulo, com `persist` no localStorage, chave com prefixo `fidelidade:`;
  - sincronização entre abas pelo evento `storage`, reidratando o store;
  - sessão (usuário logado) no sessionStorage.
- **Regras puras** em `src/lib/`, com testes Vitest ao lado:
  - `purchaseCode.ts`: gerar código, validar (inexistente, vencido, já usado);
  - `points.ts`: pontos por valor em centavos; saldo pela soma dos movimentos;
  - `format.ts`: `formatCurrency`, `formatDate`, `formatCountdown` em pt-BR.
- **Simulação:** componente `SimulatedBadge` (selo "Simulação" e variante "Valor ilustrativo") e aviso fixo "Protótipo com dados simulados" nos dois layouts.
- **PWA:** `vite-plugin-pwa` com nome "Fidelidade Shopping", cor de tema #B05828 e ícone próprio simples, sem a logo do shopping.

## Ações de domínio

Implementadas nos stores, sem UI, com testes (`*.test.ts` ao lado). As telas das specs seguintes chamam estas ações e não editam os stores. Toda ação devolve `Result<T, E>` (`{ ok: true, value }` ou `{ ok: false, error }`, tipo em `src/types/`) e aceita `now` opcional (ms) no fim, para testes. Regras e prazos vêm de `src/config/business-rules.ts`.

| Store (`src/features/...`) | Ação ou seletor | Erros |
|---|---|---|
| `offers/offersStore` | `claimCoupon(userId, offerId)`: resgata cupom (60 min); respeita lote liberado, saldo, prazo e um cupom por pessoa por oferta | `invalid_user`, `offer_not_found`, `upcoming`, `sold_out`, `ended`, `already_claimed` |
| | `releaseBatch(offerId, quantity)`: acrescenta lote com `releaseAt` = agora (painel do shopping; padrão `MALL_BATCH_DEFAULT_QUANTITY`) | `offer_not_found`, `invalid_quantity`, `ended` |
| | `createFlashOffer({ storeId, title, discountPercent, durationMinutes, quantity })`: oferta já liberada, sem campanha | `store_not_found`, `invalid_input` |
| | `closeOffer(offerId)`: encerra antes do prazo | `offer_not_found` |
| | `markPresence(userId, present)`: simula "Estou no shopping" (`presentUserIds`) | |
| | `getOfferStatus(offer, now?)` → `upcoming`, `live`, `sold_out` ou `ended`; `getRemaining(offer, now?)` (também em `src/lib/offers.ts`) | |
| `points/pointsStore` | `generatePurchaseCode(userId)`: código de 6 dígitos, 10 min | `invalid_user` |
| | `confirmPurchase(storeId, code, amountCents)`: cria `Purchase` e `PointsEntry`; na primeira compra do indicado, credita o bônus dos dois lados | `not_found`, `expired`, `used`, `invalid_amount`, `store_not_found` |
| | `redeemReward(userId, rewardId)`: cria `Coupon` e movimento negativo; exige saldo e respeita `limit` | `invalid_user`, `reward_not_found`, `insufficient_points`, `limit_reached` |
| | `getBalance(userId)`; `markCouponUsed(couponId)` | |
| `referral/referralStore` | `registerWithCode(newUserId, code)`: cria a indicação pendente e grava `referredBy` | `invalid_user`, `invalid_code`, `self_referral`, `already_referred` |
| | `creditFirstPurchaseBonus(referredId)`: chamado pelo `confirmPurchase`; marca a indicação como paga e devolve o bônus, uma única vez | |
| `account/accountStore` | `login(userId)` (devolve falso se o usuário não existe), `logout()`, `restoreDemoData()`: volta todos os stores aos dados iniciais e encerra a sessão; hook `useCurrentUser()` | |

- Cupons (de oferta e de recompensa) ficam em `pointsStore.coupons`, que a tela "Meus cupons" lê. `offersStore.claimCoupon` os grava por `addCoupon`, de uso interno.
- A sessão (usuário logado) é o `sessionStore` (sessionStorage); o resto fica no localStorage, com sincronização entre abas em `src/lib/storeRegistry.ts`. Todo store novo se registra ali com `registerStore`.

## Pronto quando

- [x] Os 8 comportamentos acima funcionam no navegador.
- [x] `npm run lint && npm test && npm run build` passam.
- [x] Simulações aparecem identificadas na interface.
- [x] README ("Como executar", estrutura) e SDD atualizados com o que mudou.

## Dúvidas

- A ação "Criar conta" do modo sem login usa sempre a conta da Ana na demonstração (decisão P8 do design, em validação).
