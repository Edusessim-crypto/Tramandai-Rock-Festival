/* ============================================================
   TCHÊ ROCK TRAMANDAÍ 2027 — SCRIPTS
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

  /* ---------- Programação (um bloco por dia: selo + carrossel com as bandas do dia) ---------- */
  function renderizarProgramacao() {
    const raiz = $('[data-programacao]');
    const dias = DADOS.programacao || [];
    if (!raiz || !dias.length) return;

    raiz.innerHTML = dias.map((dia) => {
      const [, mes, d] = dia.data.split('-');
      const selo = `${d} ${MESES[Number(mes) - 1]}`;
      const legendaDia = `${selo} · ${dia.dia.split('-')[0]}`;
      const total = dia.atracoes.length;
      const carrossel = `carrossel-${dia.id}`;

      const slides = dia.atracoes.map((item, i) => {
        // Fotos em 4:3; "pos" (data.js) ajusta o enquadramento de cada banda
        const midia = item.foto
          ? `<img ${atributosImagem(item.foto, [480, 800, 1200], 4 / 3)} sizes="(min-width: 1024px) 30vw, (min-width: 600px) 33vw, 50vw"
              alt="${escapar(item.alt || item.nome)}" loading="lazy" decoding="async" width="800" height="600"${item.pos ? ` style="object-position:${escapar(item.pos)}"` : ''}>`
          : `<span class="artist-card__placeholder" aria-hidden="true"><img src="assets/brand/tche-rock-logo.svg" alt="" width="415" height="166"></span>`;
        const detalhe = item.detalhe ? `<p class="artist-card__detail">${escapar(item.detalhe)}</p>` : '';
        const hora = item.hora
          ? ` · <time datetime="${dia.data}T${escapar(item.hora)}-03:00">${escapar(item.hora)}</time>` : '';
        return `
          <li class="carousel__slide" role="group" aria-roledescription="slide" aria-label="${i + 1} de ${total}">
            <div class="artist-card">
              <div class="artist-card__media">${midia}</div>
              <div class="artist-card__body">
                <h4 class="artist-card__name">${escapar(item.nome)}</h4>
                ${detalhe}
                <p class="artist-card__meta"><time datetime="${dia.data}">${escapar(legendaDia)}</time>${hora}</p>
              </div>
            </div>
          </li>`;
      }).join('');

      // Indicadores repetem os nomes dos cards: ficam fora do teclado/leitor de tela
      const tracos = dia.atracoes.map((_, i) =>
        `<button type="button" class="carousel__dot" data-ir="${i}" tabindex="-1" aria-hidden="true"${i ? '' : ' aria-current="true"'}></button>`).join('');

      return `
        <div class="lineup__day" data-dia="${escapar(dia.id)}">
          <div class="lineup__day-head">
            <h3 class="day-badge" id="dia-${dia.id}">
              <time class="day-badge__date" datetime="${dia.data}">
                <span class="day-badge__num">${d}</span>
                <span class="day-badge__month">${MESES[Number(mes) - 1]}</span>
              </time>
              <span class="day-badge__weekday">${escapar(dia.dia)}</span>
            </h3>
            <div class="carousel__controls">
              <button type="button" class="carousel__arrow carousel__arrow--prev" data-passo="-1" aria-controls="${carrossel}" aria-label="Banda anterior de ${escapar(dia.dia)}">${icone('arrow')}</button>
              <button type="button" class="carousel__arrow" data-passo="1" aria-controls="${carrossel}" aria-label="Próxima banda de ${escapar(dia.dia)}">${icone('arrow')}</button>
            </div>
          </div>

          <div class="carousel" id="${carrossel}" data-carrossel tabindex="0"
               role="region" aria-roledescription="carrossel" aria-labelledby="dia-${dia.id}">
            <div class="carousel__viewport">
              <ul class="carousel__track" data-trilho>${slides}</ul>
            </div>
            <div class="carousel__dots">${tracos}</div>
            <p class="sr-only" aria-live="polite" data-aviso></p>
          </div>
        </div>`;
    }).join('');
  }

  /* ---------- Realização ---------- */
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

  /* ---------- Realização (seção abaixo do hero: mesmas marcas do rodapé, destaque no centro) ---------- */
  function renderizarRealizacao() {
    const raiz = $('[data-realizacao]');
    const marcas = (DADOS.apoiadores || []).find((grupo) => grupo.categoria === 'Realização')?.marcas || [];
    if (!raiz || !marcas.length) return;
    const destaque = marcas.find((marca) => marca.destaque);
    const demais = marcas.filter((marca) => marca !== destaque);
    const meio = Math.ceil(demais.length / 2);
    const ordem = destaque ? [...demais.slice(0, meio), destaque, ...demais.slice(meio)] : demais;
    raiz.innerHTML = ordem.map((marca) => `
      <li class="realizacao__item${marca.destaque ? ' realizacao__item--destaque' : ''}">
        <span class="realizacao__logo">${marca.logo
          ? `<img src="${escapar(marca.logoClaro || marca.logo)}" alt="" loading="lazy" decoding="async">`
          : ''}</span>
        <span class="realizacao__name">${escapar(marca.nome)}</span>
      </li>`).join('');
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
    const elementos = $$('.lineup__day, .pillar, .features__item');
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

  /* ============================================================
     7. CARROSSÉIS DA PROGRAMAÇÃO (um por dia, várias bandas por vez)
     ------------------------------------------------------------
     Quantos cards aparecem vem do CSS (--por-vista: 2 no celular,
     3 a partir de 600px). Avança uma banda por vez em loop infinito:
     o trilho tem uma cópia de todas as bandas antes e outra depois;
     ao passar da ponta, desliza até a cópia e, terminada a transição,
     salta sem animação para a posição real equivalente.
     Se o dia tiver bandas que cabem todas na tela, fica estático.
     ============================================================ */
  const AUTOPLAY_MS = 3000;

  function iniciarCarrossel(raiz, atrasoInicial = 0) {
    const bloco = raiz.closest('[data-dia]');
    const janela = $('.carousel__viewport', raiz);
    const trilho = $('[data-trilho]', raiz);
    const aviso = $('[data-aviso]', raiz);
    const slides = $$('.carousel__slide', trilho);
    const tracos = $$('[data-ir]', raiz);
    const total = slides.length;
    if (!total) return;

    const clonar = (slide) => {
      const clone = slide.cloneNode(true);
      clone.removeAttribute('role');
      clone.removeAttribute('aria-roledescription');
      clone.removeAttribute('aria-label');
      clone.setAttribute('aria-hidden', 'true');
      clone.dataset.clone = '';
      clone.inert = true;
      return clone;
    };
    trilho.prepend(...slides.map(clonar));
    trilho.append(...slides.map(clonar));

    let porVista = 1;
    let estatico = false;
    let atual = 0;         // primeira banda visível (0 … total-1)
    let posicao = total;   // posição no trilho, contando as cópias (0 … 3·total-1)
    let timer = null;
    const pausas = new Set(); // hover · foco · toque · fora · aba

    const largura = () => 100 / porVista; // % do trilho ocupado por um card

    function mover(alvo, animar) {
      posicao = alvo;
      trilho.style.transition = animar && !semMovimento.matches ? '' : 'none';
      trilho.style.transform = estatico ? '' : `translateX(${-alvo * largura()}%)`;
    }

    // Se parou numa cópia, troca pela posição real equivalente sem animação
    function normalizar() {
      if (posicao !== total + atual) {
        mover(total + atual, false);
        void trilho.offsetWidth; // aplica a posição antes da próxima transição
      }
    }

    function marcar() {
      slides.forEach((slide, i) => {
        const visivel = estatico || (i - atual + total) % total < porVista;
        if (visivel) slide.removeAttribute('aria-hidden');
        else slide.setAttribute('aria-hidden', 'true');
      });
      tracos.forEach((traco, i) => {
        if (i === atual) traco.setAttribute('aria-current', 'true');
        else traco.removeAttribute('aria-current');
      });
    }

    function irPara(indice, { usuario = false, direcao = 0 } = {}) {
      if (estatico) return;
      normalizar();
      const anterior = atual;
      atual = (indice + total) % total;

      let alvo = total + atual;
      if (!semMovimento.matches) {
        // Na virada do loop, segue na mesma direção até a cópia
        if (direcao > 0 && atual < anterior) alvo += total;
        if (direcao < 0 && atual > anterior) alvo -= total;
      }
      mover(alvo, true);
      marcar();

      // Só anuncia trocas feitas pelo usuário (o autoplay não interrompe o leitor de tela)
      if (usuario) {
        const nomes = slides
          .filter((slide) => !slide.hasAttribute('aria-hidden'))
          .map((slide) => $('.artist-card__name', slide)?.textContent || '');
        aviso.textContent = nomes.join(', ');
      }
      agendar();
    }

    // Lê do CSS quantos cards cabem; com todas as bandas na tela, desliga o movimento
    function configurar() {
      porVista = Math.max(1, parseInt(getComputedStyle(raiz).getPropertyValue('--por-vista'), 10) || 1);
      estatico = total <= porVista;
      bloco.classList.toggle('is-estatico', estatico);
      if (estatico) atual = 0;
      mover(total + atual, false);
      marcar();
      agendar();
    }

    /* ---------- Autoplay ---------- */
    function agendar(espera = AUTOPLAY_MS) {
      clearTimeout(timer);
      if (estatico || semMovimento.matches || pausas.size) return;
      timer = setTimeout(() => irPara(atual + 1, { direcao: 1 }), espera);
    }
    function pausar(motivo) { pausas.add(motivo); clearTimeout(timer); }
    function retomar(motivo) { pausas.delete(motivo); agendar(); }

    trilho.addEventListener('transitionend', (evento) => {
      if (evento.target === trilho && evento.propertyName === 'transform') normalizar();
    });

    // Setas (no cabeçalho do dia) e indicadores; o clique reinicia o timer em irPara
    bloco.addEventListener('click', (evento) => {
      const passo = evento.target.closest('[data-passo]');
      const traco = evento.target.closest('[data-ir]');
      if (passo) {
        const d = Number(passo.dataset.passo);
        irPara(atual + d, { usuario: true, direcao: d });
      } else if (traco) {
        const alvo = Number(traco.dataset.ir);
        irPara(alvo, { usuario: true, direcao: Math.sign(alvo - atual) });
      }
    });

    // Setas do teclado quando o foco está no carrossel
    raiz.addEventListener('keydown', (evento) => {
      const d = { ArrowLeft: -1, ArrowRight: 1 }[evento.key];
      if (!d || estatico) return;
      evento.preventDefault();
      irPara(atual + d, { usuario: true, direcao: d });
    });

    // Hover só sobre os cards (só mouse: o toque gera "mouseenter" sem "mouseleave")
    janela.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') pausar('hover'); });
    janela.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') retomar('hover'); });

    // Foco por teclado dentro do bloco pausa; foco deixado por clique não
    bloco.addEventListener('focusin', (evento) => {
      if (evento.target.matches(':focus-visible')) pausar('foco');
      else retomar('foco');
    });
    bloco.addEventListener('focusout', (evento) => {
      if (!bloco.contains(evento.relatedTarget)) retomar('foco');
    });

    /* ---------- Swipe (toque e caneta) ---------- */
    let toque = null;
    janela.addEventListener('pointerdown', (evento) => {
      if (evento.pointerType === 'mouse' || estatico) return;
      toque = { x: evento.clientX, y: evento.clientY, dx: 0, arrastando: false, id: evento.pointerId };
      pausar('toque');
    });
    janela.addEventListener('pointermove', (evento) => {
      if (!toque || evento.pointerId !== toque.id) return;
      const dx = evento.clientX - toque.x;
      const dy = evento.clientY - toque.y;
      if (!toque.arrastando) {
        if (Math.abs(dx) < 8) return;
        if (Math.abs(dy) > Math.abs(dx)) { soltar(); return; } // rolagem vertical
        toque.arrastando = true;
        normalizar();
        janela.setPointerCapture(evento.pointerId);
      }
      toque.dx = dx;
      trilho.style.transition = 'none';
      trilho.style.transform = `translateX(calc(${-posicao * largura()}% + ${dx}px))`;
    });
    function soltar() {
      if (!toque) return;
      const { dx, arrastando } = toque;
      toque = null;
      if (arrastando) {
        const limite = Math.min(60, (janela.clientWidth / porVista) * 0.25);
        if (dx <= -limite) irPara(atual + 1, { usuario: true, direcao: 1 });
        else if (dx >= limite) irPara(atual - 1, { usuario: true, direcao: -1 });
        else mover(posicao, true);
      }
      retomar('toque');
    }
    janela.addEventListener('pointerup', soltar);
    janela.addEventListener('pointercancel', soltar);

    /* ---------- Visibilidade (seção fora da tela / aba oculta) ---------- */
    if ('IntersectionObserver' in window) {
      pausas.add('fora');
      let primeiraVez = true;
      new IntersectionObserver(([entrada]) => {
        if (!entrada.isIntersecting) { pausar('fora'); return; }
        // Com poucas bandas por dia, carrega todas as fotos assim que o bloco aparece
        $$('img', trilho).forEach((img) => { img.loading = 'eager'; });
        pausas.delete('fora');
        agendar(primeiraVez ? AUTOPLAY_MS + atrasoInicial : AUTOPLAY_MS);
        primeiraVez = false;
      }, { threshold: 0.35 }).observe(raiz);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pausar('aba'); else retomar('aba');
    });
    semMovimento.addEventListener('change', () => { normalizar(); agendar(); });
    // --por-vista muda nos breakpoints do CSS
    let redimensionando = null;
    window.addEventListener('resize', () => {
      clearTimeout(redimensionando);
      redimensionando = setTimeout(configurar, 150);
    });

    configurar();
  }

  // Os dois dias alternam: o segundo começa meio intervalo depois do primeiro
  function iniciarCarrosseis() {
    $$('[data-carrossel]').forEach((raiz, i) => iniciarCarrossel(raiz, i * (AUTOPLAY_MS / 2)));
  }

  /* ============================================================
     8. FORMULÁRIO DE CONTATO (envio via /api/contato)
     ============================================================ */
  function iniciarFormulario() {
    const form = $('[data-form-contato]');
    if (!form) return;
    const botao = $('[data-form-enviar]', form);
    const textoBotao = $('[data-form-enviar-texto]', form);
    const status = $('[data-form-status]', form);
    const campos = ['nome', 'email', 'whatsapp', 'mensagem'];
    let enviando = false;

    const somenteDigitos = (v) => v.replace(/\D/g, '');

    // Máscara brasileira: (DD) 9XXXX-XXXX ou (DD) XXXX-XXXX
    function mascarar(valor) {
      let d = somenteDigitos(valor);
      if (d.startsWith('55') && d.length > 11) d = d.slice(2);
      d = d.slice(0, 11);
      if (d.length <= 2) return d ? `(${d}` : '';
      if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    }

    const validadores = {
      nome: (v) => (v.trim().length >= 2 ? '' : 'Informe seu nome.'),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Informe um e-mail válido.'),
      whatsapp: (v) => {
        const d = somenteDigitos(v);
        const ddd = Number(d.slice(0, 2));
        const ok = (d.length === 11 && d[2] === '9') || d.length === 10;
        return ok && ddd >= 11 && ddd <= 99 ? '' : 'Informe um WhatsApp válido com DDD.';
      },
      mensagem: (v) => (v.trim().length >= 5 ? '' : 'Escreva sua mensagem.'),
    };

    function validarCampo(nome) {
      const campo = form.elements[nome];
      const erro = validadores[nome](campo.value);
      const alvo = $(`[data-erro="${nome}"]`, form);
      alvo.textContent = erro;
      campo.setAttribute('aria-invalid', erro ? 'true' : 'false');
      if (erro) campo.setAttribute('aria-describedby', alvo.id || (alvo.id = `erro-${nome}`));
      else campo.removeAttribute('aria-describedby');
      return !erro;
    }

    function mostrar(tipo, texto) {
      status.dataset.tipo = tipo;
      status.textContent = texto;
    }

    form.elements.whatsapp.addEventListener('input', (e) => { e.target.value = mascarar(e.target.value); });
    campos.forEach((nome) => {
      form.elements[nome].addEventListener('blur', () => validarCampo(nome));
      form.elements[nome].addEventListener('input', () => {
        if (form.elements[nome].getAttribute('aria-invalid') === 'true') validarCampo(nome);
      });
    });

    form.addEventListener('submit', async (evento) => {
      evento.preventDefault();
      if (enviando) return;
      status.textContent = '';
      delete status.dataset.tipo;

      const resultados = campos.map(validarCampo);
      if (resultados.includes(false)) {
        form.elements[campos[resultados.indexOf(false)]].focus();
        return;
      }

      enviando = true;
      botao.disabled = true;
      textoBotao.textContent = 'Enviando…';
      try {
        const resposta = await fetch(form.getAttribute('action'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: form.elements.nome.value.trim(),
            email: form.elements.email.value.trim(),
            whatsapp: form.elements.whatsapp.value.trim(),
            mensagem: form.elements.mensagem.value.trim(),
            site: form.elements.site.value,
          }),
        });
        if (!resposta.ok) throw new Error(String(resposta.status));
        form.reset();
        campos.forEach((nome) => form.elements[nome].removeAttribute('aria-invalid'));
        mostrar('ok', 'Mensagem enviada com sucesso! Entraremos em contato em breve.');
      } catch (erro) {
        mostrar('erro', 'Não foi possível enviar agora. Tente novamente em alguns instantes.');
      } finally {
        enviando = false;
        botao.disabled = false;
        textoBotao.textContent = 'Enviar mensagem';
      }
    });
  }

  /* ---------- Inicialização ---------- */
  renderizarSocial();
  renderizarProgramacao();
  renderizarApoiadores();
  renderizarRealizacao();
  iniciarContador();
  iniciarMenu();
  iniciarHeader();
  iniciarMenuAtivo();
  iniciarRevelar();
  iniciarCarrosseis();
  iniciarFormulario();
  $$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });

});
