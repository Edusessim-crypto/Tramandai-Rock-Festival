/* ============================================================
   TRAMANDAÍ ROCK FESTIVAL 2027 — DADOS DO SITE
   ------------------------------------------------------------
   Fonte única dos conteúdos dinâmicos da home:
   evento (contador), redes sociais, programação, atrações,
   notícias e patrocinadores.

   Para atualizar o site, edite apenas este arquivo.
   Fotos: aceita URL do Unsplash (gera srcset automático)
   ou caminho local, ex.: 'assets/img/artistas/nome.jpg'.
   ============================================================ */

window.FESTIVAL = {

  /* ---------- Evento ---------- */
  evento: {
    nome: 'Tramandaí Rock Festival',
    edicao: 2027,
    // Início do primeiro horário da programação (contador regressivo)
    inicio: '2027-01-08T17:30:00-03:00',
    // Usado só para trocar a mensagem do contador depois do festival
    fim: '2027-01-10T06:00:00-03:00',
  },

  /* ---------- Redes sociais ----------
     rede: instagram | facebook | youtube | tiktok | whatsapp
     PENDENTE: preencher as URLs oficiais (hoje estão como '#'). */
  social: [
    { rede: 'instagram', nome: 'Instagram', url: '#' },
    { rede: 'facebook', nome: 'Facebook', url: '#' },
    { rede: 'youtube', nome: 'YouTube', url: '#' },
    { rede: 'tiktok', nome: 'TikTok', url: '#' },
    { rede: 'whatsapp', nome: 'WhatsApp', url: '#' },
  ],

  /* ---------- Programação ----------
     tipo 'show' → aparece também em "Atrações confirmadas".
     tipo 'dj'   → aparece só na programação.
     PENDENTE: nomes "Banda 1…8" são provisórios até a confirmação do line-up. */
  programacao: [
    {
      id: 'sexta',
      dia: 'Sexta',
      data: '2027-01-08',
      atracoes: [
        { hora: '17:30', nome: 'DJ de Abertura', tipo: 'dj' },
        {
          hora: '18:00', nome: 'Banda 1', tipo: 'show',
          foto: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
          alt: 'Público com as mãos para o alto diante de palco iluminado em tons de rosa e azul',
        },
        { hora: '19:30', nome: 'DJ', tipo: 'dj' },
        {
          hora: '19:50', nome: 'Banda 2', tipo: 'show',
          foto: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
          alt: 'Microfone clássico em primeiro plano com luzes de palco desfocadas ao fundo',
        },
        { hora: '21:20', nome: 'DJ', tipo: 'dj' },
        {
          hora: '21:40', nome: 'Banda 3', tipo: 'show',
          foto: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
          alt: 'Multidão em frente ao palco com luzes alaranjadas durante show',
        },
        { hora: '23:10', nome: 'DJ', tipo: 'dj' },
        {
          hora: '23:30', nome: 'Banda 4', tipo: 'show',
          foto: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
          alt: 'Artista com o braço erguido em meio à fumaça do palco',
        },
      ],
    },
    {
      id: 'sabado',
      dia: 'Sábado',
      data: '2027-01-09',
      atracoes: [
        { hora: '17:30', nome: 'DJ de Abertura', tipo: 'dj' },
        {
          hora: '18:00', nome: 'Banda 5', tipo: 'show',
          foto: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b',
          alt: 'Público diante de palco com luzes douradas e fumaça',
        },
        { hora: '19:30', nome: 'DJ', tipo: 'dj' },
        {
          hora: '19:50', nome: 'Banda 6', tipo: 'show',
          foto: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14',
          alt: 'Plateia com as mãos para cima sob luzes de palco em tons de lilás',
        },
        { hora: '21:20', nome: 'DJ', tipo: 'dj' },
        {
          hora: '21:40', nome: 'Banda 7', tipo: 'show',
          foto: 'https://images.unsplash.com/photo-1478147427282-58a87a120781',
          alt: 'Mãos do público iluminadas por um feixe de luz no escuro',
        },
        { hora: '23:10', nome: 'DJ', tipo: 'dj' },
        {
          hora: '23:30', nome: 'Banda 8', tipo: 'show',
          foto: 'https://images.unsplash.com/photo-1506157786151-b8491531f063',
          alt: 'Grande público em festival com palco iluminado em roxo ao fundo',
        },
      ],
    },
  ],

  /* ---------- Notícias ----------
     data no formato AAAA-MM-DD (a lista é ordenada da mais recente para a mais antiga).
     PENDENTE: conteúdos e links provisórios do layout original (links ainda em '#'). */
  noticias: [
    {
      data: '2026-03-13',
      titulo: 'Programação Oficial Confirmada!',
      link: '#',
      imagem: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec',
      alt: 'Público fazendo coração com as mãos em frente ao palco',
    },
    {
      data: '2026-12-05',
      titulo: 'Plano de Mobilidade e Acessos',
      link: '#',
      imagem: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
      alt: 'Avenida movimentada com carros e pedestres entre prédios',
    },
    {
      data: '2026-12-01',
      titulo: 'Patrocinadores Confirmados',
      link: '#',
      imagem: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
      alt: 'Aperto de mãos entre duas pessoas em reunião de negócios',
    },
  ],

  /* ---------- Patrocinadores e apoiadores ----------
     destaque: true → categoria exibida em linha própria, com espaço maior.
     logo: caminho do arquivo (ex.: 'assets/img/patrocinadores/banrisul.svg').
           Sem logo, o nome aparece em um espaço reservado.
     PENDENTE: marcas herdadas do layout original, sem arquivos de logo —
     confirmar cada uma com a organização antes de publicar. */
  patrocinadores: [
    {
      categoria: 'Realização',
      destaque: true,
      marcas: [
        { nome: 'Prefeitura de Tramandaí', logo: '' },
        { nome: 'Secretaria de Turismo e Cultura', logo: '' },
      ],
    },
    {
      categoria: 'Apresenta',
      destaque: true,
      marcas: [
        // Espaço reservado do layout original — substituir pela marca ou remover
        { nome: 'Sua marca aqui', logo: '', reservado: true },
      ],
    },
    {
      categoria: 'Patrocínio Master',
      destaque: true,
      marcas: [
        { nome: 'Governo Federal', logo: '' },
        { nome: 'Banrisul', logo: '' },
      ],
    },
    { categoria: 'Ouro', marcas: [{ nome: 'Corsan', logo: '' }] },
    {
      categoria: 'Prata',
      marcas: [
        { nome: 'Sicredi', logo: '' },
        { nome: 'Coca-Cola', logo: '' },
      ],
    },
    {
      categoria: 'Bronze',
      marcas: [
        { nome: 'Red Bull', logo: '' },
        { nome: 'Vero', logo: '' },
      ],
    },
    { categoria: 'Apoio Institucional', marcas: [{ nome: 'São João', logo: '' }] },
    {
      categoria: 'Apoio Cultural',
      marcas: [
        { nome: 'Randon Corp', logo: '' },
        { nome: 'SEBRAE', logo: '' },
        { nome: 'Fecomércio RS', logo: '' },
      ],
    },
    {
      categoria: 'Parceiros de Mídia',
      marcas: [
        { nome: 'Rádio Atlântida', logo: '' },
        { nome: 'GZH', logo: '' },
        { nome: 'ABC+', logo: '' },
      ],
    },
  ],
};
