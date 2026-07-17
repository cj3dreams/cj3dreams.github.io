/* ===== ПРОГРЕСС-БАР ТАЙМЛАЙНА (Задержка 4 секунды для обоих) ===== */
(function () {
  // Задержка теперь 4000мс (4 секунды) - появляются вместе
  setTimeout(() => {
    const tl = document.getElementById('timeline');
    const prog = document.getElementById('tlProgress');
    if (!tl || !prog) return;

    // Включаем серую линию (она вырастет с 0px до 2px)
    tl.classList.add('ready');

    // Включаем золотой прогресс-бар
    prog.classList.add('show');

    let ticking = false;

    const updateProgress = () => {
      const rect = tl.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      let visible = Math.min(vh * 0.5 - rect.top + vh * 0.2, total);
      visible = Math.max(0, Math.min(visible, total));
      prog.style.height = (visible / total * 100) + '%';
    };

    // Обработчик изменения размера окна
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateProgress();
      }, 100); // дебаунс 100 мс
    });

    // Обработчик скролла с requestAnimationFrame
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    });

    setTimeout(updateProgress, 100);
  }, 5000);
})();