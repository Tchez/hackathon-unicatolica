# Como contribuir

Fluxo de trabalho da equipe durante o hackathon. Vale para pessoas e para assistentes de IA.

## Tarefas

As tarefas estão no quadro do projeto no GitHub, como issues agrupadas em épicos (sub-issues).

1. Pegue a primeira tarefa da coluna **Todo** que você consegue fazer, atribua a si e mova para **In Progress**. Uma tarefa por pessoa de cada vez.
2. Tarefa nova surgiu? Crie uma sub-issue no épico certo, com a etiqueta do tipo de trabalho.
3. Missão do evento vira sub-issue do épico E2 com a etiqueta `missão`.

| Épico | Assunto |
|---|---|
| E1 | Definir juntos o escopo da solução |
| E2 | Desafios e missões do evento |
| E3 | Telas, UI e UX |
| E4 | Stack e base do projeto |
| E5 | Pitch e referências |
| E6 | Evoluir o MVP |
| E7 | Estruturar a entrega |

| Etiqueta | Tipo de trabalho |
|---|---|
| `ideia` | Escopo, regras do produto, decisões |
| `pesquisa` | Referências, mentores, regras do evento |
| `ui-ux` | Esboços, textos, fluxos |
| `código` | Implementação |
| `pitch` | Narrativa, slides, ensaio |
| `docs` | Documentação e instruções |
| `missão` | Missões e desafios do evento |
| `bônus` | Requisito Should ou Could do PRD: só depois de o núcleo funcionar |
| `épico` | Agrupa tarefas |

## Branches

```
branch da tarefa ─PR─▶ develop ─PR─▶ main
```

| Branch | Papel | Recebe |
|---|---|---|
| `develop` | Integração do trabalho do dia | PR de branches de tarefa |
| `main` | Entrega avaliada | PR só de `develop` |

- As duas são protegidas: nada entra por push direto. PR para `main` só a partir de `develop`.
- Toda tarefa nasce de uma issue, numa branch criada a partir de `develop`, com nome livre.
- Quem promove `develop` → `main` é o tech lead, nos checkpoints e antes da entrega.

## Commits

Padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/), em português:

| Tipo | Uso |
|---|---|
| `feat` | Funcionalidade nova |
| `fix` | Correção |
| `docs` | Documentação |
| `style` | Visual, sem mudar comportamento |
| `refactor` | Reorganização de código, sem mudar comportamento |
| `test` | Testes |
| `chore` | Configuração e manutenção |

Exemplo: `feat: liberar lote da campanha em horário surpresa (#21)`.

## Pull requests

- Pequeno e de uma tarefa só, com base em `develop`. O título segue o padrão de commit.
- A descrição diz o que muda e como testar, e fecha a issue com `Closes #numero`.
- Antes de pedir revisão: o projeto roda seguindo o README; o que é simulado aparece identificado; PRD, SDD e o "Como executar" do README estão atualizados, se o PR mexe neles.
- O tech lead revisa e faz o merge em `develop` com **squash**; a branch da tarefa é apagada depois.
- A promoção `develop` → `main` usa **merge commit**, para as duas branches manterem o mesmo histórico.
- Se o PR muda escopo, regra ou arquitetura, atualize no mesmo PR o [PRD](docs/prd.md) ou o [SDD](docs/sdd.md).

## Documentação

| Documento | Conteúdo |
|---|---|
| [README](README.md) | Visão geral, como executar, estrutura |
| [PRD](docs/prd.md) | Problema, requisitos priorizados em MoSCoW, decisões de produto, riscos |
| [SDD](docs/sdd.md) | Arquitetura, stack, módulos, dados, o que é real e o que é simulado, decisões técnicas |
| [Specs](docs/specs/000-modelo.md) | Uma fatia de implementação por arquivo, a partir do modelo 000 |
| [AGENTS.md](AGENTS.md) | Regras para assistentes de IA |
