# PRD: engajamento e fidelização de visitantes de shopping centers

**Documento de requisitos de produto** do Desafio 05 do Hackathon Unicatólica.

[README](../README.md) · [Design de software (SDD)](sdd.md) · [Documento da equipe no Notion](https://cute-felidae-d88.notion.site/Proposta-de-solu-o-41778f6a5d55809f9337f0b2172416ef)

| | |
|---|---|
| **Status** | MVP implementado (specs 001 a 009); versão online pendente; entrega em 14/11/2026 até 12h |
| **Entrega** | Sábado, 14/11/2026, até as 12h: MVP funcional, repositório, documentação e instruções de execução, com o Easter Egg demonstrável |
| **Prioridade** | [MoSCoW](https://www.agilebusiness.org/dsdm-project-framework/moscow-prioritisation.html): **Must** (núcleo do MVP), **Should** e **Could** (bônus, nessa ordem), **Won't** (fora desta entrega) |

A prioridade MoSCoW diz se o item entra no MVP; o status diz se o detalhe já foi decidido: **Confirmado** (decidido pela equipe), **Proposto** (sugestão ainda não aprovada), **Em aberto** (falta decisão ou validação). Um item Must com detalhe Proposto ou Em aberto entra no MVP, e o detalhe pendente é perguntado à equipe, nunca suposto.

## 1. Contexto e problema

Enunciado do [Desafio 05](../README.md#desafio-05): ampliar o relacionamento, a participação e o engajamento dos visitantes com o shopping, além da visita ou do consumo pontual. O escopo é geral, sem vínculo com um empreendimento ou cidade.

A equipe atua sobre três necessidades:

- **Visitantes:** ter motivos recorrentes para voltar, permanecer e receber benefícios por suas compras.
- **Lojistas:** transformar períodos de baixo movimento em oportunidades de venda.
- **Shopping:** manter um relacionamento com o público e conhecer seus interesses.

Essas necessidades orientam a ideia; ainda não há pesquisa com usuários nem resultados que comprovem o impacto.

## 2. Público

| Público | Papel |
|---|---|
| Visitante/consumidor | Público principal: participa das campanhas, acumula e resgata pontos, indica amigos |
| Lojista | Participa das campanhas e, se quiser, cria ofertas relâmpago |
| Administração do shopping | Planeja as campanhas e financia parte dos benefícios (Q04) |
| Influenciadores e comunidades | Ampliam o alcance das campanhas e da indicação |

Em aberto: priorizar visitantes novos ou ocasionais, ou recompensar os frequentes (Q07).

## 3. Objetivos e não objetivos

**Objetivos**

- Motivar visitas em datas marcadas, com chegada antecipada e permanência.
- Transformar cada compra em motivo para a próxima visita.
- Ampliar o alcance com divulgação, influenciadores e indicação.
- Dar à loja uma ferramenta para movimentar horários fracos.

**Não objetivos desta entrega**

- Pertencimento e participação na programação: é bônus (Should).
- Integrações reais com aplicativo do shopping, sistemas das lojas, SEFAZ ou estacionamento: serão simuladas quando necessário, com aviso na demonstração.
- Comprovar impacto em vendas: as métricas da seção 9 servem a um piloto futuro.

## 4. Proposta de valor e pilares

> Ter datas para aproveitar ofertas e transformar compras em benefícios para a próxima visita.

| # | Pilar | Mecanismo | Prioridade |
|---|---|---|---|
| 1 | **Campanhas recorrentes** | Datas definidas, como 11/11 e 12/12, divulgadas antes, com ofertas de destaque limitadas e outras promoções; as promoções e as lojas participantes mudam a cada campanha; lotes liberados ao longo do dia, inclusive em horários surpresa | Foco |
| 2 | **Pontos e descontos futuros** | Compra comprovada gera pontos proporcionais ao valor, inclusive compras pequenas; o saldo vira desconto ou estacionamento | Must |
| 3 | **Pertencimento e participação** | O público decide entre opções de programação, como qual jogo transmitir, e vê a escolha acontecer | Should: tem muitas possibilidades e exige tempo, melhor não entregar incompleto |
| 4 | **Marketing e divulgação** | Canais do shopping e dos lojistas, redes sociais, influenciadores, comunidades e programa de indicação | Must: sem divulgação, as campanhas não funcionam |

**Lógica das ofertas de destaque.** Uma oferta de grande apelo e poucas unidades atrai atenção para o conjunto. Exemplo hipotético: cinco TVs pela metade do preço atraem mil visitantes; além das cinco vendas, o interesse está nas outras 995 pessoas, que já estão no shopping e podem encontrar ofertas de margem mais sustentável. Os números são ilustrativos. A conversão de quem não resgatou precisa ser validada, e os lotes anunciados devem existir.

**Referência usada.** O Capim Dourado Shopping, em Palmas (TO), foi o exemplo da discussão. Segundo o levantamento da equipe, seu aplicativo tem conta, cupons, promoções, eventos, cinema, pagamento e localização de vaga, mapa, lojas favoritas e QR code; segundo notícias locais, ainda a confirmar, suas campanhas sazonais exigiam valor alto em notas (Natal 2025: R$ 900 em compras). É uma referência exploratória, não um diagnóstico do setor.

## 5. Requisitos funcionais

| ID | Requisito | Pilar | MoSCoW | Status | Critério para a demonstração ou ponto de atenção |
|---|---|---|---|---|---|
| F06 | Campanhas recorrentes com ofertas limitadas e liberação de lotes | 1 | **Must** | Confirmado; calendário em aberto (Q12) | Campanha em data como 11/11, com as lojas e ofertas daquela edição; lotes liberados, inclusive em horário surpresa; aviso aos presentes; limite respeitado |
| F16 | Ofertas relâmpago criadas pelo lojista | 1 | **Must** | Confirmado; uso opcional pela loja | Criar pelo celular em menos de um minuto, com desconto, duração e limite; mostrar prazo e quantidade restante; encerrar ao expirar ou esgotar |
| F01 | Comprovação e registro de compra | 2 | **Must** | Confirmado; código de compra (D12) | Identificar loja e valor, registrar no histórico e impedir o registro duplicado do mesmo comprovante |
| F02 | Pontos proporcionais ao valor da compra | 2 | **Must** | Confirmado; taxa em aberto (Q03) | Atualizar o saldo após o registro; compras de menor valor também pontuam |
| F03 | Saldo e troca de pontos por desconto | 2 | **Must** | Confirmado | Cupom gerado aparece em "Meus cupons" |
| F23 | Estacionamento como resgate de pontos | 2 | **Must** | Confirmado | Trocar pontos por desconto ou isenção; limitar o resgate, porque estacionamento é receita do shopping |
| F27 | Programa de indicação, com código por usuário, influenciador ou comunidade | 4 | **Must** | Confirmado; momento do bônus em aberto | Quem indica e quem é indicado ganham pontos de bônus (incorpora a antiga F21, bônus no cadastro); liberar na primeira compra comprovada reduz contas falsas |
| F04 | Conta do usuário | Base | **Must** | Confirmado (login simulado, D11) | Vincular saldo, resgates e indicações a um usuário; login simples ou simulado |
| F07 | Votação entre opções fechadas, com resultado refletido na programação | 3 | Should | Confirmado como parte do pilar 3; versão mínima implementada (SPEC 009) | Um voto por usuário; só votar o que o shopping vai cumprir; risco de captura por grupos organizados |
| F09 | Eventos escolhidos com participação das comunidades, com eventual brinde | 3 | Should | Confirmado como parte do pilar 3 | Depende da operação do shopping |
| F30 | Encontros em datas marcantes, como finais de campeonato e festividades, com brindes durante o evento | 3 | Should | Proposto | Efeito acaba com o evento; bebida alcoólica exige controle de idade e opção sem álcool; brinde condicionado a compra com estoque limitado pode exigir autorização federal |
| F31 | Votações sobre eventos e decisões do shopping, como tema da decoração ou próxima atração | 3 | Should | Proposto | Mesmos riscos da F07 |
| F18 | Dia mensal de ofertas de uma categoria, com lojas e produtos surpresa | 1 | Could | Proposto | Exige adesão de várias lojas da mesma categoria |
| F25 | Isca do dia a dia: item barato em área ou horário de pouco movimento | 1 | Could | Proposto | Lojista não vende no prejuízo: precisa de cofinanciamento |
| F08 | Grupos, combos e benefício que só vale quando duas pessoas vão juntas | 1 | Could | Proposto | Não atende igualmente quem vai sozinho |
| F19 | Painel do lojista com resgates, perfil agregado e horários de pico | Operação | Could | Proposto | Depende de volume; o lojista vê apenas dados agregados |
| F29 | Comunidades anfitriãs propõem e conduzem atividades que entram nas votações | 3 | Could | Proposto | Depende de anfitrião que repita |
| F15 | Nomes de níveis associados à identidade do shopping | 2 | Could | Proposto | Depende de F05 |
| F11 | Jogos para ganhar ou multiplicar pontos | 2 | Could | Proposto | Adiada pelo esforço de desenvolvimento |
| F24 | Pontos extras na primeira compra em uma loja nova | 2 | Could | Proposto | Possibilidade futura; depende de a loja querer |
| F12 | Ranking de clientes com benefícios | 2 | Could | Proposto | Diferenciar de níveis |
| F10 | Relato de incidentes com recompensa | Operação | Could | Proposto | Exige evidências e moderação (D04) |
| F13, F20, F22, F26, F28, W01, W02 | Pontos por interação social; consolação para quem não conseguiu a oferta; cupons cumulativos; ofertas em serviços dentro do shopping; canal pelo WhatsApp; opiniões, perguntas frequentes e NPS; pontos por feedback | n/a | Won't | Descartados em 13/11 | n/a |

**Em aberto, sem prioridade definida:**

| ID | Item | Situação |
|---|---|---|
| F05 | Níveis de fidelidade: progresso, mudança de nível e taxa correspondente | Não classificado; níveis tendem a favorecer quem já é frequente (Q07) |
| F14 | Desconto no aluguel ou condomínio para o lojista que aderir e financiar descontos | Pesquisar se faz sentido; parte do aluguel costuma ser percentual sobre as vendas |
| F32 | Leis de incentivo à cultura para financiar eventos | Pesquisar quais se aplicam e quem pode usar a dedução, que costuma exigir imposto pelo lucro real |

## 6. Requisitos não funcionais

| ID | Requisito | MoSCoW | Status |
|---|---|---|---|
| RNF01 | Qualquer pessoa consegue instalar e executar o projeto seguindo o README | Must | Confirmado; implementado na SPEC 007 |
| RNF02 | O Easter Egg está implementado e é demonstrável; o que é e onde fica é definido numa tarefa do épico E2, conforme a regra do evento | Must | Confirmado (exigência da entrega) |
| RNF03 | Dados, integrações e presença simulados aparecem identificados como simulação | Must | Confirmado |
| RNF04 | Prazos e quantidades de ofertas são reais: a oferta encerra ao expirar ou esgotar | Must | Confirmado |
| RNF05 | Dados pessoais: coleta mínima, consentimento específico para marketing, lojista vê apenas dados agregados (LGPD) | Must | Proposto |
| RNF06 | Benefícios sem sorteio: sorteio, vale-brinde e brinde com estoque limitado exigem autorização federal prévia (Lei 5.768/1971) | Must | Proposto |
| RNF07 | Limite de notificações por usuário | Should | Em aberto (Q11) |

## 7. Jornadas

**Shopping:** planejar a campanha e escolher as lojas e ofertas da edição → divulgar data e condições → liberar os lotes → acompanhar resgates e movimento.

**Lojista, fora das campanhas:** se quiser, informar desconto, duração e quantidade → publicar a oferta relâmpago → acompanhar resgates.

**Visitante na campanha:** conhecer a data e a oferta → planejar a visita e chegar cedo → circular enquanto aguarda → tentar resgatar o cupom → comprar a oferta, se conseguir, ou outra promoção → comprovar a compra → acumular pontos e trocar por desconto ou estacionamento.

**Quem indica:** compartilhar o código → o indicado se cadastra e compra → os dois ganham pontos de bônus.

**Princípios comportamentais (D07):**

| Princípio | Aplicação |
|---|---|
| Escassez e urgência | Quantidade real de cupons restantes, prazo e contagem regressiva |
| Recorrência e antecipação | Datas como 11/11 e 12/12 divulgadas antes, para planejar a ida |
| Recompensa variável e curiosidade | Lotes em horários surpresa; data anunciada sem antecipar todas as lojas e produtos |
| Plano concreto | Pedir que o visitante escolha o horário e adicione a data à agenda |
| Enquadramento | Economia em reais e equivalência dos pontos |
| Efeito de posse e continuidade | Cupons e pontos na carteira, com validade e quanto falta para a próxima recompensa |

## 8. Decisões de produto

Decisões técnicas ficam no [SDD](sdd.md#8-decisões-técnicas).

| ID | Decisão | Motivo ou limite |
|---|---|---|
| D01 | Atender ao Desafio 05 para shopping centers em geral | Capim Dourado é exemplo, não restrição |
| D02 | Pilares por prioridade: campanhas recorrentes (foco), pontos, marketing; pertencimento é bônus | Concentrar o MVP no que atrai e traz de volta |
| D03 | Votação entre opções fechadas para decidir a programação | Vale se o pilar 3 for feito; versão mínima implementada (SPEC 009) |
| D04 | Relatos de incidentes exigem fatos e evidências | Vale se a F10 for feita |
| D05 | Separar decisões de possibilidades | Evitar que sugestões virem compromissos |
| D06 | Ofertas relâmpago criadas pelo lojista, com aviso a quem está no shopping ou perto | Uso opcional pela loja, para horários fracos |
| D07 | Princípios comportamentais nas promoções e nos pontos | As aplicações concretas são propostas |
| D08 | Campanhas em datas marcantes com ofertas limitadas de destaque e outras promoções | Data fixa; promoções e lojas variam por edição |
| D09 | Marketing e divulgação são pilar, com influenciadores, comunidades e indicação | Sem divulgação, as campanhas não funcionam |
| D10 | Escopo revisado em 13/11, priorizado em MoSCoW neste documento | Fluxo campanha → compra → pontos → resgate, com indicação |
| D11 | Visitante, lojista e administração do shopping usam a mesma aplicação, com o perfil escolhido no login | Login simulado no MVP (F04) |
| D12 | Compra comprovada por código de uso único, como o código de entrega do iFood: o visitante gera no app, informa no caixa, e o lojista digita o código e o valor | O valor vem da loja e o código não se reutiliza. A chave da NFC-e foi descartada: valida loja e duplicidade, mas o valor exige o portal da SEFAZ, que tem captcha |
| D13 | A solução é um módulo dentro do app que o shopping já tem, não um app novo. A demonstração usa o visual do app do Capim Dourado, o piloto; as cores ficam num tema configurável | Ninguém instala outro app; aproveita conta, cupons e pagamento de estacionamento existentes; continua valendo para outros shoppings (D01). A integração real depende do fornecedor do app |

## 9. Métricas de sucesso

Para um piloto futuro, sem metas definidas. Comparar sempre com quem não participa.

| Métrica | O que mostra |
|---|---|
| Compras fora da oferta principal durante a campanha | Se a oferta de destaque gera vendas para outras lojas |
| Visitantes que voltam entre uma campanha e a próxima | Se a relação continua depois do dia |
| Pontos resgatados, inclusive em estacionamento | Se o benefício é percebido |
| Compras de indicados | Se a indicação traz gente nova, além de cadastros |
| Ofertas relâmpago criadas pelos lojistas | Se as lojas adotam a ferramenta |

## 10. Riscos, premissas e dependências

Integrações com aplicativos de shopping, consulta de notas e detecção de presença não têm viabilidade confirmada para o hackathon; serão simuladas quando necessário.

| Risco | Impacto | Tratamento |
|---|---|---|
| Escopo amplo | Demonstração incompleta | Must primeiro; Should e Could só depois do fluxo principal |
| Oferta de destaque atrair público sem gerar outras compras | Campanha não compensa | Medir compras fora da oferta principal |
| Efeito da campanha acabar no dia; surpresa perder força | Visitas não se repetem | Ligar cada campanha a pontos; variar o formato |
| Reutilização de comprovantes ou compras de terceiros | Pontos indevidos | Código de uso único confirmado pelo lojista (D12) |
| Autoindicação e contas falsas | Pontos indevidos | Bônus na primeira compra comprovada; um bônus por indicado |
| Baixa adesão dos lojistas ou custo dos descontos | Faltam benefícios | Validar o financiamento (Q04); F14 em pesquisa |
| Estacionamento como resgate reduzir receita | Veto da administração | Limitar o resgate (F23) |
| Recompensar apenas quem já compraria | Sem consumo adicional | Comparar com quem não participa |
| Programa de pontos já ser padrão em grandes redes | Proposta parecer igual | Destacar pontos em compras pequenas, ligação com campanhas e indicação |
| Divulgação insuficiente | Campanhas vazias | Operação de divulgação (Q13); indicação e influenciadores |
| Excesso de notificações | Abandono | Limites e preferências (Q11) |
| Dados pessoais, localização e notas | Exposição de informações | RNF05 |
| Sorteio ou brinde com estoque limitado | Exigir autorização federal (40 a 120 dias) | RNF06 |

## 11. Perguntas em aberto

| ID | Questão | Por que importa |
|---|---|---|
| Q03 | Regra de geração e resgate de pontos, inclusive estacionamento e indicação | Discutidos: R$ 1.000 → 10 pontos, R$ 1.000 → 100 pontos, 1% de cashback, resgate a partir de 500 pontos. Nenhuma aprovada |
| Q04 | Quem financia cada desconto: shopping, lojista ou ambos? | Na oferta de destaque, quem dá o desconto não fica com as vendas das outras lojas. Alternativas: fundo de promoção, rateio entre participantes, F14, F32 |
| Q05 | Nomes dos níveis, se adotados | Exemplos para o Capim Dourado: Semente → Broto → Haste → Capim Dourado; Pequi → Buriti → Ipê Amarelo → Sol do Cerrado; Visitante → Frequentador → De Casa → Patrimônio do Capim |
| Q06 | Limites e taxas de cada nível | Exemplos não aprovados: 5 mil, 10 mil e 50 mil pontos para bronze, prata e ouro |
| Q07 | Foco em visitantes novos/ocasionais ou nos frequentes? | Programas de pontos costumam atrair primeiro os frequentes; o ganho tende a vir de quem vem pouco |
| Q08 | Critérios de avaliação e formato do pitch | A entrega já é conhecida; critérios e pitch ainda não |
| Q09 | Como identificar quem está no shopping ou perto? | Discutidos: geolocalização, QR na entrada, Wi-Fi, estacionamento pago pelo app. Beacons foram abandonados no setor, e detecção sem consentimento já gerou multas. Alternativas: QR ou check-in do visitante, localização com consentimento. Pode ser simulada na demonstração |
| Q10 | Quando um cupom entra no limite dos "primeiros N"? Há reserva e prazo de uso? | Define disponibilidade e resgate |
| Q11 | Limite de notificações por dia ou por usuário | Evita abandono |
| Q12 | Calendário das campanhas e definição de horários, lotes, lojas e condições | Datas de dia e mês iguais caem em dias diferentes da semana (12/12/2026 é sábado), e no fim de semana o shopping costuma estar cheio |
| Q13 | Quem coordena e financia a divulgação; quais canais e influenciadores | Sustenta o alcance das campanhas e da indicação |
| Q14 | Validade do código de compra | Curta dificulta o uso por terceiros; longa evita pressa no caixa |

## 12. Demonstração

Cenário ilustrativo: uma campanha de 11/11 anuncia cinco TVs pela metade do preço em um lote liberado durante o dia, junto de promoções em outras lojas. A visitante chega cedo e circula enquanto aguarda. No lote, ela tenta resgatar: consegue e compra, ou encontra o esgotado e aproveita outra promoção. A compra comprovada gera pontos para a próxima visita.

Critérios, verificados no app publicado:

- [x] Campanha recorrente: divulgação, chegada antecipada e liberação do lote, com alternativas quando o cupom esgota.
- [x] Prazo e quantidade reais; a oferta encerra ao expirar ou esgotar.
- [x] Aviso ao visitante, com presença real ou simulada e identificada.
- [x] Lojista cria uma oferta relâmpago com desconto, prazo e limite.
- [x] Registro de compra sem reutilização do comprovante.
- [x] Pontos pela regra definida, saldo e quanto falta para a próxima recompensa.
- [x] Troca de pontos por cupom ou estacionamento.
- [x] Código de indicação e bônus para quem indica e para o indicado.
- [x] Easter Egg demonstrado.
- [x] Votação da programação ([SPEC 009](specs/009-votacao-da-programacao.md)).
- [x] Roteiro do vídeo de 90 s ([pitch](pitch/README.md)).
- [ ] Apresentação de 5 minutos: pilares, financiamento e o que é real ou simulado.
