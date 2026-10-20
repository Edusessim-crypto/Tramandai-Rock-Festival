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
     detalhe: opcional — linha menor abaixo do nome (ex.: bandas de origem dos músicos).
     pos: enquadramento da foto no carrossel (object-position), ex.: '50% 0%' = topo.
          As fotos aparecem em 4:3; ajuste se algum rosto ficar cortado.
     hora: opcional — preencher quando os horários oficiais forem divulgados.
     PENDENTE: fotos oficiais de divulgação de cada artista. */
  programacao: [
    {
      id: 'sexta',
      dia: 'Sexta-feira',
      data: '2027-01-08',
      atracoes: [
        { nome: 'Diego Lopes e os Dínamos', foto: 'assets/img/artistas/diego-lopes-e-os-dinamos.jpg', alt: 'Diego Lopes e os Dínamos, os quatro integrantes sorrindo diante de uma parede de tijolos', pos: '50% 0%' },
        { nome: 'Alemão Ronaldo', foto: 'assets/img/artistas/alemao-ronaldo.jpg', alt: 'Alemão Ronaldo, de óculos escuros e jaqueta preta, sentado, em retrato em preto e branco', pos: '50% 5%' },
        { nome: 'Eternos Cascavelletes', foto: 'assets/img/artistas/eternos-cascavelletes.jpg', alt: 'Os cinco integrantes dos Eternos Cascavelletes entre as portas abertas de um galpão, com o céu nublado ao fundo', pos: '50% 50%' },
        { nome: 'Jacques Maciel & Sady Homrich', detalhe: 'Rosa Tattooada · Nenhum de Nós', foto: 'assets/img/artistas/jacques-maciel-e-sady-homrich.jpg', alt: 'Três músicos, entre eles Jacques Maciel e Sady Homrich, fazendo pose diante de uma parede de guitarras', pos: '50% 20%' },
      ],
    },
    {
      id: 'sabado',
      dia: 'Sábado',
      data: '2027-01-09',
      atracoes: [
        { nome: 'Velhavó', foto: 'assets/img/artistas/velhavo.jpg', alt: 'Os cinco integrantes da Velhavó, de roupas pretas, diante do logo da banda em fundo preto', pos: '50% 0%' },
        { nome: 'Bixo Cabeludo', foto: 'assets/img/artistas/bixo-cabeludo.jpg', alt: 'Os três integrantes do Bixo Cabeludo diante de uma cortina vermelha', pos: '50% 20%' },
        { nome: 'Neivan Soria', foto: 'assets/img/artistas/neivan-soria.jpg', alt: 'Neivan Soria, de óculos escuros, em retrato em preto e branco', pos: '50% 60%' },
        { nome: 'Acústicos & Valvulados', foto: 'assets/img/artistas/acusticos-e-valvulados.jpg', alt: 'Integrantes dos Acústicos & Valvulados, em grupo, ao pôr do sol', pos: '50% 50%' },
      ],
    },
  ],

  /* ---------- Realização (seção abaixo do hero + rodapé) ----------
     logo: caminho do arquivo (ex.: 'assets/img/apoiadores/gestor.svg').
           Sem logo, o nome aparece em um espaço reservado.
     Ordem: Gestor Produtora · Secretaria Municipal de Turismo · Prefeitura.
     A mesma lista alimenta a seção Realização logo abaixo do hero;
     destaque: true = logo maior, no centro (Prefeitura de Tramandaí).
     logoClaro: versão para a seção Realização, que tem fundo branco
                (logos com texto branco ganham uma cópia com o texto escuro). */
  apoiadores: [
    {
      categoria: 'Realização',
      marcas: [
        { nome: 'Gestor Produtora', logo: 'assets/img/apoiadores/gestor-produtora.png', logoClaro: 'assets/img/apoiadores/gestor-produtora-escuro.png' },
        { nome: 'Secretaria Municipal de Turismo', logo: 'assets/img/apoiadores/secretaria-turismo.jpg', logoClaro: 'assets/img/apoiadores/secretaria-turismo-recorte.png' },
        { nome: 'Prefeitura de Tramandaí', logo: 'assets/img/apoiadores/prefeitura-tramandai.png', logoClaro: 'assets/img/apoiadores/prefeitura-tramandai-escuro.png', destaque: true },
      ],
    },
  ],
};
