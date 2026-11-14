# SPEC 006: painel do shopping

- **Issue:** #4 (E4)
- **Requisitos do PRD:** F06 (lado do shopping), RNF05
- **Status:** Feita

## Objetivo

A administração do shopping acompanha a campanha e libera lotes na hora, vendo só números agregados; jornada J8 do [design](../design.md#5-jornadas).

## Escopo

- **Dentro:** `/mall`, `/mall/campaigns`, `/mall/flash-offers` (módulo `mall`).
- **Fora:** criar campanha pela tela (fora do MVP; campanhas vêm dos dados simulados).

## Comportamento esperado

1. Dado `/mall`, então mostra a campanha atual (11/11) com cada oferta, seus lotes (liberados e restantes) e o botão "Liberar lote agora". Ao tocar, escolhe a quantidade (padrão 5) e confirma; `releaseBatch` libera o lote e o visitante presente recebe o aviso (SPEC 002).
2. O painel mostra números agregados: cupons resgatados, compras comprovadas, valor total comprado, pontos gerados e pontos trocados; nunca nomes ou dados de pessoas (RNF05).
3. Dado `/mall/campaigns`, então lista campanhas passadas, atual e próxima, com data e número de lojas.
4. Dado `/mall/flash-offers`, então lista as ofertas relâmpago ativas das lojas, com estado, contagem e restantes.
5. No layout web (a partir de 1024 px), os números aparecem em grade de cartões lado a lado; no layout de aplicativo, empilhados.

## Dados e integrações

- Ações e seletores da SPEC 001: `releaseBatch`, `getOfferStatus`, `getRemaining`; números calculados dos stores.

## Pronto quando

- [ ] J8 funciona com o visitante em outra aba.
- [ ] Nenhum dado pessoal aparece no painel.
- [ ] `npm run lint && npm test && npm run build` passam.

## Dúvidas

- O histórico inicial de demonstração (P10 do design) está em validação.
