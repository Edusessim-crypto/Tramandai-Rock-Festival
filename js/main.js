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

  /* ---------- Programação (lista por dia + carrossel único com todas as bandas) ---------- */
  function renderizarProgramacao() {
    const raiz = $('[data-programacao]');
    const dias = DADOS.programacao || [];
    if (!raiz || !dias.length) return;

    const total = dias.reduce((soma, dia) => soma + dia.atracoes.length, 0);
    const carrossel = 'carrossel-programacao';
    let n = 0; // posição da banda no carrossel (0 … total-1)

    const grupos = dias.map((dia, g) => {
      const [, mes, d] = dia.data.split('-');
      const selo = `${d} ${MESES[Number(mes) - 1]}`;
      const legendaDia = `${selo} · ${dia.dia.split('-')[0]}`;

      const itens = dia.atracoes.map((item) => {
        const i = n++;
        // Fotos em 4:3; "pos" (data.js) ajusta o enquadramento de cada banda
        const midia = item.foto
          ? `<img ${atributosImagem(item.foto, [480, 800, 1200], 4 / 3)} sizes="(min-width: 1024px) 60vw, 100vw"
              alt="${escapar(item.alt || item.nome)}" loading="lazy" decoding="async" width="800" height="600"${item.pos ? ` style="object-position:${escapar(item.pos)}"` : ''}>`
          : `<span class="artist-card__placeholder" aria-hidden="true"><img src="assets/brand/tche-rock-logo.svg" alt="" width="415" height="166"></span>`;
        const hora = item.hora
          ? ` · <time datetime="${dia.data}T${escapar(item.hora)}-03:00">${escapar(item.hora)}</time>` : '';
        return {
          slide: `
            <li class="carousel__slide" data-grupo="${g}" role="group" aria-roledescription="slide" aria-label="${i + 1} de ${total}"${i ? ' aria-hidden="true"' : ''}>
              <div class="artist-card">
                <div class="artist-card__media">${midia}</div>
                <div class="artist-card__body">
                  <h3 class="artist-card__name">${escapar(item.nome)}</h3>
                  <p class="artist-card__meta"><time datetime="${dia.data}">${escapar(legendaDia)}</time>${hora}</p>
                </div>
              </div>
            </li>`,
          botao: `
            <li><button type="button" class="lineup__band" data-ir="${i}" aria-controls="${carrossel}"${i ? '' : ' aria-current="true"'}>${escapar(item.nome)}</button></li>`,
          // Indicadores repetem a lista de nomes: ficam fora do teclado/leitor de tela
          traco: `<button type="button" class="carousel__dot" data-ir="${i}" tabindex="-1" aria-hidden="true"${i ? '' : ' aria-current="true"'}></button>`,
        };
      });

      return {
        slides: itens.map((x) => x.slide).join(''),
        tracos: `<span class="carousel__dots-group">${itens.map((x) => x.traco).join('')}</span>`,
        lista: `
          <div class="lineup__group${g ? '' : ' is-active'}" data-grupo="${g}">
            <header class="day-badge" id="dia-${dia.id}">
              <time class="day-badge__date" datetime="${dia.data}">
                <span class="day-badge__num">${d}</span>
                <span class="day-badge__month">${MESES[Number(mes) - 1]}</span>
              </time>
              <span class="day-badge__weekday">${escapar(dia.dia)}</span>
            </header>
            <ol class="lineup__bands" aria-labelledby="dia-${dia.id}">${itens.map((x) => x.botao).join('')}</ol>
          </div>`,
      };
    });

    raiz.innerHTML = `
      <div class="lineup__aside">${grupos.map((x) => x.lista).join('')}</div>

      <div class="carousel" id="${carrossel}" data-carrossel tabindex="0"
           role="region" aria-roledescription="carrossel" aria-label="Fotos das atrações">
        <div class="carousel__stage">
          <div class="carousel__viewport">
            <ul class="carousel__track" data-trilho>${grupos.map((x) => x.slides).join('')}</ul>
          </div>
          <div class="carousel__controls">
            <button type="button" class="carousel__arrow carousel__arrow--prev" data-passo="-1" aria-label="Banda anterior">${icone('arrow')}</button>
            <button type="button" class="carousel__arrow" data-passo="1" aria-label="Próxima banda">${icone('arrow')}</button>
          </div>
        </div>
        <div class="carousel__dots">${grupos.map((x) => x.tracos).join('')}</div>
        <p class="sr-only" aria-live="polite" data-aviso></p>
      </div>`;
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
    const elementos = $$('.lineup__board, .pillar, .features__item');
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
     7. CARROSSEL DA PROGRAMAÇÃO (todas as bandas, na ordem dos dias)
     ------------------------------------------------------------
     Loop infinito: o trilho tem um clone da última banda no início
     e da primeira no fim. Ao passar da ponta, desliza até o clone e,
     terminada a transição, salta sem animação para o slide real.
     ============================================================ */
  const AUTOPLAY_MS = 3000;

  function iniciarCarrossel() {
    const raiz = $('[data-carrossel]');
    if (!raiz) return;
    const bloco = raiz.closest('[data-programacao]');
    const janela = $('.carousel__viewport', raiz);
    const trilho = $('[data-trilho]', raiz);
    const aviso = $('[data-aviso]', raiz);
    const slides = $$('.carousel__slide', trilho);
    const botoes = $$('[data-ir]', bloco);
    const grupos = $$('.lineup__group', bloco);
    const total = slides.length;

    if (total < 2) {
      $('.carousel__controls', raiz)?.remove();
      $('.carousel__dots', raiz)?.remove();
      return;
    }

    const clonar = (slide) => {
      const clone = slide.cloneNode(true);
      clone.removeAttribute('role');
      clone.removeAttribute('aria-roledescription');
      clone.removeAttribute('aria-label');
      clone.setAttribute('aria-hidden', 'true');
      clone.inert = true;
      return clone;
    };
    const cloneUltimo = clonar(slides[total - 1]);
    const clonePrimeiro = clonar(slides[0]);
    trilho.prepend(cloneUltimo);
    trilho.append(clonePrimeiro);

    let atual = 0;     // banda exibida (0 … total-1)
    let posicao = 1;   // posição no trilho, contando os clones (0 … total+1)
    let timer = null;
    const pausas = new Set(); // hover · foco · toque · fora · aba

    function mover(alvo, animar) {
      posicao = alvo;
      trilho.style.transition = animar && !semMovimento.matches ? '' : 'none';
      trilho.style.transform = `translateX(${-alvo * 100}%)`;
    }

    // Se parou num clone, troca pelo slide real equivalente sem animação
    function normalizar() {
      if (posicao !== atual + 1) {
        mover(atual + 1, false);
        void trilho.offsetWidth; // aplica a posição antes da próxima transição
      }
    }

    // Carrega a foto da banda atual e das vizinhas (inclusive os clones)
    function carregarVizinhas() {
      [-1, 0, 1].forEach((d) => {
        const i = (atual + d + total) % total;
        const alvos = [slides[i]];
        if (i === 0) alvos.push(clonePrimeiro);
        if (i === total - 1) alvos.push(cloneUltimo);
        alvos.forEach((slide) => { const img = $('img', slide); if (img) img.loading = 'eager'; });
      });
    }

    function irPara(indice, { usuario = false, direcao = 0 } = {}) {
      normalizar();
      const anterior = atual;
      atual = (indice + total) % total;

      let alvo = atual + 1;
      if (!semMovimento.matches) {
        if (direcao > 0 && anterior === total - 1 && atual === 0) alvo = total + 1;
        if (direcao < 0 && anterior === 0 && atual === total - 1) alvo = 0;
      }
      mover(alvo, true);

      slides.forEach((slide, i) => {
        if (i === atual) slide.removeAttribute('aria-hidden');
        else slide.setAttribute('aria-hidden', 'true');
      });
      // Selo do dia da banda ativa em destaque; o do outro dia atenuado
      grupos.forEach((grupo) => grupo.classList.toggle('is-active', grupo.dataset.grupo === slides[atual].dataset.grupo));
      botoes.forEach((botao) => {
        if (Number(botao.dataset.ir) === atual) botao.setAttribute('aria-current', 'true');
        else botao.removeAttribute('aria-current');
      });
      // Só anuncia trocas feitas pelo usuário (o autoplay não interrompe o leitor de tela)
      if (usuario) {
        const nome = $('.artist-card__name', slides[atual])?.textContent || '';
        const dia = $('.artist-card__meta', slides[atual])?.textContent || '';
        aviso.textContent = `${nome}, ${dia}, ${atual + 1} de ${total}`;
      }
      carregarVizinhas();
      agendar();
    }

    /* ---------- Autoplay ---------- */
    function agendar() {
      clearTimeout(timer);
      if (semMovimento.matches || pausas.size) return;
      timer = setTimeout(() => irPara(atual + 1, { direcao: 1 }), AUTOPLAY_MS);
    }
    function pausar(motivo) { pausas.add(motivo); clearTimeout(timer); }
    function retomar(motivo) { pausas.delete(motivo); agendar(); }

    trilho.addEventListener('transitionend', (evento) => {
      if (evento.target === trilho && evento.propertyName === 'transform') normalizar();
    });

    // Setas, indicadores e nomes da lista (o clique reinicia o timer em irPara)
    bloco.addEventListener('click', (evento) => {
      const passo = evento.target.closest('[data-passo]');
      const nome = evento.target.closest('[data-ir]');
      if (passo) {
        const d = Number(passo.dataset.passo);
        irPara(atual + d, { usuario: true, direcao: d });
      } else if (nome) {
        irPara(Number(nome.dataset.ir), { usuario: true });
      }
    });

    // Setas do teclado quando o foco está no carrossel
    raiz.addEventListener('keydown', (evento) => {
      const d = { ArrowLeft: -1, ArrowRight: 1 }[evento.key];
      if (!d) return;
      evento.preventDefault();
      irPara(atual + d, { usuario: true, direcao: d });
    });

    // Hover só sobre a foto (só mouse: o toque gera "mouseenter" sem "mouseleave");
    // com o mouse sobre as listas o carrossel continua rodando
    const palco = $('.carousel__stage', raiz);
    palco.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') pausar('hover'); });
    palco.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') retomar('hover'); });

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
      if (evento.pointerType === 'mouse') return;
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
      trilho.style.transform = `translateX(calc(${-posicao * 100}% + ${dx}px))`;
    });
    function soltar() {
      if (!toque) return;
      const { dx, arrastando } = toque;
      toque = null;
      if (arrastando) {
        const limite = Math.min(80, janela.clientWidth * 0.15);
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
      new IntersectionObserver(([entrada]) => {
        if (entrada.isIntersecting) { carregarVizinhas(); retomar('fora'); }
        else pausar('fora');
      }, { threshold: 0.35 }).observe(raiz);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pausar('aba'); else retomar('aba');
    });
    semMovimento.addEventListener('change', () => { normalizar(); agendar(); });

    mover(1, false);
    agendar();
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
  iniciarContador();
  iniciarMenu();
  iniciarHeader();
  iniciarMenuAtivo();
  iniciarRevelar();
  iniciarCarrossel();
  iniciarFormulario();
  $$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });

});
