/* ============================================================
   TCHÊ ROCK FESTIVAL 2027 — SCRIPTS
   Conteúdos dinâmicos vêm de js/data.js (window.FESTIVAL).
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const DADOS = window.FESTIVAL || {};
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Utilitários ---------- */
  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const $$ = (seletor, raiz = document) => Array.from(raiz.querySelectorAll(seletor));

  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const escapar = (texto) => String(texto ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

  const icone = (nome, classe = 'icon') =>
    `<svg class="${classe}" aria-hidden="true" focusable="false"><use href="#i-${nome}"></use></svg>`;

  const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

  // Imagens do Unsplash ganham srcset responsivo; caminhos locais são usados como estão.
  function atributosImagem(url, larguras, proporcao) {
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
    const itens = (DADOS.social || []).map((rede) => {
      const externo = rede.url && rede.url !== '#';
      const alvo = externo ? ' target="_blank" rel="noopener"' : '';
      return `<li><a href="${escapar(rede.url || '#')}"${alvo} aria-label="${escapar(rede.nome)}">${icone(rede.rede)}</a></li>`;
    }).join('');
    $$('[data-social]').forEach((lista) => { lista.innerHTML = itens; });
  }

  /* ---------- Programação (cards por dia) ---------- */
  function renderizarProgramacao() {
    const raiz = $('[data-programacao]');
    const dias = DADOS.programacao || [];
    if (!raiz || !dias.length) return;

    raiz.innerHTML = dias.map((dia) => {
      const [, mes, d] = dia.data.split('-');
      const cards = dia.atracoes.map((item) => {
        const midia = item.foto
          ? `<img ${atributosImagem(item.foto, [320, 480, 640], 3 / 4)} sizes="(min-width: 1024px) 14vw, 45vw"
              alt="${escapar(item.alt || item.nome)}" loading="lazy" decoding="async" width="480" height="640">`
          : `<span class="artist-card__placeholder" aria-hidden="true">${icone('guitar')}</span>`;
        const hora = item.hora
          ? `<time class="artist-card__time" datetime="${dia.data}T${escapar(item.hora)}-03:00">${escapar(item.hora)}</time>` : '';
        return `
          <li class="artist-card">
            <div class="artist-card__media">${midia}</div>
            <div class="artist-card__body">
              <h3 class="artist-card__name">${escapar(item.nome)}</h3>
              ${hora}
            </div>
          </li>`;
      }).join('');

      return `
        <article class="lineup__day" style="--cards:${dia.atracoes.length}" aria-labelledby="dia-${dia.id}">
          <header class="day-badge" id="dia-${dia.id}">
            <time class="day-badge__date" datetime="${dia.data}">
              <span class="day-badge__num">${d}</span>
              <span class="day-badge__month">${MESES[Number(mes) - 1]}</span>
            </time>
            <span class="day-badge__weekday">${escapar(dia.dia)}</span>
          </header>
          <ul class="lineup__cards">${cards}</ul>
        </article>`;
    }).join('');
  }

  /* ---------- Realização e apoio ---------- */
  function renderizarApoiadores() {
    const raiz = $('[data-apoiadores]');
    if (!raiz) return;
    raiz.innerHTML = (DADOS.apoiadores || []).map((grupo) => `
      <div class="partners">
        <p class="partners__label">${escapar(grupo.categoria)}:</p>
        <ul class="partners__logos">
          ${grupo.marcas.map((marca) => `<li class="partner">${marca.logo
            ? `<img src="${escapar(marca.logo)}" alt="${escapar(marca.nome)}" loading="lazy" decoding="async">`
            : `<span>${escapar(marca.nome)}</span>`}</li>`).join('')}
        </ul>
      </div>`).join('');
  }

  /* ============================================================
     2. CONTADOR (linha compacta no card de data do hero)
     ============================================================ */
  function iniciarContador() {
    const alvo = $('[data-countdown]');
    if (!alvo) return;
    const inicio = Date.parse(DADOS.evento?.inicio);
    const fim = Date.parse(DADOS.evento?.fim);
    if (Number.isNaN(inicio)) return;

    function atualizar() {
      const agora = Date.now();
      const restante = inicio - agora;
      // Nunca exibe valores negativos: troca para "é agora"/"encerrado"
      if (restante <= 0) {
        const encerrado = !Number.isNaN(fim) && agora >= fim;
        alvo.textContent = encerrado ? 'Obrigado, Tramandaí!' : 'É agora! O festival está acontecendo.';
        return;
      }
      const dias = Math.floor(restante / 86400000);
      alvo.innerHTML = dias >= 1
        ? `Faltam <strong>${dias}</strong> ${dias === 1 ? 'dia' : 'dias'}`
        : 'É <strong>hoje!</strong>';
    }

    alvo.hidden = false;
    atualizar();
    setInterval(atualizar, 60000);
  }

  /* ============================================================
     3. MENU MOBILE
     ============================================================ */
  function iniciarMenu() {
    const botao = $('[data-menu-toggle]');
    const menu = $('#site-nav');
    if (!botao || !menu) return;
    const rotulo = $('[data-menu-label]', botao);
    const desktop = window.matchMedia('(min-width: 1024px)');

    function definir(aberto) {
      document.body.classList.toggle('is-menu-open', aberto);
      botao.setAttribute('aria-expanded', String(aberto));
      rotulo.textContent = aberto ? 'Fechar menu' : 'Abrir menu';
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
      .filter(Boolean);

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
    const elementos = $$('.artist-card, .pillar, .features__item');
    if (semMovimento.matches || !('IntersectionObserver' in window)) return;
    elementos.forEach((el) => el.classList.add('reveal'));
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('is-visible');
        observador.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });
    elementos.forEach((el) => observador.observe(el));
  }

  /* ---------- Inicialização ---------- */
  renderizarSocial();
  renderizarProgramacao();
  renderizarApoiadores();
  iniciarContador();
  iniciarMenu();
  iniciarHeader();
  iniciarMenuAtivo();
  iniciarRevelar();
  $$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });

});
