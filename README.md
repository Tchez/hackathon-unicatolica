# Hackathon Unicatólica

**Desafio 05: engajamento e fidelização dos visitantes**

Uma proposta para fortalecer o relacionamento entre shopping centers e seus visitantes por meio de campanhas promocionais recorrentes, pontos por compras e divulgação com indicação.

> **Status:** escopo do MVP definido; protótipo em construção. Entrega final em 14/11/2026, até as 12h.

## Sumário

- [O desafio](#desafio-05)
- [A solução](#a-solução)
- [Como executar](#como-executar)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Documentação](#documentação)
- [Como contribuir](#como-contribuir)

## Desafio 05

Enunciado transcrito da folha do desafio fornecida pela organização:

> **Contexto:** O shopping busca atrair visitantes, estimular novas visitas e fortalecer o relacionamento com seu público.
>
> **Problemática:** A relação entre o consumidor e o shopping muitas vezes se limita à visita ou ao consumo pontual, sem necessariamente gerar um vínculo contínuo.
>
> **Objetivo:** Ampliar o relacionamento, a participação e o engajamento dos visitantes com o shopping.

## A solução

Pilares, em ordem de prioridade, para transformar visitas e compras pontuais em um relacionamento contínuo. Requisitos e prioridades completos no [PRD](docs/prd.md).

| Pilar | Como funciona | Resultado esperado |
|---|---|---|
| **1. Campanhas recorrentes (foco)** | Campanhas em datas fáceis de lembrar, como 11/11 e 12/12, combinam ofertas de grande desconto e quantidade limitada com outras promoções. As promoções e as lojas participantes mudam a cada campanha. Fora delas, a loja pode publicar ofertas relâmpago, se quiser. | Motivar a ida em dias específicos, a chegada antecipada e a permanência até a liberação das ofertas |
| **2. Pontos e descontos** | Compras comprovadas geram pontos proporcionais ao valor, trocados por descontos futuros ou estacionamento. | Dar ao visitante um motivo para retornar |
| **3. Pertencimento e participação (bônus)** | O público ajuda a decidir a programação, como qual jogo transmitir. | Fazer o visitante reconhecer sua escolha na programação |
| **4. Marketing e divulgação** | Canais do shopping e dos lojistas, redes sociais, influenciadores, comunidades e programa de indicação, em que quem indica e quem é indicado ganham pontos. | Fazer as campanhas serem conhecidas |

**Exemplo de uso.** O shopping divulga antecipadamente sua campanha de **11/11**, com **cinco placas de vídeo com 60% de desconto** liberadas em um lote limitado durante o dia, além de promoções em outras lojas. Visitantes chegam cedo e circulam enquanto aguardam. Quem consegue resgata o cupom e compra; quem não consegue aproveita outra promoção, pois já está no local. A compra comprovada gera pontos para a próxima visita. O cenário é ilustrativo: datas, quantidades e descontos não definem regras comerciais.

## Como executar

> ⏳ A base do código está sendo criada no épico E4; estes comandos passam a valer quando ela chegar à `develop`.

**Pré-requisitos:** [Node.js](https://nodejs.org/) 22 ou mais recente e Git.

```bash
git clone https://github.com/Tchez/hackathon-unicatolica.git
cd hackathon-unicatolica
npm install
npm run dev
```

Abra http://localhost:5173. O app abre sem login; para resgatar, pontuar ou entrar como lojista ou administração do shopping, escolha um usuário de exemplo. Não há senha nem configuração; os dados são simulados e ficam no navegador. No computador aparece o layout web; em telas menores que 1024 px, o layout de aplicativo. Janelas do mesmo navegador compartilham os dados: abra uma por perfil para ver as ações de um refletidas no outro.

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run dev -- --host` | Mesmo servidor, acessível por outro aparelho na mesma rede |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm test` | Testes das regras (Vitest) |
| `npm run lint` | Verifica o código (ESLint) |
| `npm run format` | Formata o código (Prettier) |

**Versão publicada:** ⏳ link público. Para instalar como aplicativo, abra o link no celular: no Android, use o botão "Instalar app"; no iPhone, Safari › Compartilhar › Adicionar à Tela de Início.

**Recomeçar a demonstração:** use "Restaurar dados de demonstração" no perfil.

## Estrutura do repositório

```
.
├── README.md
├── CONTRIBUTING.md            # fluxo de trabalho: tarefas, branches, commits, PRs
├── AGENTS.md                  # regras para assistentes de IA (CLAUDE.md importa este arquivo)
├── src/                       # código; estrutura no SDD, seção 9
└── docs/
    ├── prd.md                 # requisitos de produto, priorizados em MoSCoW
    ├── sdd.md                 # design de software e decisões técnicas
    ├── design.md              # UI/UX: tema, telas e jornadas
    ├── prototype/app.html     # protótipo navegável das jornadas (referência, não código)
    └── specs/                 # fatias de implementação (000-modelo.md)
```

## Documentação

| Documento | Conteúdo |
|---|---|
| [PRD](docs/prd.md) | Problema, objetivos e não objetivos, requisitos funcionais e não funcionais priorizados em MoSCoW, decisões de produto, métricas, riscos e perguntas em aberto |
| [SDD](docs/sdd.md) | Arquitetura, stack, módulos, modelo de dados, o que é real e o que é simulado, decisões técnicas |
| [Design](docs/design.md) | Tema visual, navegação, telas e estados, jornadas e validação; protótipo navegável em `docs/prototype/app.html` |
| [Specs](docs/specs/000-modelo.md) | Fatias de implementação, uma por arquivo |
| [Notion da equipe](https://cute-felidae-d88.notion.site/Proposta-de-solu-o-41778f6a5d55809f9337f0b2172416ef) | Documento da ideia entregue na primeira fase |

## Como contribuir

Veja o [CONTRIBUTING.md](CONTRIBUTING.md): tarefas no quadro do GitHub, uma branch por issue, Conventional Commits e pull requests que fecham a issue. O código sobe por `develop` → `main`, sempre por pull request.
