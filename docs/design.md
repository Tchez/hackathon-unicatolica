# Design: UI/UX e jornadas

[README](../README.md) · [PRD](prd.md) · [SDD](sdd.md)

Como o produto aparece e como cada perfil o usa. O protótipo navegável [`docs/prototype/app.html`](prototype/app.html) mostra tudo isto funcionando; abra o arquivo no navegador (precisa de internet para as fontes e a logo).

> **Status:** direção visual aprovada; jornadas e decisões do protótipo em validação pelo time (seções 6 e 7). O painel lateral de troca de perfil e o painel "Jornadas" existem só no protótipo; no app, trocar de usuário é Sair › `/login`. O protótipo é referência de tela e fluxo, não código para copiar: as telas são reconstruídas em React seguindo o [SDD](sdd.md#9-convenções-de-código).

## 1. Direção

A solução é um módulo dentro do app que o shopping já tem (D13 do PRD). Por isso a interface segue o visual do app atual do Capim Dourado, o piloto: fundo branco, topo com menu, logo e busca, atalhos em quadrados e telas internas com seta de voltar. O que é novo (campanhas, pontos, indicação) ganha destaque com um carrossel no topo e com as cores da marca nos cards.

As cores e a fonte ficam no tema (SDD, seção 9). Outro shopping troca o tema sem mexer nos componentes.

## 2. Tema do piloto

| Token | Hex | Uso |
|---|---|---|
| `primary` | #B05828 | Ferrugem: botões, ícones, links, valores, campanha |
| `primary-dark` | #8E4720 | Degradês e texto sobre fundo ferrugem claro |
| `gold` | #C9A45C | Pontos, moeda, barras de progresso, degradê da tela de pontos |
| `gold-dark` | #8A6A22 | Ícones e texto sobre fundo dourado claro |
| `green` | #2E7D32 | Oferta relâmpago, estacionamento, "lote liberado" e pontos ganhos |
| `brown` | #7F562C | Marrom da marca: ações secundárias, como comprovar compra |
| `primary-soft`, `green-soft`, `gold-soft`, `brown-soft` | #F6E7DD, #E6F1E3, #F5ECD8, #EFE6DC | Fundo dos ícones de atalho e de lista, um por cor |
| `surface` | #F2F2F2 | Quadrados de atalho originais, campos, chips |
| `background` | #FFFFFF | Fundo das telas |
| `text`, `muted`, `line` | #222222, #666666, #E6E6E6 | Texto principal, secundário e divisores |

- **Fonte:** Noto Sans, pesos 400 a 700.
- **Forma:** raio de 8 px; sem sombras, exceto no topo da tela inicial ao rolar.
- **Logo do shopping:** carregada pelo link do site oficial, nunca salva no repositório. Em branco sobre o carrossel e dourada sobre fundo branco.
- **Selos:** "Simulação" no que não é real e "Valor ilustrativo" nas regras ainda não decididas (RNF03).

## 3. Navegação por perfil

O app abre sem login. Ver campanhas e ofertas não exige conta; resgatar, pontuar e indicar pedem para entrar. No protótipo (`docs/prototype/app.html`), um painel ao lado da tela troca de perfil e de usuário sem senha (F04); no app, não há painel: Sair leva a `/login` e a pessoa escolhe outro usuário.

| Perfil | Entrada | Como navega |
|---|---|---|
| Não logado | Tela inicial do app | Atalhos e seta de voltar; ações que exigem conta abrem o convite para entrar |
| Visitante | Tela inicial do app, com carrossel e atalhos do módulo | Atalhos (Campanhas, Ofertas, Meus cupons, Comprovar compra, Pontos, Indicar) e seta de voltar, sem barra inferior, como no app atual |
| Lojista | Início do lojista | Dois cartões de ação, "Criar oferta relâmpago" e "Confirmar compra", e a lista "Suas ofertas" para acompanhar |
| Shopping | Painel da campanha | Painel, campanhas e ofertas relâmpago das lojas |

## 4. Telas e estados

| Perfil | Tela | Estados que precisam existir |
|---|---|---|
| Todos | Tela inicial com carrossel | Slides de campanha, oferta relâmpago e pontos (este só logado); seção "Lojas" com ícone, nome e slogan; topo transparente e branco ao rolar |
| Não logado | Convite para entrar | Campo opcional de código de indicação |
| Visitante | Campanha e ofertas | Lista com contagem e quantidade restante |
| Visitante | Detalhe da oferta | Em breve, liberada, esgotada (com alternativas de outras lojas), encerrada; "Estou no shopping" |
| Visitante | Cupom resgatado e Meus cupons | Ativo e usado, com código para mostrar no caixa |
| Visitante | Comprovar compra | Código de 6 dígitos válido por 10 min; confirmado; vencido |
| Visitante | Pontos | Saldo, quanto falta, extrato, troca por desconto ou estacionamento, limite atingido |
| Visitante | Indicar | Código pessoal, compartilhar, indicações e bônus pendente ou liberado |
| Visitante | Perfil | Consentimento de marketing separado, "Instalar app" opcional, sair |
| Visitante | Aviso de lote | Aparece para quem marcou "Estou no shopping" |
| Lojista | Criar oferta relâmpago | Formulário com prévia; publicada |
| Lojista | Acompanhar oferta | Contagem, restante, encerrar antes do prazo |
| Lojista | Confirmar compra | Código e valor; sucesso; código inválido, vencido ou já usado |
| Shopping | Painel da campanha | Lotes programados, "Liberar lote agora", números agregados sem dados pessoais |

## 5. Jornadas

| ID | Jornada | Passos |
|---|---|---|
| J1 | Convidado descobre a campanha e cria conta | Não logado vê a campanha 11/11 no carrossel → abre a oferta → tenta resgatar → cria conta com código de indicação → volta à oferta |
| J2 | Dia da campanha | Visitante marca "Estou no shopping" → recebe o aviso do lote → resgata o cupom da TV → cupom em "Meus cupons" |
| J3 | Chegou tarde | Visitante abre a oferta esgotada → vê alternativas → resgata outra oferta |
| J4 | Compra comprovada | Visitante gera o código → lojista confirma com o valor → visitante vê os pontos e quanto falta |
| J5 | Troca de pontos | Visitante abre Pontos → troca por estacionamento → cupom em "Meus cupons" |
| J6 | Indicação | Bruno compartilha o código → Ana cria conta com ele → Ana faz a primeira compra comprovada → os dois ganham o bônus |
| J7 | Oferta relâmpago | Lojista cria a oferta → visitante a vê com contagem → ela encerra ao esgotar ou expirar |
| J8 | Lote liberado pelo shopping | Shopping clica "Liberar lote agora" → visitante vê o lote liberado |

## 6. Validação pelo time

Cada pessoa pega um bloco, percorre as jornadas no protótipo (`docs/prototype/app.html`, painel "Jornadas", que só existe nele) ou no app, com o roteiro do [README](../README.md#roteiro-da-demonstração) e anota o que encontrar no épico E3, com a etiqueta `ui-ux`. A validação responde: o passo faz sentido para quem usa? Falta tela ou estado? Algum texto confunde? Algo foge do Must do PRD? Também aceita ou recusa as decisões da seção 7.

| Bloco | Jornadas e telas | Status |
|---|---|---|
| Campanha | J1, J2, J3, J8; tela inicial, ofertas, detalhe, aviso de lote | A validar |
| Compras e pontos | J4, J5; comprovar compra, pontos, Meus cupons, confirmar compra do lojista | A validar |
| Lojista e indicação | J6, J7; indicar, criar conta, criar e acompanhar oferta | A validar |
| Visual e textos | Todas as telas: tema da seção 2, selos de simulação, acentuação, alvos de toque | A validar |

## 7. Decisões tomadas no protótipo

Escolhas feitas para o protótipo funcionar, sem decisão do time. Valem só como proposta até a validação.

| # | Decisão | Situação |
|---|---|---|
| P1 | Só no protótipo (`docs/prototype/app.html`), não no app: escolher uma jornada ou "Reiniciar demonstração" volta tudo ao estado inicial | A validar |
| P2 | O lote da campanha só sai por "Liberar lote agora" no perfil Shopping e fica disponível até esgotar ou a oferta encerrar; o aviso a quem marcou "Estou no shopping" dura 5 min e também dispara numa oferta relâmpago nova; não há liberação automática | A validar |
| P3 | Só no protótipo (`docs/prototype/app.html`), não no app: na J3, um botão de simulação faz "outros visitantes" esgotarem o lote | A validar |
| P4 | Pontos inteiros, arredondados para baixo (1 ponto a cada R$ 10); o protótipo mostra uma casa decimal | A validar; regra em aberto (Q03) |
| P5 | Recompensas: R$ 10 e estacionamento 2 h por 500 pontos, R$ 25 por 1.200, um resgate de cada recompensa por pessoa; validade dos pontos não mostrada | A validar; regras em aberto (Q03) |
| P6 | Cupom vale 60 min; código de compra vale 10 min e é de uso único | A validar; em aberto (Q10, Q14) |
| P7 | Um cupom por pessoa por oferta; oferta relâmpago dura 1 min, 3 min, 10 min ou 1 h; as de 1 e 3 min existem só para a demonstração | A validar |
| P8 | "Criar conta" sempre vira a conta da Ana; códigos de exemplo aceitos: BRUNO100 e CARLA100 (os dos visitantes) | Só demonstração |
| P9 | Menu abre o perfil; "Ver todas" e a grade original do app avisam "fora do protótipo"; a busca fica fora: o botão aparece desabilitado no layout de aplicativo e não existe no layout web | Só demonstração |
| P10 | O painel do shopping soma números reais do navegador a campanhas de demonstração (10/10 passada, com resultados inventados, e 12/12 próxima) e à métrica simulada "Marcaram Estou no shopping"; só números agregados | Só demonstração |
