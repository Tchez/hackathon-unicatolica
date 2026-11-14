# SPEC 004: indicação e conta

- **Issue:** #4 (E4)
- **Requisitos do PRD:** F27, F04, RNF05
- **Status:** Feita

## Objetivo

O visitante indica amigos com um código e os dois ganham bônus; quem não tem conta cria uma com código de indicação; o perfil reúne consentimento, instalação e saída. Jornada J6 e parte da J1 do [design](../design.md#5-jornadas).

## Escopo

- **Dentro:** `/visitor/referral` (módulo `referral`), `/login` e `/profile` (módulo `account`).
- **Fora:** a primeira compra do indicado (SPEC 003 e 005).

## Comportamento esperado

1. Dado "Indicar", então mostra o código pessoal (Bruno: `BRUNO100`), botão "Copiar" e "Compartilhar" (Web Share API quando existir; senão copia), a regra "Você e quem você indicar ganham 100 pontos na primeira compra comprovada" (selo "Valor ilustrativo") e a lista de indicações com status "Aguardando primeira compra" ou "Bônus liberado".
2. Dado `/login`, então lista os usuários de exemplo por perfil (visitante, lojista, shopping) para entrar sem senha, e um bloco "Criar conta" com campo opcional "Código de indicação".
3. Dado "Criar conta" com `BRUNO100`, então entra como Ana e `registerWithCode` registra a indicação; código inexistente mostra "Código não encontrado" e permite seguir sem código.
4. Dado o perfil, então mostra nome, perfil e:
   - consentimento de marketing separado e desligado por padrão (RNF05);
   - "Instalar app" só quando o navegador oferecer a instalação;
   - "Restaurar dados de demonstração" e "Sair".
5. Dado o perfil do lojista ou do shopping, então mostra só nome, "Restaurar dados de demonstração" e "Sair".

## Dados e integrações

- Ações da SPEC 001: `login`, `logout`, `restoreDemoData`, `registerWithCode`.
- Cadastro real e envio de convites: simulados (`SimulatedBadge`).

## Pronto quando

- [ ] J6 funciona com a SPEC 003 e 005 (ou disparando `confirmPurchase` pelo console).
- [ ] Criar conta com e sem código funciona.
- [ ] `npm run lint && npm test && npm run build` passam.

## Dúvidas

- Decisão P8 do design (criar conta vira sempre a Ana) em validação.
