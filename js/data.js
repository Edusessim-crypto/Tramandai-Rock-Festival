/* ============================================================
   TCHÊ ROCK TRAMANDAÍ 2027 — DADOS DO SITE
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
    nome: 'Tchê Rock Tramandaí',
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
     Line-up conforme o material oficial do Tchê Rock Tramandaí.
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
        { nome: 'Diego Lopes e os Dínamos', foto: 'assets/img/artistas/diego-lopes-e-os-dinamos.jpg', alt: 'Diego Lopes e os Dínamos, os quatro integrantes sorrindo diante de uma parede de tijolos', pos: '50% 10%' },
        { nome: 'Alemão Ronaldo', foto: 'assets/img/artistas/alemao-ronaldo.jpg', alt: 'Alemão Ronaldo, de óculos escuros e jaqueta preta, sentado, em retrato em preto e branco', pos: '50% 5%' },
        { nome: 'Eternos Cascavelletes', foto: 'assets/img/artistas/eternos-cascavelletes.jpg', alt: 'Os cinco integrantes dos Eternos Cascavelletes, de roupas escuras, diante de um portão de galpão', pos: '50% 50%' },
      ],
    },
    {
      id: 'sabado',
      dia: 'Sábado',
      data: '2027-01-09',
      atracoes: [
        { nome: 'Velhavó', foto: 'assets/img/artistas/velhavo.jpg', alt: 'Os cinco integrantes da Velhavó no palco, diante do telão com o logo da banda', pos: '50% 25%' },
        { nome: 'Bixo Cabeludo', foto: 'assets/img/artistas/bixo-cabeludo.jpg', alt: 'Os três integrantes do Bixo Cabeludo diante de uma cortina vermelha', pos: '50% 20%' },
        { nome: 'Neivan Soria', foto: 'assets/img/artistas/neivan-soria.jpg', alt: 'Neivan Soria, de óculos escuros, em retrato em preto e branco', pos: '50% 60%' },
        { nome: 'Acústicos & Valvulados', foto: 'assets/img/artistas/acusticos-e-valvulados.jpg', alt: 'Integrantes dos Acústicos & Valvulados, em grupo, ao pôr do sol', pos: '50% 50%' },
      ],
    },
  ],

  /* ---------- Realização (rodapé) ----------
     logo: caminho do arquivo (ex.: 'assets/img/apoiadores/gestor.svg').
           Sem logo, o nome aparece em um espaço reservado.
     Ordem: Gestor Produtora · Secretaria Municipal de Turismo · Prefeitura. */
  apoiadores: [
    {
      categoria: 'Realização',
      marcas: [
        { nome: 'Gestor Produtora', logo: 'assets/img/apoiadores/gestor-produtora.png' },
        { nome: 'Secretaria Municipal de Turismo', logo: 'assets/img/apoiadores/secretaria-turismo.jpg' },
        { nome: 'Prefeitura de Tramandaí', logo: 'assets/img/apoiadores/prefeitura-tramandai.png' },
      ],
    },
  ],
};
