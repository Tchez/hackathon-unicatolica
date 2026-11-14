# SPEC 009: votação da programação

- **Issue:** #3 (E3)
- **Requisitos do PRD:** F07, D03, RNF03, RNF05
- **Status:** Feita

## Objetivo

O visitante ajuda a decidir a programação do shopping votando entre opções fechadas, e o shopping vê o resultado agregado e o anuncia: primeira versão do pilar 3 (pertencimento), que dá um motivo para participar além da compra.

## Escopo

- **Dentro:** uma votação de exemplo; votar como visitante; resultado em porcentagem; painel do shopping com totais e "Encerrar votação"; vencedora anunciada ao visitante.
- **Fora:** criar votação pela tela; pontos por votar; votações de comunidades (F09) e de outras decisões (F31); qualquer dado pessoal no painel.

## Comportamento esperado

1. Dado o visitante na tela inicial, então há um atalho "Votar" que abre `/visitor/poll`.
2. Dado `/visitor/poll` aberta, então mostra a pergunta "Qual jogo a Arena Capim transmite no domingo?", três opções e o prazo com contagem regressiva (relógio real); sem conta, votar leva a `/login` e volta à votação.
3. Dado o visitante logado que ainda não votou, quando escolhe uma opção e confirma, então o voto é registrado (um por pessoa) e a tela mostra a porcentagem e o total de votos de cada opção, com "Seu voto" na escolhida. Quem já votou vê direto o resultado.
4. Dado o painel do shopping (`/mall`), então há um cartão "Votação da programação" com a pergunta, os totais por opção e o número de votos, sem nomes (RNF05), e o botão "Encerrar votação" com confirmação.
5. Dada a votação encerrada (pelo botão ou pelo prazo), então ninguém mais vota e o visitante vê "Vencedora: <opção>. A transmissão é no domingo, na Arena Capim."; empate mostra as empatadas e "O shopping decide o desempate".
6. Dado o voto em uma aba, então as outras abas atualizam o resultado sozinhas (store registrado em `storeRegistry`).
7. "Restaurar dados de demonstração" volta a votação ao estado inicial.

## Estrutura e dados

- Módulo novo `src/features/community/` (SDD §4 e §9): `communityStore.ts` persistido (chave `fidelidade:community`), registrado com `registerStore`; tela `pages/PollPage.tsx`; componentes em `components/`; cartão do painel do shopping em `src/features/mall/components/PollResultsCard.tsx`.
- Tipos em `src/types/index.ts`: `Poll { id, question, options: PollOption[], closesAt, closedAt? }`, `PollOption { id, label }`, `PollVote { pollId, userId, optionId, createdAt }`.
- Dados iniciais em `src/data/polls.ts`: a votação acima, prazo 24 h depois da primeira carga, opções "Final do Brasileirão", "Semifinal da Copa do Brasil" e "Final do Campeonato Tocantinense", com alguns votos simulados de outros visitantes (ex.: 12, 9 e 7) para o resultado não começar vazio.
- Ações no store, com `Result<T, E>` e `now` opcional, e testes ao lado: `vote(userId, pollId, optionId)` (erros `invalid_user`, `poll_not_found`, `invalid_option`, `closed`, `already_voted`), `closePoll(pollId)`, seletores `getPollStatus`, `getResults` (contagem, porcentagem, vencedoras).
- Rota `/visitor/poll` em `src/app/App.tsx`, com a mesma guarda das outras telas do visitante (sem conta pode ver; votar exige conta). Atalho "Votar" em `src/components/ShortcutGrid.tsx` (ícone `Vote` do lucide, tom dourado).

## Dados e integrações

Votação, votos de outros visitantes e transmissão são simulados, com `SimulatedBadge`. Um voto por usuário de exemplo.

## Pronto quando

- [ ] Os 7 comportamentos funcionam no layout de aplicativo e no web.
- [x] O painel do shopping não mostra nenhum dado pessoal.
- [x] `npm run lint && npm test && npm run build` passam.
- [x] README (roteiro da demonstração), PRD (status de F07 e D03) e SDD (§4 e §5) atualizados.

## Dúvidas

- Pergunta, opções e votos iniciais são exemplos escolhidos por quem escreveu a spec; o time pode trocar.
- Pontos por votar ficaram fora para não mexer nas regras de pontos às vésperas da entrega.
