# Tchê Rock Tramandaí 2027

Site oficial (estático) do **Tchê Rock Tramandaí 2027** — "Aqui o rock gaúcho encontra o mar!".

Festival gratuito nos dias **08 e 09 de janeiro de 2027**, na Avenida Beira-Mar, ao lado do letreiro "Eu Amo Tramandaí", em **Tramandaí/RS**.

> Tramandaí é a cidade-sede do festival. O nome oficial do evento é **Tchê Rock Tramandaí**.

## Stack

- HTML5 + CSS3 + JavaScript vanilla (sem frameworks, sem build)
- Fontes (Google Fonts): **Anton** (títulos), **Barlow Condensed** (menu, rótulos, botões), **Inter** (textos), **Permanent Marker** (frases manuscritas)
- Ícones: sprite SVG inline no topo do `index.html` (`<use href="#i-nome">`)
- Mobile-first · breakpoints em 480, 768, 1024, 1280 e 1440px

## Estrutura da home

1. Header (logo · menu · redes sociais · CTA #TchêRock)
2. Hero (foto de palco, logo, frases manuscritas, card de data/local, "Evento gratuito")
3. Faixa de diferenciais
4. Sobre o festival
5. Programação 2027 (listas por dia + um carrossel único com todas as bandas, com autoplay)
6. Bloco "Tramandaí te espera!"
7. Blocos institucionais (Estrutura completa · Turismo · Sustentabilidade)
8. Contato (formulário → e-mail)
9. Footer com Realização

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
| Artistas por dia (nome, foto, enquadramento `pos`, horário opcional) | `js/data.js` → `programacao` |
| Realização (nome, logo) | `js/data.js` → `apoiadores` |
| Redes sociais (header, menu e footer) | `js/data.js` → `social` |
| Data/hora do contador ("Faltam X dias") | `js/data.js` → `evento.inicio` |

Fotos aceitam um arquivo local (ex.: `assets/img/artistas/nei-van-soria.jpg`, JPEG ~1200px de largura) ou URL do Unsplash. No carrossel todas aparecem em 4:3; se algum rosto ficar cortado, ajuste `pos` (`object-position`, ex.: `'50% 0%'` = topo). Sem foto, o slide mostra um fundo provisório.

Textos fixos (hero, diferenciais, Tramandaí, blocos institucionais, footer) e metadados de SEO ficam no `index.html`. Se a data ou o local mudarem, atualize também `<title>`/`description`, Open Graph, o JSON-LD (`MusicEvent`), o hero e o footer.

## Identidade (resumo)

Tokens em `css/style.css` (`:root`): preto `#0A0A0A` · grafites `#111111`/`#181818` · branco · vermelho `#E30613` (destaques, CTAs, selos de data) · cinza de texto `#B8B8B8`.

## Pendências (substituir antes do lançamento)

- **Logo oficial:** `assets/brand/tche-rock-logo.svg` é um **wordmark provisório** (header, hero e footer). Substitua pelo arquivo oficial **com o mesmo nome**.
- **Favicon/ícones** (`favicon.ico`, `assets/brand/favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`) e `og-image.jpg`: provisórios.
- **Horários dos shows:** campo `hora` em `js/data.js` (opcional, aparece no card).
- **Hero:** usar foto com o letreiro "Eu Amo Tramandaí" (arquivo ainda não recebido).
- **Formulário:** configurar `RESEND_API_KEY` (e `CONTACT_FROM`) na Vercel.
- **Fotos:** hero, Tramandaí e blocos institucionais usam banco de imagens; trocar por fotos reais do festival e da orla de Tramandaí.
- **Redes sociais:** URLs ainda `#` em `js/data.js`.
- **Domínio:** ativar `canonical`/`og:url` e ajustar `og:image`/`twitter:image` e o JSON-LD (hoje apontam para `tcherockfestival.vercel.app`).
- `assets/brand/logo-horizontal.svg` e `logo-vertical.svg` são placeholders da identidade anterior, mantidos no projeto mas não usados.

## Formulário de contato

`api/contato.js` é uma função serverless da Vercel que envia o e-mail pela API da Resend (sem dependências). Variáveis de ambiente na Vercel:

- `RESEND_API_KEY` (obrigatória) — sem ela o formulário mostra a mensagem de erro amigável.
- `CONTACT_TO` (opcional) — padrão `Daniel.gestorprodutora@gmail.com`.
- `CONTACT_FROM` (opcional) — remetente de domínio verificado na Resend. O padrão `onboarding@resend.dev` só entrega para o e-mail dono da conta Resend.

Localmente (`python3 -m http.server`) a rota `/api/contato` não existe; use `vercel dev` para testar o envio.

## Rodando localmente

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Deploy na Vercel

Site estático: Framework Preset **Other**, Build Command vazio, Output Directory raiz (`.`). Todo push na `main` publica em produção.
