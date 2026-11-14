# SPEC 002: campanhas e ofertas (visitante e sem login)

- **Issue:** #4 (E4)
- **Requisitos do PRD:** F06, F16 (lado do visitante), RNF03, RNF04, RNF06
- **Status:** Pronta (depende da SPEC 001 na `develop`)

## Objetivo

O visitante, logado ou não, descobre a campanha e as ofertas na tela inicial, acompanha prazo e estoque reais e resgata cupons; jornadas J1, J2, J3 e o lado do visitante da J8 do [design](../design.md#5-jornadas).

## Escopo

- **Dentro:** telas `/`, `/visitor`, `/visitor/campaigns` e `/visitor/offers/:offerId` do módulo `offers`; carrossel; atalhos; aviso de lote liberado; convite para entrar quando a ação exige conta.
- **Fora:** Meus cupons (SPEC 003), criação de oferta pelo lojista (SPEC 005), liberação de lote (SPEC 006).

## Comportamento esperado

1. Dada a tela inicial, então o carrossel preenche o topo por trás da barra de status e do topo do app, troca a cada 4 s, aceita arrastar e tocar nos indicadores, e mostra: campanha 11/11 com contagem, uma oferta relâmpago ativa e, se logado, o saldo de pontos com quanto falta.
2. Dada a tela inicial rolada, então o topo fica branco com a logo dourada original e sombra leve.
3. Abaixo do carrossel, atalhos com fundos claros de cores diferentes (ferrugem, verde, dourado, marrom; design §2): Campanhas, Ofertas, Meus cupons, Comprovar compra, Pontos, Indicar. Depois, lojas em círculos e a grade original do app; itens fora do MVP mostram um aviso "Fora do protótipo".
4. Dada a lista de campanhas e ofertas, então cada card mostra loja, título, desconto, contagem e quantidade restante (`getRemaining`), com o estado de `getOfferStatus`.
5. Dado o detalhe de uma oferta, então mostra preço de/por, estado e contagem:
   - **em breve:** "Próximo lote: surpresa", sem botão de resgate;
   - **liberada:** "Lote liberado agora" em verde, barra de estoque e botão "Resgatar cupom";
   - **esgotada:** mensagem e alternativas de outras lojas da mesma campanha;
   - **encerrada:** mensagem, sem botão.
6. Dado um visitante logado numa oferta liberada, quando toca "Resgatar cupom", então `claimCoupon` cria o cupom e abre a confirmação com o código e o link para Meus cupons. Um segundo resgate da mesma oferta mostra "Você já resgatou esta oferta".
7. Dada a pessoa sem login, quando toca "Resgatar cupom", então vai para `/login` com o convite para criar conta (campo opcional de código de indicação).
8. Dado o detalhe da oferta, quando o visitante marca "Estou no shopping" (selo "Simulação"), então `markPresence` registra a presença; quando um lote for liberado, quem está presente vê um aviso no topo do app com link para a oferta.
9. Prazos e quantidades usam o relógio real: a contagem chega a zero e a oferta muda para encerrada sem recarregar; o estoque muda ao vivo em outra aba (sincronização da SPEC 001).

## Dados e integrações

- Ações do store `offers` da SPEC 001: `claimCoupon`, `markPresence`, `getOfferStatus`, `getRemaining`.
- Presença no shopping e aviso de lote: simulados, com `SimulatedBadge`.
- Sem sorteio ou brinde por sorte (RNF06).

## Pronto quando

- [ ] J1, J2, J3 e o lado do visitante da J8 funcionam no navegador, em duas abas (shopping e visitante).
- [ ] Os quatro estados da oferta aparecem.
- [ ] Simulações identificadas; textos em PT-BR com acentos.
- [ ] `npm run lint && npm test && npm run build` passam.

## Dúvidas

- Decisões P2, P3 e P7 do design em validação pelo time.
