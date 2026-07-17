/* =========================================================
   0. КОНВЕРТ — ЛОГИКА ОТКРЫТИЯ
   ========================================================= */

(function () {
  let isOpened = false;

  const floater = document.getElementById('envelopeFloat');
  const envelope = document.getElementById('envelope3d');
  const flap = document.getElementById('envFlap');
  const card = document.getElementById('envCard');
  const seal = document.getElementById('envSeal');
  const hint = document.getElementById('openHint');
  const screen = document.getElementById('invitationScreen');
  const sparks = document.getElementById('sparkField');

  function freezeFloat() {
    const computed = getComputedStyle(floater).transform;
    floater.style.transform = computed === 'none' ? '' : computed;
    floater.classList.add('frozen');
  }

  function spawnSparks(x, y) {
    for (let i = 0; i < 45; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.pow(Math.random(), 2) * 130;
      const size = 3 + Math.random() * 4;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      s.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      sparks.appendChild(s);
      setTimeout(() => s.remove(), 1300);
    }
  }

  function openEnvelope() {
    if (isOpened) return;
    isOpened = true;
    const langSwitcher = document.getElementById('langSwitcher');
    if (langSwitcher) {
      langSwitcher.classList.add('hide');
      setTimeout(() => {
        langSwitcher.style.display = 'none';
      }, 400);
    }

    if (typeof startMusic === 'function') startMusic();

    freezeFloat();
    hint.classList.add('hide');
    envelope.classList.add('is-opening');

    // 1. Раскол печати + искры
    const rect = seal.getBoundingClientRect();
    spawnSparks(rect.left + rect.width / 2, rect.top + rect.height / 2);
    seal.classList.add('broken');

    // 2. Открытие клапана + уход ленты
    setTimeout(() => {
      flap.classList.add('open');
      const rV = document.getElementById('ribbonV');
      const rH = document.getElementById('ribbonH');
      if (rV) rV.classList.add('fade');
      if (rH) rH.classList.add('fade');
    }, 500);
    // 3. Выезд карточки — сначала запускаем движение (карточка ЗА карманом)
    setTimeout(() => card.classList.add('extract'), 1200);

    // 4. Уход экрана вверх (как в первой версии)
    setTimeout(() => screen.classList.add('lift'), 3100);

    // 5. Передача управления Hero
    setTimeout(() => {
      screen.style.display = 'none';
      document.getElementById('content').classList.add('show');
      document.body.classList.add('scrollable');

      if (typeof initReveal === 'function') initReveal();
      if (typeof makePetals === 'function') makePetals();
      if (typeof makeCrystalRain === 'function') makeCrystalRain();
      if (typeof makeAmbientSparkle === 'function') makeAmbientSparkle();
      if (typeof makeFloralDrift === 'function') makeFloralDrift();
      if (typeof fitNames === 'function') {
        fitNames();
        setTimeout(fitNames, 300);
      }
      window.dispatchEvent(new Event('scroll'));
      setTimeout(() => window.dispatchEvent(new Event('scroll')), 1000);
    }, 4300);
  }

  envelope.addEventListener('click', openEnvelope);
  seal.addEventListener('click', function (e) {
    e.stopPropagation();
    openEnvelope();
  });
})();