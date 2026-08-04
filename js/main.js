/* ============================================================
   TRAMANDAÍ ROCK FESTIVAL 2027 — SCRIPTS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. COUNTDOWN TIMER ---------- */
  const dataFestival = new Date('2027-01-08T17:30:00-03:00').getTime();

  const elDias = document.getElementById('cd-dias');
  const elHoras = document.getElementById('cd-horas');
  const elMinutos = document.getElementById('cd-minutos');
  const elSegundos = document.getElementById('cd-segundos');
  const elLabel = document.querySelector('.countdown__label');

  function atualizarCountdown() {
    const agora = Date.now();
    const diferenca = dataFestival - agora;

    if (diferenca <= 0) {
      elLabel.textContent = 'O FESTIVAL COMEÇOU! 🤘';
      elDias.textContent = '00';
      elHoras.textContent = '00';
      elMinutos.textContent = '00';
      elSegundos.textContent = '00';
      clearInterval(intervaloCountdown);
      return;
    }

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

    elDias.textContent = String(dias).padStart(2, '0');
    elHoras.textContent = String(horas).padStart(2, '0');
    elMinutos.textContent = String(minutos).padStart(2, '0');
    elSegundos.textContent = String(segundos).padStart(2, '0');
  }

  atualizarCountdown();
  const intervaloCountdown = setInterval(atualizarCountdown, 1000);

  /* ---------- 2. TABS DE PROGRAMAÇÃO ---------- */
  const tabs = document.querySelectorAll('.tab');
  const listaSexta = document.getElementById('lista-sexta');
  const listaSabado = document.getElementById('lista-sabado');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      if (tab.dataset.dia === 'sexta') {
        listaSexta.hidden = false;
        listaSabado.hidden = true;
      } else {
        listaSexta.hidden = true;
        listaSabado.hidden = false;
      }
    });
  });

  /* ---------- 3. MENU MOBILE ---------- */
  const hamburger = document.getElementById('hamburger');
  const menuMobile = document.getElementById('menu-mobile');
  const overlay = document.getElementById('overlay');

  function abrirMenu() {
    hamburger.classList.add('active');
    menuMobile.classList.add('active');
    overlay.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-aberto');
  }

  function fecharMenu() {
    hamburger.classList.remove('active');
    menuMobile.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-aberto');
  }

  hamburger.addEventListener('click', () => {
    const estaAberto = menuMobile.classList.contains('active');
    estaAberto ? fecharMenu() : abrirMenu();
  });

  overlay.addEventListener('click', fecharMenu);

  document.querySelectorAll('.menu-mobile__lista a').forEach(link => {
    link.addEventListener('click', fecharMenu);
  });

  /* ---------- 4. HEADER SCROLL ---------- */
  const header = document.getElementById('header');

  function verificarScrollHeader() {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  verificarScrollHeader();
  window.addEventListener('scroll', verificarScrollHeader);

  /* ---------- 5. SCROLL SUAVE ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (evento) => {
      const destino = link.getAttribute('href');
      if (destino.length > 1) {
        const elementoDestino = document.querySelector(destino);
        if (elementoDestino) {
          evento.preventDefault();
          elementoDestino.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

});
