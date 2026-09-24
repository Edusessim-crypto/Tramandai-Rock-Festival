# Tchê Rock Festival 2027

Site oficial (estático) do **Tchê Rock Festival 2027** — "Aqui o rock encontra o mar!".

Festival gratuito nos dias **08 e 09 de janeiro de 2027**, na Avenida Beira-Mar, ao lado do letreiro "Eu Amo Tramandaí", em **Tramandaí/RS**.

> Tramandaí é a cidade-sede do festival. O nome oficial do evento é **Tchê Rock Festival**.

## Stack

- HTML5 + CSS3 + JavaScript vanilla (sem frameworks, sem build)
- Fontes (Google Fonts): **Anton** (títulos), **Barlow Condensed** (menu, rótulos, botões), **Inter** (textos), **Permanent Marker** (frases manuscritas)
- Ícones: sprite SVG inline no topo do `index.html` (`<use href="#i-nome">`)
- Mobile-first · breakpoints em 480, 768, 1024, 1280 e 1440px

## Estrutura da home

1. Header (logo · menu · redes sociais · CTA #TchêRock)
2. Hero (foto de palco, logo, frases manuscritas, card de data/local, "Evento gratuito")
3. Faixa de diferenciais
4. Programação 2027 (cards de artistas divididos por dia)
5. Bloco "Tramandaí te espera!"
6. Blocos institucionais (Estrutura completa · Turismo · Sustentabilidade)
7. Realização e apoio
8. Footer

```
/
├── index.html              ← página única (home com âncoras)
├── site.webmanifest
├── favicon.ico
├── css/style.css           ← design tokens no :root + componentes
├── js/
│   ├── data.js             ← CONTEÚDO: programação, apoiadores, redes, data do evento
│   └── main.js             ← renderização + contador, menu, animações
└── assets/
    ├── brand/              ← logo (PROVISÓRIA), favicon e ícones
    └── img/og-image.jpg    ← arte de compartilhamento (1200×630)
```

## Como editar o conteúdo

| O quê | Onde |
|---|---|
| Artistas por dia (nome, foto, horário opcional) | `js/data.js` → `programacao` |
| Realização e apoio (nome, logo) | `js/data.js` → `apoiadores` |
| Redes sociais (header, menu e footer) | `js/data.js` → `social` |
| Data/hora do contador ("Faltam X dias") | `js/data.js` → `evento.inicio` |

Fotos aceitam um arquivo local (ex.: `assets/img/artistas/nei-van-soria.jpg`) ou URL do Unsplash. Sem foto, o card do artista mostra um fundo provisório.

Textos fixos (hero, diferenciais, Tramandaí, blocos institucionais, footer) e metadados de SEO ficam no `index.html`. Se a data ou o local mudarem, atualize também `<title>`/`description`, Open Graph, o JSON-LD (`MusicEvent`), o hero e o footer.

## Identidade (resumo)

Tokens em `css/style.css` (`:root`): preto `#0A0A0A` · grafites `#111111`/`#181818` · branco · vermelho `#E30613` (destaques, CTAs, selos de data) · cinza de texto `#B8B8B8`.

## Pendências (substituir antes do lançamento)

- **Logo oficial:** `assets/brand/tche-rock-logo.svg` é um **wordmark provisório** (header, hero e footer). Substitua pelo arquivo oficial **com o mesmo nome**.
- **Favicon/ícones** (`favicon.ico`, `assets/brand/favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`) e `og-image.jpg`: provisórios.
- **Fotos dos artistas:** preencher `foto` de cada atração em `js/data.js`.
- **Grafia de "Velhavô":** confirmar o nome oficial da banda.
- **Horários dos shows:** campo `hora` em `js/data.js` (opcional, aparece no card).
- **Logos de realização/apoio:** Gestor Produtora, Secretaria Municipal de Turismo, "Tramandaí — Quem conhece ama".
- **Fotos:** hero, Tramandaí e blocos institucionais usam banco de imagens; trocar por fotos reais do festival e da orla de Tramandaí.
- **Redes sociais:** URLs ainda `#` em `js/data.js`.
- **Domínio:** ativar `canonical`/`og:url` e ajustar `og:image`/`twitter:image` e o JSON-LD (hoje apontam para `tcherockfestival.vercel.app`).
- `assets/brand/logo-horizontal.svg` e `logo-vertical.svg` são placeholders da identidade anterior, mantidos no projeto mas não usados.

## Rodando localmente

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Deploy na Vercel

Site estático: Framework Preset **Other**, Build Command vazio, Output Directory raiz (`.`). Todo push na `main` publica em produção.
