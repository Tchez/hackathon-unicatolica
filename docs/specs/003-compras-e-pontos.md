# SPEC 003: compras e pontos (visitante)

- **Issue:** #3 (E3)
- **Requisitos do PRD:** F01, F02, F03, F23, RNF03
- **Status:** Feita

## Objetivo

O visitante comprova a compra com um código, acompanha os pontos e os troca por cupom de desconto ou estacionamento; jornadas J4 (lado do visitante) e J5 do [design](../design.md#5-jornadas).

## Escopo

- **Dentro:** telas `/visitor/purchase-code`, `/visitor/points` e `/visitor/coupons` do módulo `points`.
- **Fora:** confirmação da compra pelo lojista (SPEC 005).

## Comportamento esperado

1. Dado "Comprovar compra", quando a tela abre, então `generatePurchaseCode` mostra um código grande de 6 dígitos ("482 913"), a contagem da validade (selo "Valor ilustrativo") e a instrução "Informe este código no caixa. O lojista confirma o valor e seus pontos caem na hora."
2. Dado o código na tela, quando o lojista o confirma (outra aba), então a tela mostra "Compra confirmada", o valor e os pontos ganhos em verde.
3. Dado o código vencido, então a tela mostra "Código vencido" e o botão "Gerar novo código".
4. Abaixo do código, "Compras recentes": loja, valor e "+N pontos" em verde.
5. Dada a tela Pontos, então o topo tem um único degradê ferrugem → dourado, da barra de status até o botão "Histórico", com saldo grande e ícone de moeda; abaixo, um card com "Faltam N para R$ 10 de desconto" e barra de progresso.
6. "Troque seus pontos": cards de recompensa com ícone em fundo claro de cor própria (R$ 10 ferrugem, estacionamento verde com selo "Simulação", R$ 25 dourado) e o custo em pontos. Ao tocar, uma confirmação; ao confirmar, `redeemReward` cria o cupom e debita os pontos. Saldo insuficiente ou limite atingido desabilita o card com o motivo.
7. "Histórico" abre o extrato: data, descrição e pontos (+ em verde, − em ferrugem).
8. "Ganhe mais pontos": atalhos para Comprovar compra (marrom) e Indicar amigos (verde).
9. Dado "Meus cupons", então lista ativos e usados/vencidos, com código, origem (oferta ou troca de pontos) e validade.

## Dados e integrações

- Ações da SPEC 001: `generatePurchaseCode`, `getBalance`, `redeemReward`; cupons no store `points` (`markCouponUsed`).
- Integração com o caixa e com a cancela do estacionamento: simuladas, identificadas na interface.
- Pontos inteiros, arredondados para baixo (regra provisória, Q03).

## Pronto quando

- [x] J4 (com a SPEC 005) e J5 funcionam.
- [x] Erros de saldo, limite e código vencido aparecem.
- [x] `npm run lint && npm test && npm run build` passam.

## Dúvidas

- Validade dos pontos não decidida: não mostrar "expiram em" até decisão (Q03).
