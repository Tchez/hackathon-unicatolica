# Fidelidade Shopping

**Hackathon Unicatólica · Desafio 05: engajamento e fidelização dos visitantes**

Módulo para o app do shopping que cria motivos para o visitante ir e voltar: campanhas em datas duplas com ofertas limitadas liberadas de surpresa, pontos por compra comprovada, indicação e votação da programação.

**[App publicado](https://tchez.github.io/hackathon-unicatolica/)** · **[Resumo para os avaliadores](https://app.notion.com/p/Fidelidade-Shopping-41878f6a5d5580eebeceed7129a6b679)** · **[Como executar](#como-executar)** · **[Documentação](#documentação)**

## Entregas

| Item pedido | Onde está |
|---|---|
| 1. MVP funcional | https://tchez.github.io/hackathon-unicatolica/ (abre sem login; roteiro em [Roteiro da demonstração](#roteiro-da-demonstração)) |
| 2. Repositório do projeto | Este repositório, branch `main`; código em `src/` ([estrutura](#estrutura-do-repositório)) |
| 3. Documentação técnica | [SDD](docs/sdd.md) (arquitetura, stack, módulos, dados, decisões), [PRD](docs/prd.md), [design](docs/design.md) e [specs](docs/specs/) |
| 4. Instruções de execução | [Como executar](#como-executar) |
| 5. Vídeo de até 90 s | [Vídeo](docs/pitch/pitch-90s.mp4) e [roteiro](docs/pitch/) |
| 6. Resumo de uma página | [Notion](https://app.notion.com/p/Fidelidade-Shopping-41878f6a5d5580eebeceed7129a6b679) |

## O desafio

> **Objetivo do desafio:** ampliar o relacionamento, a participação e o engajamento dos visitantes com o shopping, que muitas vezes se limita à visita ou ao consumo pontual.

## A solução

- **Campanhas em datas duplas (foco):** em datas como 11/11, lojas lançam juntas ofertas com poucas unidades, liberadas em lotes surpresa; quem marcou "Estou no shopping" recebe o aviso. Quem não pega a oferta já está no shopping e aproveita outras promoções.
- **Pontos por compra comprovada:** o visitante mostra um código de 6 dígitos no caixa e a loja confirma o valor; os pontos viram desconto ou estacionamento.
- **Participação:** votação da programação (ex.: qual jogo transmitir) e indicação com bônus para os dois lados.
- **Três perfis no mesmo app:** visitante, lojista (ofertas relâmpago e confirmação de compra) e administração do shopping (painel com números agregados, sem dados pessoais).

Requisitos, prioridades e decisões no [PRD](docs/prd.md). Dados, pagamento e integração com o caixa são simulados e aparecem identificados na tela.

## Como executar

Para só usar, abra o [app publicado](https://tchez.github.io/hackathon-unicatolica/). Para rodar localmente:


**Pré-requisitos:** [Node.js](https://nodejs.org/) 20.19+, 22.13+ ou 24+ e Git.

```bash
git clone https://github.com/Tchez/hackathon-unicatolica.git
cd hackathon-unicatolica
npm install
npm run dev
```

Abra http://localhost:5173. O app abre sem login; para resgatar, pontuar ou entrar como lojista ou administração do shopping, escolha um usuário de exemplo. Não há senha nem configuração; os dados são simulados e ficam no navegador. No computador aparece o layout web; em telas menores que 1024 px, o layout de aplicativo.

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run dev -- --host` | Mesmo servidor, acessível por outro aparelho na mesma rede |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Serve o build localmente, em http://localhost:4173/hackathon-unicatolica/ |
| `npm test` | Testes das regras (Vitest) |
| `npm run lint` | Verifica o código (ESLint) |
| `npm run format` | Formata o código (Prettier) |

**Notas do ambiente:**

- Precisa de internet para as fontes (Google Fonts) e a logo do shopping; sem a logo, aparece o nome em texto.
- O app se chama "Fidelidade Shopping".
- Instalar como aplicativo (opcional) só funciona no link HTTPS publicado, nunca em `npm run dev`. Android (Chrome): Perfil › Instalar app. iPhone: Safari › Compartilhar › Adicionar à Tela de Início, explicado também no Perfil.

## Roteiro da demonstração

Usuários de exemplo, sem senha. Entre por Perfil › "Entrar ou criar conta" (no computador, "Entrar" no topo). Para trocar de usuário: Perfil › "Sair" e escolha outro.

| Usuário | Perfil | Observação |
|---|---|---|
| Ana | Visitante | 0 pontos; é a conta criada por "Criar conta" |
| Bruno | Visitante | 420 pontos; código de indicação `BRUNO100` |
| Carla | Visitante | Indicada pelo Bruno, bônus pendente; código `CARLA100` |
| TechPlay | Lojista | Eletrônicos |
| Café Ipê | Lojista | Café |
| Administração do shopping | Shopping | Painel e liberação de lotes |

**Antes de apresentar:** em Perfil › "Restaurar dados de demonstração". Os dados são relativos ao tempo (a campanha termina 24 h e as ofertas relâmpago 2 h depois da primeira carga) e ficam salvos no navegador, então restaurar os renova.

**Duas janelas lado a lado:** a sessão é por aba e os dados são compartilhados, então uma janela como visitante e outra como lojista ou shopping mostram as ações de uma refletidas na outra, ao vivo.

<details>
<summary>Passo a passo das jornadas (J1 a J9)</summary>

| Jornada | Passo a passo |
|---|---|
| J1 · Convidado cria conta | Sem login, abra uma oferta já liberada (a relâmpago do carrossel, ou a TV depois da J8) › "Resgatar cupom" › em "Criar conta", digite `BRUNO100` › "Criar conta" (vira a Ana) › volta à oferta e resgata. Com a TV ainda "Em breve", "Estou no shopping" também leva a criar conta |
| J2 · Dia da campanha | Janela A (visitante): na oferta da TV, marque "Estou no shopping". A oferta fica "Em breve" até a Administração do shopping clicar "Liberar lote agora" (janela B, `/mall`; quantidade e "Confirmar liberação"). A janela A recebe o aviso no topo (vale 5 min; só aparece para quem marcou presença) › "Resgatar cupom" › "Meus cupons" |
| J3 · Chegou tarde | Libere um lote de 1 unidade e resgate com outro visitante (Bruno). Com a Ana, abra a oferta: aparece "esgotada" e as alternativas de outras lojas › resgate uma delas |
| J4 · Compra comprovada | Visitante: Comprovar compra mostra o código de 6 dígitos (vale 10 min). Janela do lojista (TechPlay ou Café Ipê): Confirmar compra › código e valor em reais. O visitante vê "Compra confirmada" e os pontos |
| J5 · Troca de pontos | Visitante: Pontos › recompensa › confirmar › cupom em "Meus cupons". São 500 pontos para estacionamento ou R$ 10; o Bruno tem 420, então faça antes a J6 (+100) ou uma compra de R$ 800 ou mais na J4 |
| J6 · Indicação | Bruno: Indicar mostra o `BRUNO100`. Crie a conta com ele (J1, vira a Ana). A Ana gera o código de compra e o lojista confirma (J4): os dois ganham 100 pontos, uma única vez |
| J7 · Oferta relâmpago | Lojista: "Criar oferta relâmpago" › produto, desconto, duração (1 e 3 min só para a demonstração) e quantidade › "Publicar oferta". O visitante a vê com contagem; ela encerra ao esgotar ou expirar. O lojista só encerra as próprias ofertas relâmpago, não as da campanha |
| J8 · Lote liberado | Shopping: `/mall` › "Liberar lote agora" na TV. O visitante vê o lote liberado, com a contagem de estoque ao vivo |
| J9 · Votação | Visitante: atalho "Votar" › escolher uma opção › "Confirmar voto" › resultado em porcentagem. Shopping: `/mall` › cartão "Votação da programação" › "Encerrar votação" › o visitante vê a opção vencedora |

</details>

Detalhes das jornadas e telas no [design](docs/design.md#5-jornadas).

<details>
<summary>Easter Egg</summary>

Em Perfil, toque 5 vezes no avatar (até 1,5 s entre toques), em qualquer perfil ou sem login. Abre uma tela de sexta-feira 13 com um gato preto, as datas da última e da próxima sexta-feira 13 e um "cupom amaldiçoado" de 13 s, de brincadeira; "Fechar" ou Esc volta ao perfil sem mudar nada. Spec: [007](docs/specs/007-easter-egg-sexta-13.md).

</details>

## Estrutura do repositório

```
.
├── README.md
├── CONTRIBUTING.md            # fluxo de trabalho: tarefas, branches, commits, PRs
├── AGENTS.md                  # regras para assistentes de IA (CLAUDE.md importa este arquivo)
├── src/                       # código; estrutura no SDD, seção 9
│   ├── app/                   # rotas, layouts (web e app) e guarda de perfil
│   ├── features/<módulo>/     # account, offers, points, referral, community, mall (telas, estado e ações)
│   ├── components/            # componentes compartilhados
│   ├── lib/                   # regras puras, com testes ao lado
│   ├── config/                # regras de negócio provisórias e dados do shopping
│   ├── data/                  # dados simulados iniciais
│   └── types/                 # interfaces do modelo de dados
├── public/                    # ícones do PWA
├── .github/workflows/         # publicação no GitHub Pages a cada push na main
└── docs/
    ├── prd.md                 # requisitos de produto, priorizados em MoSCoW
    ├── sdd.md                 # design de software e decisões técnicas
    ├── design.md              # UI/UX: tema, telas e jornadas
    ├── prototype/app.html     # protótipo navegável das jornadas (referência, não código)
    ├── prototype/journeys.html # protótipo anterior das jornadas, substituído pelo app.html
    ├── pitch/                 # roteiro e vídeo de 90 s
    └── specs/                 # fatias de implementação (000 modelo, 001 a 009)
```

## Documentação

| Documento | Conteúdo |
|---|---|
| [PRD](docs/prd.md) | Problema, objetivos e não objetivos, requisitos funcionais e não funcionais priorizados em MoSCoW, decisões de produto, métricas, riscos e perguntas em aberto |
| [SDD](docs/sdd.md) | Arquitetura, stack, módulos, modelo de dados, o que é real e o que é simulado, decisões técnicas |
| [Design](docs/design.md) | Tema visual, navegação, telas e estados, jornadas e validação; protótipo navegável em `docs/prototype/app.html` (o anterior, `journeys.html`, foi substituído por ele) |
| [Specs](docs/specs/000-modelo.md) | Fatias de implementação, uma por arquivo: [001 base](docs/specs/001-base-do-projeto.md), [002 campanhas](docs/specs/002-campanhas-e-ofertas.md), [003 compras e pontos](docs/specs/003-compras-e-pontos.md), [004 indicação e conta](docs/specs/004-indicacao-e-conta.md), [005 lojista](docs/specs/005-lojista.md), [006 painel do shopping](docs/specs/006-painel-do-shopping.md), [007 Easter Egg](docs/specs/007-easter-egg-sexta-13.md), [008 publicação](docs/specs/008-deploy-github-pages.md), [009 votação](docs/specs/009-votacao-da-programacao.md) |
| [Pitch](docs/pitch/) | Roteiro e vídeo de 90 s |
| [Resumo para os avaliadores](https://app.notion.com/p/Fidelidade-Shopping-41878f6a5d5580eebeceed7129a6b679) | Resumo de uma página no Notion |
| [Notion da primeira fase](https://cute-felidae-d88.notion.site/Proposta-de-solu-o-41778f6a5d55809f9337f0b2172416ef) | Documento da ideia entregue na primeira fase |

## Como contribuir

Veja o [CONTRIBUTING.md](CONTRIBUTING.md): tarefas no quadro do GitHub, uma branch por issue, Conventional Commits e pull requests que fecham a issue. O código sobe por `develop` → `main`, sempre por pull request.
