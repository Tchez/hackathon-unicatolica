# Documento de design de software (SDD)

[README](../README.md) · [PRD](prd.md)

Como o MVP é construído. O **que** e o **porquê** estão no [PRD](prd.md); as decisões técnicas ficam na seção 8. Este documento é preenchido durante a construção (épico E4), precisa refletir o código entregue e define as convenções de código que todos seguem (seção 9).

> **Status:** em construção. As seções marcadas com ⏳ ainda não foram definidas.

## 1. Escopo técnico

Implementa os requisitos **Must** do [PRD](prd.md#5-requisitos-funcionais): campanhas recorrentes (F06), ofertas relâmpago (F16), registro de compra (F01), pontos (F02), troca por desconto (F03) e por estacionamento (F23), indicação (F27), conta (F04) e os requisitos não funcionais RNF01 a RNF06.

## 2. Arquitetura

⏳ Diagramas no [modelo C4](https://c4model.com/), em Mermaid:

- **Contexto:** visitante, lojista e administração do shopping usando o sistema; sistemas externos (SEFAZ, estacionamento, aplicativo do shopping) simulados.
- **Contêineres:** aplicação, armazenamento de dados e serviços.

## 3. Stack

⏳ Definida no E4 e registrada na seção 8.

## 4. Módulos

⏳ Um módulo por área do PRD, com responsável pela tela ou pelo serviço.

| Módulo | Requisitos | Responsabilidade |
|---|---|---|
| Campanhas e ofertas | F06, F16 | ⏳ |
| Compras e pontos | F01, F02, F03, F23 | ⏳ |
| Indicação | F27 | ⏳ |
| Conta | F04 | ⏳ |

## 5. Modelo de dados

⏳ Entidades previstas a partir do PRD: usuário, loja, campanha, oferta, cupom, compra, movimento de pontos, resgate e indicação.

## 6. Real × simulado

Exigência do RNF03: tudo o que for simulado aparece como simulação na interface e aqui.

| Componente | Real ou simulado | Como |
|---|---|---|
| ⏳ | | |

## 7. Execução e publicação

Instalação e execução ficam no [README](../README.md#como-executar); este documento só registra o que for específico da arquitetura. ⏳

## 8. Decisões técnicas

Uma linha por decisão técnica relevante, como stack, comprovação de compra e dados simulados.

| Data | Decisão | Motivo | Alternativas descartadas |
|---|---|---|---|
| ⏳ | | | |

## 9. Convenções de código

⏳ Definidas no E4, antes de as telas começarem. Todos, pessoas e assistentes de IA, seguem esta seção.

| Assunto | Convenção |
|---|---|
| Estrutura de pastas | ⏳ |
| Nomes de arquivos, componentes e funções (em inglês) | ⏳ |
| Componentes reutilizáveis: onde ficam e quando criar um novo | ⏳ |
| Dados simulados: onde ficam e formato | ⏳ |
| Como a interface identifica o que é simulado | ⏳ |
| Formatação e lint: ferramenta e comando | ⏳ |
| Textos da interface | PT-BR, com acentuação correta |

