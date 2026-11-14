# SPEC 007: Easter Egg de sexta-feira 13

- **Issue:** #2 (E2)
- **Requisitos do PRD:** RNF02
- **Status:** Feita

## Objetivo

Cumprir o desafio do evento com um Easter Egg de sexta-feira 13 que se demonstra em segundos e conversa com a mecânica do app: cupom com contagem regressiva.

## Escopo

- **Dentro:** gatilho escondido no perfil e uma tela de sexta-feira 13 por cima do app.
- **Fora:** qualquer efeito nos dados (pontos, cupons, ofertas); som; ativação automática na data.

## Comportamento esperado

1. Dado o perfil (`/profile`), em qualquer perfil e também sem login, quando a pessoa toca 5 vezes no avatar, com no máximo 1,5 s entre um toque e outro, então abre a tela de sexta-feira 13. Menos de 5 toques não faz nada visível.
2. A tela cobre o app em tons escuros, com um relâmpago rápido na abertura, um gato grande sobre o título e um gato pequeno que atravessa a tela.
3. Ela mostra "Sexta-feira 13" e a data da última e da próxima sexta-feira 13, calculadas pelo relógio (em 14/11/2026: 13/11/2026 e 13/08/2027). Se o dia de hoje for sexta-feira 13, mostra "Hoje é sexta-feira 13".
4. Ela mostra um "cupom amaldiçoado" de 13% OFF em tudo, com contagem de 13 s. Ao zerar, o cupom some e aparece "O azar passou. Suas ofertas continuam valendo." O cupom diz que é brincadeira e não vale no caixa.
5. "Fechar" ou a tecla Esc fecha a tela e volta ao perfil, sem mudar nada no app.
6. Com `prefers-reduced-motion`, não há relâmpago nem animação; o gato fica parado.

## Dados e integrações

Nada é gravado: o Easter Egg só lê o relógio. As datas são calculadas por funções puras com testes.

## Pronto quando

- [x] Os 6 comportamentos funcionam no layout de aplicativo e no web.
- [x] `npm run lint && npm test && npm run build` passam.
- [x] README diz como encontrar o Easter Egg, dentro de um bloco recolhido.

## Dúvidas

- Gatilho, texto e efeito foram decididos por quem implementou, a partir do pedido "clicar 5x no perfil"; o time pode trocar.
