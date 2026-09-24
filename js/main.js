/* ============================================================
   TRAMANDAÍ ROCK FESTIVAL 2027 — SCRIPTS
   Conteúdos dinâmicos vêm de js/data.js (window.FESTIVAL).
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const DADOS = window.FESTIVAL || {};
  const FUSO = 'America/Sao_Paulo';
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Utilitários ---------- */
  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const $$ = (seletor, raiz = document) => Array.from(raiz.querySelectorAll(seletor));

  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const escapar = (texto) => String(texto ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

  const icone = (nome, classe = 'icon') =>
    `<svg class="${classe}" aria-hidden="true" focusable="false"><use href="#i-${nome}"></use></svg>`;

  // 'AAAA-MM-DD' → Date ao meio-dia de Brasília (evita virar o dia por fuso)
  const dataLocal = (iso) => new Date(`${iso}T12:00:00-03:00`);
  const hojeISO = () => new Date().toLocaleDateString('sv-SE', { timeZone: FUSO });
  const dataCurta = (iso) => { const [, m, d] = iso.split('-'); return `${d}/${m}`; };
  const dataCompleta = (iso) => { const [a, m, d] = iso.split('-'); return `${d}/${m}/${a}`; };
  const dataPorExtenso = (iso) => {
    const texto = dataLocal(iso).toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: FUSO,
    });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  // Imagens do Unsplash ganham srcset responsivo; caminhos locais são usados como estão.
  function atributosImagem(url, larguras, proporcao) {
    if (!url) return '';
    if (!/images\.unsplash\.com/.test(url)) return `src="${escapar(url)}"`;
    const base = url.split('?')[0];
    const montar = (w) => `${base}?auto=format&fit=crop&w=${w}&h=${Math.round(w / proporcao)}&q=70`;
    const srcset = larguras.map((w) => `${montar(w)} ${w}w`).join(', ');
    return `src="${montar(larguras[1] || larguras[0])}" srcset="${srcset}"`;
  }

  /* ============================================================
     1. RENDERIZAÇÃO DOS CONTEÚDOS
     ============================================================ */

  /* ---------- Redes sociais ---------- */
  function renderizarSocial() {
    const redes = DADOS.social || [];
    const itens = redes.map((rede) => {
      const externo = rede.url && rede.url !== '#';
      const alvo = externo ? ' target="_blank" rel="noopener"' : '';
      return `<li><a href="${escapar(rede.url || '#')}"${alvo} aria-label="${escapar(rede.nome)}">${icone(rede.rede)}</a></li>`;
    }).join('');
    $$('[data-social]').forEach((lista) => { lista.innerHTML = itens; });
  }

  /* ---------- Programação ---------- */
  function renderizarProgramacao() {
    const dias = DADOS.programacao || [];
    const abas = $('[data-tabs]');
    const paineis = $('[data-programacao]');
    if (!abas || !paineis || !dias.length) return;

    // No segundo dia do festival, a aba de sábado abre selecionada
    const ativo = Math.max(0, dias.findIndex((dia) => dia.data === hojeISO()));

    abas.innerHTML = dias.map((dia, i) => `
      <button class="tabs__tab" type="button" role="tab" id="aba-${dia.id}"
        aria-controls="painel-${dia.id}" aria-selected="${i === ativo}" tabindex="${i === ativo ? 0 : -1}">
        <span class="tabs__day">${escapar(dia.dia)}</span>
        <span class="tabs__date">${dataCurta(dia.data)}</span>
      </button>`).join('');

    paineis.innerHTML = dias.map((dia, i) => `
      <div class="agenda" role="tabpanel" id="painel-${dia.id}" aria-labelledby="aba-${dia.id}" tabindex="0"${i === ativo ? '' : ' hidden'}>
        <p class="agenda__day">${escapar(dataPorExtenso(dia.data))}</p>
        <ol class="agenda__list">
          ${dia.atracoes.map((item) => {
            const show = item.tipo === 'show';
            return `
            <li class="agenda__item agenda__item--${show ? 'show' : 'dj'}">
              <time class="agenda__time" datetime="${dia.data}T${item.hora}-03:00">${escapar(item.hora)}</time>
              <span class="agenda__name">${show ? '' : icone('headphones')}${escapar(item.nome)}</span>
              ${show ? '<span class="agenda__tag">Show</span>' : ''}
            </li>`;
          }).join('')}
        </ol>
      </div>`).join('');

    iniciarAbas(abas);
  }

  function iniciarAbas(lista) {
    const abas = $$('[role="tab"]', lista);

    function selecionar(aba, focar) {
      abas.forEach((outra) => {
        const ativa = outra === aba;
        outra.setAttribute('aria-selected', String(ativa));
        outra.tabIndex = ativa ? 0 : -1;
        document.getElementById(outra.getAttribute('aria-controls')).hidden = !ativa;
      });
      if (focar) aba.focus();
    }

    abas.forEach((aba, i) => {
      aba.addEventListener('click', () => selecionar(aba, false));
      aba.addEventListener('keydown', (evento) => {
        const mapa = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: abas.length - 1 };
        if (!(evento.key in mapa)) return;
        evento.preventDefault();
        selecionar(abas[(mapa[evento.key] + abas.length) % abas.length], true);
      });
    });
  }

  /* ---------- Atrações (derivadas da programação) ---------- */
  function renderizarAtracoes() {
    const lista = $('[data-atracoes]');
    if (!lista) return;
    const atracoes = (DADOS.programacao || []).flatMap((dia) =>
      dia.atracoes.filter((item) => item.tipo === 'show').map((item) => ({ ...item, dia })));

    lista.innerHTML = atracoes.map((item, i) => `
      <li class="artist-card" data-reveal style="--delay:${(i % 4) * 80}ms">
        <div class="artist-card__media">
          <img ${atributosImagem(item.foto, [320, 480, 640, 800], 4 / 5)}
            sizes="(min-width: 1024px) 25vw, 50vw" alt="${escapar(item.alt || '')}"
            loading="lazy" decoding="async" width="640" height="800">
        </div>
        <div class="artist-card__body">
          <h3 class="artist-card__name">${escapar(item.nome)}</h3>
          <p class="artist-card__meta">
            ${escapar(item.dia.dia)} ${dataCurta(item.dia.data)}
            <span aria-hidden="true">•</span>
            <time datetime="${item.dia.data}T${item.hora}-03:00">${escapar(item.hora)}</time>
          </p>
        </div>
      </li>`).join('');
  }

  /* ---------- Notícias ---------- */
  function renderizarNoticias() {
    const lista = $('[data-noticias]');
    if (!lista) return;
    const noticias = [...(DADOS.noticias || [])].sort((a, b) => b.data.localeCompare(a.data));

    lista.innerHTML = noticias.map((noticia, i) => `
      <li class="news-card" data-reveal style="--delay:${i * 80}ms">
        <div class="news-card__media">
          <img ${atributosImagem(noticia.imagem, [400, 640, 800], 16 / 10)}
            sizes="(min-width: 768px) 33vw, 100vw" alt="${escapar(noticia.alt || '')}"
            loading="lazy" decoding="async" width="640" height="400">
        </div>
        <time class="news-card__date" datetime="${noticia.data}">${dataCompleta(noticia.data)}</time>
        <h3 class="news-card__title"><a href="${escapar(noticia.link || '#')}">${escapar(noticia.titulo)}</a></h3>
        <span class="news-card__more" aria-hidden="true">Leia mais ${icone('arrow')}</span>
      </li>`).join('');
  }

  /* ---------- Patrocinadores ---------- */
  function renderizarPatrocinadores() {
    const principais = $('[data-patrocinio-destaque]');
    const demais = $('[data-patrocinio]');
    if (!principais || !demais) return;

    const marca = (item) => {
      const classes = `sponsor${item.reservado ? ' sponsor--reserved' : ''}`;
      const conteudo = item.logo
        ? `<img src="${escapar(item.logo)}" alt="${escapar(item.nome)}" loading="lazy" decoding="async">`
        : `<span>${escapar(item.nome)}</span>`;
      return `<li class="${classes}">${conteudo}</li>`;
    };

    const categoria = (grupo) => `
      <div class="sponsor-tier" data-reveal>
        <h3 class="sponsor-tier__label">${escapar(grupo.categoria)}</h3>
        <ul class="sponsor-tier__logos">${grupo.marcas.map(marca).join('')}</ul>
      </div>`;

    const grupos = DADOS.patrocinadores || [];
    principais.innerHTML = grupos.filter((g) => g.destaque).map(categoria).join('');
    demais.innerHTML = grupos.filter((g) => !g.destaque).map(categoria).join('');
  }

  /* ============================================================
     2. CONTADOR REGRESSIVO
     ============================================================ */
  function iniciarContador() {
    const raiz = $('[data-countdown]');
    if (!raiz) return;

    const inicio = Date.parse(DADOS.evento?.inicio);
    const fim = Date.parse(DADOS.evento?.fim);
    if (Number.isNaN(inicio)) { raiz.hidden = true; return; }

    const campos = {
      dias: $('[data-unit="dias"]', raiz),
      horas: $('[data-unit="horas"]', raiz),
      minutos: $('[data-unit="minutos"]', raiz),
      segundos: $('[data-unit="segundos"]', raiz),
    };
    const rotulo = $('[data-countdown-label]', raiz);
    const grade = $('[data-countdown-grid]', raiz);
    const status = $('[data-countdown-status]', raiz);
    const doisDigitos = (n) => String(n).padStart(2, '0');
    let intervalo;
    let ultimoMinuto = -1;

    function atualizar() {
      const agora = Date.now();
      const restante = inicio - agora;

      // Nunca exibe valores negativos: troca para a mensagem de "acontecendo"/"encerrado"
      if (restante <= 0) {
        clearInterval(intervalo);
        const encerrado = !Number.isNaN(fim) && agora >= fim;
        rotulo.textContent = encerrado ? 'Obrigado, Tramandaí!' : 'É agora!';
        status.textContent = encerrado
          ? 'Nos vemos na próxima edição.'
          : 'O festival está acontecendo na Avenida Beira-Mar.';
        grade.hidden = true;
        status.hidden = false;
        return;
      }

      const total = Math.floor(restante / 1000);
      const dias = Math.floor(total / 86400);
      const horas = Math.floor((total % 86400) / 3600);
      const minutos = Math.floor((total % 3600) / 60);
      const segundos = total % 60;

      campos.dias.textContent = doisDigitos(dias);
      campos.horas.textContent = doisDigitos(horas);
      campos.minutos.textContent = doisDigitos(minutos);
      campos.segundos.textContent = doisDigitos(segundos);

      // Texto para leitores de tela atualizado no máximo uma vez por minuto
      if (minutos !== ultimoMinuto) {
        ultimoMinuto = minutos;
        grade.setAttribute('aria-label',
          `Faltam ${dias} dias, ${horas} horas e ${minutos} minutos para o festival`);
      }
    }

    atualizar();
    intervalo = setInterval(atualizar, 1000);
  }

  /* ============================================================
     3. MENU MOBILE
     ============================================================ */
  function iniciarMenu() {
    const botao = $('[data-menu-toggle]');
    const menu = $('#site-nav');
    if (!botao || !menu) return;
    const rotulo = $('.menu-toggle__label', botao);
    const desktop = window.matchMedia('(min-width: 1280px)');

    function definir(aberto) {
      document.body.classList.toggle('is-menu-open', aberto);
      botao.setAttribute('aria-expanded', String(aberto));
      rotulo.textContent = aberto ? 'Fechar' : 'Menu';
    }

    botao.addEventListener('click', () => {
      const abrir = botao.getAttribute('aria-expanded') !== 'true';
      definir(abrir);
      if (abrir) $('a', menu)?.focus();
    });

    menu.addEventListener('click', (evento) => {
      if (evento.target.closest('a')) definir(false);
    });

    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
        definir(false);
        botao.focus();
      }
    });

    desktop.addEventListener('change', (evento) => { if (evento.matches) definir(false); });
  }

  /* ============================================================
     4. HEADER AO ROLAR
     ============================================================ */
  function iniciarHeader() {
    const header = $('[data-header]');
    if (!header) return;
    let agendado = false;

    const verificar = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      agendado = false;
    };

    verificar();
    window.addEventListener('scroll', () => {
      if (!agendado) { agendado = true; requestAnimationFrame(verificar); }
    }, { passive: true });
  }

  /* ============================================================
     5. MENU ATIVO CONFORME A SEÇÃO VISÍVEL
     ============================================================ */
  function iniciarMenuAtivo() {
    if (!('IntersectionObserver' in window)) return;
    const links = $$('#site-nav a[href^="#"]');
    const secoes = links
      .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
      .filter((secao) => secao && secao.matches('section, footer'));

    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        const id = entrada.target.id;
        links.forEach((link) => {
          const ativo = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('is-active', ativo);
          if (ativo) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    secoes.forEach((secao) => observador.observe(secao));
  }

  /* ============================================================
     6. ANIMAÇÕES DE ENTRADA (respeitam prefers-reduced-motion)
     ============================================================ */
  function iniciarRevelar() {
    const elementos = $$('[data-reveal]');
    if (semMovimento.matches || !('IntersectionObserver' in window)) {
      elementos.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('is-visible');
        observador.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    elementos.forEach((el) => observador.observe(el));
  }

  /* ---------- Inicialização ---------- */
  renderizarSocial();
  renderizarProgramacao();
  renderizarAtracoes();
  renderizarNoticias();
  renderizarPatrocinadores();
  iniciarContador();
  iniciarMenu();
  iniciarHeader();
  iniciarMenuAtivo();
  iniciarRevelar();

});
