# SPEC 008: publicação no GitHub Pages

- **Issue:** #7 (E7)
- **Requisitos do PRD:** RNF01
- **Status:** Pronta

## Objetivo

Publicar o app em `https://tchez.github.io/hackathon-unicatolica/`, com HTTPS, para a banca abrir o link e para instalar o PWA e testar o compartilhamento (Web Share) no celular.

## Escopo

- **Dentro:** app servido no subcaminho `/hackathon-unicatolica/`; workflow do GitHub Actions que valida, gera o build e publica; fallback para links diretos e recarga; `npm run dev` inalterado.
- **Fora:** domínio próprio (fica preparado, ver "Mudanças no código"); preview por pull request; qualquer backend ou variável de ambiente.

## Comportamento esperado

1. Dado o link `https://tchez.github.io/hackathon-unicatolica/`, quando a pessoa abre, então o app carrega com estilos, ícones e dados simulados, sem erro 404 no console.
2. Dado um link direto como `/hackathon-unicatolica/visitor/points`, quando a pessoa o abre ou recarrega a página, então a tela correta abre (o GitHub Pages responde com `404.html`, que é cópia do `index.html`, e o roteador resolve a rota).
3. Dado o app aberto no Chrome do Android, quando a pessoa instala pelo Perfil › Instalar app, então o ícone abre o app em tela cheia na página inicial, com escopo `/hackathon-unicatolica/`, e funciona offline depois da primeira carga.
4. Dado um push na `main`, quando o workflow roda, então só publica se lint, testes e build passarem; falha em qualquer etapa mantém a versão anterior no ar.
5. Dado o botão "Run workflow" (`workflow_dispatch`) escolhendo outra branch (ex.: `develop`), quando o workflow roda, então essa branch é publicada no mesmo link.
6. Dado o código local, quando a pessoa roda `npm run dev`, então o app abre em `http://localhost:5173/`, como antes. Depois de `npm run build`, `npm run preview` serve em `http://localhost:4173/hackathon-unicatolica/`.
7. Dado o app publicado em HTTPS, quando a pessoa usa "Compartilhar" no código de indicação (`ReferralCode.tsx`, `navigator.share`) no celular, então abre o menu nativo de compartilhamento.

## Investigação (o que quebra no subcaminho)

| Ponto | Situação | Ação |
|---|---|---|
| `vite.config.ts`: sem `base` | Assets sairiam de `/assets/...` e dariam 404 | Definir `base` |
| `src/main.tsx:11`: `<BrowserRouter>` sem `basename` | Rotas não casam sob o subcaminho | `basename={import.meta.env.BASE_URL}` |
| `vite.config.ts:20`: `start_url: '/'` | Ícone instalado abriria a raiz de `tchez.github.io`, fora do app | `start_url` e `scope` iguais ao `base` |
| `vite.config.ts` (`scope` ausente) | Escopo do manifest e do service worker poderia ficar fora do subcaminho | `scope` igual ao `base` |
| `vite.config.ts:23-26`: ícones `icon-192.png` etc. | Caminhos relativos, resolvidos a partir do manifest | Nada |
| `vite.config.ts:12`: `includeAssets: ['icon.svg']` | Relativo a `public/` | Nada |
| `index.html:5-6`: `href="/icon.svg"`, `href="/icon-maskable-512.png"` | O Vite reescreve caminhos absolutos de `public/` com o `base` ao gerar o build | Nada; conferir no `dist/index.html` |
| `index.html:20`: `src="/src/main.tsx"` | Reescrito pelo Vite no build | Nada |
| `<Link to="/...">` e `navigate('/...')` (ex.: `ProfilePage.tsx:42`, `OfferDetailPage.tsx:83`, `RouteGuard.tsx:23`) | O React Router aplica o `basename` | Nada |
| `pathname === '/'` em `WebLayout.tsx:49` e `AppLayout.tsx:23-24` | `pathname` vem de `useLocation()`, já sem o `basename` | Nada |
| `fetch`, `window.location`, `location.href`, `url(/...)` | Não existem no código | Nada |
| `src/config/mall.ts:5`: `logoUrl` | URL externa (https); sem a logo, o app mostra o nome | Nada |
| `navigateFallback` do service worker | Padrão do Workbox (`index.html`, relativo ao `base`) | Nada |

Só dois arquivos mudam. Não há caminho absoluto no código que dependa da raiz.

## Mudanças no código

1. `vite.config.ts`: passar a `defineConfig(({ command }) => { ... })`, com

   ```ts
   const base = process.env.BASE_PATH ?? (command === 'build' ? '/hackathon-unicatolica/' : '/')
   ```

   usar `base` em `defineConfig({ base, ... })` e, no `manifest`, trocar `start_url: '/'` por `start_url: base` e acrescentar `scope: base`. O `dev` fica em `/`; o build usa o subcaminho. Domínio próprio no futuro: `BASE_PATH=/` no build (ou trocar o valor padrão por `'/'`) e criar `public/CNAME` com o domínio.
2. `src/main.tsx:11`: `<BrowserRouter basename={import.meta.env.BASE_URL}>`. `BASE_URL` é `/` no dev e `/hackathon-unicatolica/` no build, então nada muda localmente.
3. Fallback de links diretos, no script `build` do `package.json`: `"build": "tsc -b && vite build && node -e \"require('fs').copyFileSync('dist/index.html','dist/404.html')\""`. Cópia pelo Node, não por `cp`, para o build funcionar também no Windows (RNF01). Alternativa: um passo no workflow; escolhido o script para o `npm run build` local gerar o mesmo `dist/` que a publicação.
4. `.github/workflows/deploy.yml`: novo, descrito abaixo.
5. `README.md` e `docs/sdd.md`: ver "Pronto quando". O SDD §7 e §8 são atualizados junto desta spec; o README só depois de o deploy existir.

### Links diretos: `404.html` em vez de HashRouter

O GitHub Pages não tem regras de reescrita: uma URL como `/hackathon-unicatolica/visitor/points` não corresponde a um arquivo e cai em `404.html`. Copiar o `index.html` para `404.html` faz o app carregar e o roteador resolver a rota, sem mudar nenhum código de rota nem as URLs.

- **Custo:** o servidor responde com status HTTP 404 nesses links, embora a página renderize normalmente. Não afeta o uso nem a demonstração; só indexação por buscadores, irrelevante aqui. Depois de instalado, o service worker serve o `index.html` e o status deixa de importar.
- **Descartado, HashRouter:** funciona sem truque, mas troca todas as URLs para `#/visitor/points`, altera o roteador e o `hash` usado em `AppLayout.tsx` para rolagem, e deixa os links compartilhados feios.

## Workflow (`.github/workflows/deploy.yml`)

- **Nome:** `Deploy`.
- **Gatilhos:** `push` em `main` e `workflow_dispatch`. O disparo manual permite escolher a branch na tela do Actions (ex.: `develop`).
- **`permissions`:** `contents: read`, `pages: write`, `id-token: write`.
- **`concurrency`:** `group: pages`, `cancel-in-progress: false`, para um deploy não interromper outro em andamento.
- **Job `build`** (`ubuntu-latest`):
  1. `actions/checkout@v7`
  2. `actions/setup-node@v7` com `node-version: 22` e `cache: npm`
  3. `npm ci`
  4. `npm run lint`
  5. `npm test`
  6. `npm run build` (gera `dist/` e `dist/404.html`)
  7. `actions/configure-pages@v6`
  8. `actions/upload-pages-artifact@v5` com `path: dist`
- **Job `deploy`:** `needs: build`, `environment: github-pages` com `url: ${{ steps.deployment.outputs.page_url }}`, e o passo `id: deployment` com `actions/deploy-pages@v5`.

Versões conferidas em 14/11/2026 nas páginas de releases das ações: `checkout` v7, `setup-node` v7, `configure-pages` v6, `upload-pages-artifact` v5, `deploy-pages` v5.

## Passo manual único (quem é dono do repositório)

Antes do primeiro deploy: Settings › Pages › Build and deployment › Source: **GitHub Actions**. Sem isso, o job `deploy` falha. A pessoa dona do repositório faz; o agente não mexe nas configurações. Se o repositório tiver proteção de ambiente `github-pages` restrita a `main`, o disparo manual de `develop` será recusado: liberar a branch em Settings › Environments › github-pages.

## Dados e integrações

Nada muda nos dados: continuam simulados e no `localStorage` do navegador, por origem (`tchez.github.io`). Não há segredo, variável de ambiente nem integração nova. A logo do shopping e as fontes continuam vindo de URLs externas.

## Pronto quando

- [ ] A Source do Pages está em GitHub Actions (feito pelo dono do repositório).
- [ ] O workflow roda verde numa execução manual com `develop` e o app abre no link, sem 404 no console.
- [ ] Link direto e recarga em uma rota interna (ex.: `/hackathon-unicatolica/visitor/points`) abrem a tela certa.
- [ ] No celular real, o app instala (Android: Perfil › Instalar app; iPhone: Safari › Adicionar à Tela de Início), abre na página inicial do app e o compartilhamento do código de indicação abre o menu nativo.
- [ ] Um push na `main` publica sozinho; um build com lint ou teste quebrado não publica.
- [ ] `npm run dev` abre em `http://localhost:5173/` e `npm run build && npm run preview` em `http://localhost:4173/hackathon-unicatolica/`.
- [ ] README: "Versão publicada" com o link, e "Como executar" com a URL do preview local.
- [ ] SDD (§3, §7 e §8) já atualizado junto desta spec; revisar se a implementação mudar algo.
- [ ] `npm run lint && npm test && npm run build` passam.

## Dúvidas

- Gatilho do deploy: assumido `push` em `main` mais disparo manual. Se o time quiser publicar também a cada push em `develop`, acrescentar a branch ao `on.push`; não assumido, para a `main` ser sempre a versão entregue.
- Node 22 no workflow, em vez do 20 pedido: o Node 20 saiu de manutenção e o `engines` do `package.json` aceita 22.13+. Se o time preferir 20, usar `20.19`.
- Domínio próprio: sem domínio definido; a troca é `BASE_PATH=/` (ou o valor padrão) e `public/CNAME`, e confirmar que o `CNAME` chega ao `dist/`.
- O repositório é público, então o Pages funciona no plano gratuito; confirmar que a organização ou conta não bloqueia o Pages.
