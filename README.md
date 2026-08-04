# Tramandaí Rock Festival 2027

Site oficial (estático) do **Tramandaí Rock Festival 2027** — "O Rock Encontra o Verão".

Festival gratuito de rock nos dias **08 e 09 de janeiro de 2027**, na Avenida Beira-Mar, ao lado do letreiro "Eu Amo Tramandaí", em Tramandaí/RS.

## Stack

- HTML5 + CSS3 + JavaScript vanilla (sem frameworks)
- Fontes: Google Fonts (Montserrat + Inter)
- Ícones: SVG inline
- 100% responsivo (mobile-first, breakpoints em 768px e 1024px)

## Estrutura

```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── README.md
```

## Rodando localmente

Qualquer servidor estático funciona. Exemplos:

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Depois acesse `http://localhost:8000`.

## Deploy na Vercel

1. Suba este repositório para o GitHub.
2. Na Vercel, importe o repositório.
3. Framework Preset: **Other** (site estático).
4. Build Command: vazio. Output Directory: raiz (`.`).
5. Deploy.

## Observações

- As bandas estão nomeadas como "Banda 1", "Banda 2" etc. — são placeholders até a confirmação oficial do line-up.
- Todas as imagens usam [placehold.co](https://placehold.co) como placeholder; basta substituir pelas artes finais.
- O logo é um componente HTML/CSS puro. Ao receber o arquivo `.svg` ou `.png` oficial, basta substituir os blocos `.logo` por uma tag `<img>`.
