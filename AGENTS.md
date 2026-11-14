# Acordo de trabalho

## Contexto

- MVP do Desafio 05 do Hackathon Unicatólica: engajamento e fidelização de visitantes de shopping centers. Entrega no sábado, 14/11/2026, até as 12h: MVP funcional, repositório, documentação, instruções de execução e Easter Egg demonstrável.
- Quatro pessoas trabalham em paralelo, cada uma com um assistente de IA. Siga os padrões abaixo à risca, para o código parecer escrito por uma pessoa só.

## Antes de alterar

- Leia o `README.md`, o `docs/prd.md` (requisitos priorizados em MoSCoW) e, para código, o `docs/sdd.md`, o `docs/design.md` e a spec da tarefa em `docs/specs/`, se houver.
- Leia a tarefa com `gh issue view <número> -R Tchez/hackathon-unicatolica`: a issue traz o critério "Pronto quando" e o prazo. Se a pessoa indicar uma tarefa, ela vale mais que a ordem do quadro.
- Siga o `CONTRIBUTING.md`: branch criada a partir de `develop`, Conventional Commits em português, pull request para `develop` com `Closes #numero`. Nunca abra PR para `main`.

## Escopo

- Implemente requisitos **Must** do PRD. Requisitos Should e Could só quando a issue tiver a etiqueta `bônus`.
- O Desafio 05 se aplica a shopping centers em geral. Capim Dourado é apenas um exemplo; não trate sua marca, localização ou aplicativo como requisitos.

## Código

- Siga as convenções do `docs/sdd.md` (seção 9): estrutura de pastas, nomes, componentes e dados simulados. Enquanto uma convenção estiver marcada com ⏳, não invente padrão: pergunte a quem pediu a tarefa.
- Telas seguem o `docs/design.md` (tema, telas, estados e jornadas). O `docs/prototype/app.html` é referência visual e de fluxo: reconstrua em React seguindo o SDD, nunca copie o HTML.
- Reaproveite componentes e dados simulados existentes antes de criar novos.
- Dependência ou padrão novo: registre nas decisões técnicas do SDD (seção 8). Dependência ou comando novo: atualize o "Como executar" do README no mesmo PR.
- Tudo o que for simulado (dados, integrações, presença) aparece identificado como simulação na interface e no SDD (seção 6).

## Dúvidas

- Regra de negócio em aberto (perguntas Qnn do PRD) ou qualquer lacuna: não decida sozinho. Pergunte a quem pediu a tarefa e registre a dúvida na issue ou na spec.

## Documentação

- Diferencie decisões confirmadas, sugestões e perguntas em aberto.
- Se a mudança altera escopo, regra ou arquitetura, atualize no mesmo pull request o PRD ou o SDD.
- Documentação e comentários em PT-BR, com acentuação correta; identificadores de código em inglês. Mantenha válidos os links entre os documentos.

## Git e segurança

- Pedir uma tarefa autoriza criar a branch e commitar nela. Push e pull request só quando a pessoa pedir.
- Nunca inclua segredos ou dados pessoais reais.
