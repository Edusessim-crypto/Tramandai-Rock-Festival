/* ============================================================
   TCHÊ ROCK FESTIVAL 2027 — DADOS DO SITE
   ------------------------------------------------------------
   Fonte única dos conteúdos dinâmicos da home:
   evento (contador), redes sociais, programação e apoiadores.

   Para atualizar o site, edite apenas este arquivo.
   Fotos: aceita URL do Unsplash (gera srcset automático)
   ou caminho local, ex.: 'assets/img/artistas/nome.jpg'.
   ============================================================ */

window.FESTIVAL = {

  /* ---------- Evento ---------- */
  evento: {
    nome: 'Tchê Rock Festival',
    edicao: 2027,
    // Contador regressivo do hero. PENDENTE: ajustar para o horário oficial do primeiro show.
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
  ],

  /* ---------- Programação ----------
     Line-up conforme o material oficial do Tchê Rock Festival.
     foto: caminho do arquivo, ex.: 'assets/img/artistas/nei-van-soria.jpg'.
           Sem foto, o card mostra um fundo provisório com o nome.
     hora: opcional — preencher quando os horários oficiais forem divulgados.
     PENDENTE: fotos oficiais de divulgação de cada artista. */
  programacao: [
    {
      id: 'sexta',
      dia: 'Sexta-feira',
      data: '2027-01-08',
      atracoes: [
        { nome: 'Eternos Cascavelhetes', foto: '', alt: '' },
        { nome: 'Alemão Ronaldo', foto: '', alt: '' },
        { nome: 'Duda Calvin da Tequila Baby', foto: '', alt: '' },
      ],
    },
    {
      id: 'sabado',
      dia: 'Sábado',
      data: '2027-01-09',
      atracoes: [
        // PENDENTE: confirmar a grafia oficial do nome da banda
        { nome: 'Velhavô', foto: '', alt: '' },
        { nome: 'Bixo Cabeludo', foto: '', alt: '' },
        { nome: 'Nei Van Soria', foto: '', alt: '' },
        { nome: 'Acústicos e Valvulados', foto: '', alt: '' },
      ],
    },
  ],

  /* ---------- Realização e apoio (rodapé) ----------
     logo: caminho do arquivo (ex.: 'assets/img/apoiadores/gestor.svg').
           Sem logo, o nome aparece em um espaço reservado.
     PENDENTE: arquivos de logo oficiais de cada marca. */
  apoiadores: [
    {
      categoria: 'Realização',
      marcas: [{ nome: 'Gestor Produtora', logo: '' }],
    },
    {
      categoria: 'Apoio',
      marcas: [
        { nome: 'Secretaria Municipal de Turismo', logo: '' },
        { nome: 'Tramandaí — Quem conhece ama', logo: '' },
      ],
    },
  ],
};
