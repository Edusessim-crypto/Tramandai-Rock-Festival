# Tramandaí Rock Festival 2027

Site oficial (estático) do **Tramandaí Rock Festival 2027** — "O Rock Encontra o Verão".

Festival gratuito nos dias **08 e 09 de janeiro de 2027**, na Avenida Beira-Mar, ao lado do letreiro "Eu Amo Tramandaí", em Tramandaí/RS.

## Stack

- HTML5 + CSS3 + JavaScript vanilla (sem frameworks, sem build)
- Fontes: Google Fonts — **Barlow Condensed** (títulos e destaques) + **Inter** (textos)
- Ícones: sprite SVG inline no topo do `index.html` (`<use href="#i-nome">`)
- Mobile-first · breakpoints em 480, 768, 1024, 1280 e 1440px

## Estrutura

```
/
├── index.html              ← página única (home com âncoras)
├── site.webmanifest
├── favicon.ico
├── css/
│   └── style.css           ← design tokens no :root + componentes
├── js/
│   ├── data.js             ← CONTEÚDO: programação, atrações, notícias, patrocinadores, redes
│   └── main.js             ← renderização + contador, abas, menu, animações
└── assets/
    ├── brand/              ← logo (PROVISÓRIA), favicon e ícones
    └── img/
        └── og-image.jpg    ← arte de compartilhamento (1200×630)
```

## Como editar o conteúdo

Quase tudo que muda com frequência está em **`js/data.js`**:

| O quê | Onde |
|---|---|
| Programação (horários, bandas, DJs) | `programacao` |
| Atrações confirmadas | geradas automaticamente a partir dos itens `tipo: 'show'` da programação |
| Data/hora de início do contador | `evento.inicio` |
| Notícias | `noticias` (ordenadas automaticamente pela data) |
| Patrocinadores e apoiadores | `patrocinadores` (campo `logo` aceita caminho de arquivo) |
| Redes sociais (header, menu e footer) | `social` |

Fotos aceitam URL do Unsplash (o site gera `srcset` responsivo) ou um arquivo local, ex.: `assets/img/artistas/nome-da-banda.jpg`.

Textos fixos (hero, experiência, "O Festival", como chegar, footer) e metadados de SEO ficam no `index.html`. Se a data ou o local mudarem, atualize também: `<title>`/`description`, Open Graph, o JSON-LD (`MusicEvent`) no `<head>`, o hero, o bloco "Edição 2027" e o footer.

## Design system (resumo)

Tokens em `css/style.css` (`:root`):

- **Cores:** preto `#080808` · preto secundário `#0D0D0D` · grafite `#171717`/`#1B1B1B` · amarelo `#FFD500` (só em CTAs, datas, horários, ícones, estados ativos) · branco · cinza de texto `#A7A7A7`
- **Tipografia:** `--font-display` (Barlow Condensed, caixa alta) e `--font-body` (Inter); escala fluida `--fs-*`
- **Espaçamento:** `--space-1` a `--space-9`, `--section-y` para seções
- **Componentes:** `.section`, `.section-head`, `.eyebrow`, `.section-title`, `.btn--primary`, `.btn--outline`, `.link-arrow`, `.social`
- Animações discretas; tudo é desativado com `prefers-reduced-motion`

## Pendências (substituir antes do lançamento)

- **Logo oficial:** `assets/brand/logo-horizontal.svg` (header) e `assets/brand/logo-vertical.svg` (hero e footer) são **placeholders tipográficos**. Substitua pelos arquivos oficiais **com os mesmos nomes** (versão amarela para fundo preto).
- **Favicon/ícones** (`favicon.ico`, `assets/brand/favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`): provisórios, gerados a partir do raio da marca.
- **Domínio:** ativar `canonical` e `og:url` no `<head>` e apontar `og:image`/`twitter:image` para `https://DOMINIO/assets/img/og-image.jpg`.
- **Line-up:** "Banda 1…8" e fotos de banco de imagens em `js/data.js`.
- **Notícias:** conteúdos e links (`#`) provisórios em `js/data.js`.
- **Patrocinadores:** marcas herdadas do layout original, sem arquivos de logo — confirmar cada uma.
- **Redes sociais:** URLs ainda `#` em `js/data.js`.
- **Foto da cidade:** a seção "O Festival" usa uma foto genérica de praia; trocar por uma foto real da orla de Tramandaí.
- **Política de Privacidade / Termos de Uso:** links do footer ainda sem página.

## Rodando localmente

Qualquer servidor estático funciona:

```bash
python3 -m http.server 8000
# ou
npx serve .
```

Depois acesse `http://localhost:8000`.

## Deploy na Vercel

1. Suba este repositório para o GitHub.
2. Na Vercel, importe o repositório.
3. Framework Preset: **Other** (site estático).
4. Build Command: vazio. Output Directory: raiz (`.`).
5. Deploy.
