# SPEC 005: lojista

- **Issue:** #4 (E4)
- **Requisitos do PRD:** F16, F01 (lado da loja), RNF04
- **Status:** Pronta (depende da SPEC 001 na `develop`)

## Objetivo

O lojista cria e acompanha ofertas relâmpago e confirma compras com o código do cliente; jornada J7 e o lado da loja da J4 do [design](../design.md#5-jornadas).

## Escopo

- **Dentro:** `/merchant`, `/merchant/offers/new`, `/merchant/offers/:offerId`, `/merchant/confirm-purchase`.
- **Fora:** relatórios do lojista (F19 é Could).

## Comportamento esperado

1. Dado `/merchant`, então mostra o nome da loja e três ações em cartões: "Criar oferta relâmpago", "Confirmar compra" e a lista "Suas ofertas" com estado, contagem e restantes.
2. Dado "Criar oferta relâmpago", então o formulário pede produto, desconto (10, 20, 30, 40, 50%), duração (1 min, 3 min, 10 min, 1 h) e quantidade (+/−), mostra a prévia do card como o visitante verá e o texto "Leva menos de 1 minuto". "Publicar oferta" chama `createFlashOffer` e abre o acompanhamento.
3. Dado o acompanhamento, então mostra contagem, restantes e resgates ao vivo; "Encerrar agora" chama `closeOffer` após confirmação. A oferta encerra sozinha ao expirar ou esgotar (RNF04).
4. Dado "Confirmar compra", então pede o código de 6 dígitos e o valor em reais; `confirmPurchase` mostra:
   - **sucesso:** "Compra confirmada · +N pontos para o cliente", em verde;
   - **código inválido:** "Código não encontrado";
   - **vencido:** "Código vencido. Peça ao cliente um novo código";
   - **já usado:** "Este código já foi usado".
5. O lojista vê só o primeiro nome do cliente na confirmação, nunca outros dados (RNF05).

## Dados e integrações

- Ações da SPEC 001: `createFlashOffer`, `closeOffer`, `confirmPurchase`, `getOfferStatus`, `getRemaining`.
- Integração com o sistema de vendas: simulada, o valor é digitado (`SimulatedBadge`).

## Pronto quando

- [ ] J7 e o lado da loja da J4 funcionam, com o visitante em outra aba.
- [ ] Os quatro resultados da confirmação aparecem.
- [ ] `npm run lint && npm test && npm run build` passam.

## Dúvidas

- Durações de 1 e 3 min existem só para a demonstração (P7 do design).
