/* ===== ПРИМЕНЕНИЕ КОНФИГА ===== */
function applyConfig(){
  document.getElementById('groomName').textContent = CONFIG.groomName;
  document.getElementById('brideName').textContent = CONFIG.brideName;
  document.getElementById('weddingDate').textContent = CONFIG.weddingDateText;
  document.getElementById('venueName').textContent = CONFIG.venueName;
  document.getElementById('venueAddr').textContent = CONFIG.venueAddr;
  document.getElementById('footNamesWrap').innerHTML =
    `<span class="name-shine">${CONFIG.groomName}</span><span class="names-and">&amp;</span><span class="name-shine">${CONFIG.brideName}</span>`;
  document.getElementById('footDate').textContent = CONFIG.weddingDateShort;
  document.getElementById('monogram').textContent = CONFIG.monogram;
  document.getElementById('waxMonogram').textContent = CONFIG.waxMonogram;
  document.getElementById('footMono').textContent = CONFIG.monogram;
}

/* ===== REVEAL ===== */
function initReveal(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  }, {threshold: 0.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  const ioTl = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('tl-in'); });
  }, {threshold: 0.25});
  document.querySelectorAll('.tl-item').forEach(el=>ioTl.observe(el));
}

/* ===== ПЕРЕВОДЫ (функции) ===== */
function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) lang = 'en'; // если язык не найден, ставим английский
  const data = TRANSLATIONS[lang];
  
  // 1. Меняем все тексты по data-lang-key
  document.querySelectorAll('[data-lang-key]').forEach(el => {
    const key = el.getAttribute('data-lang-key');
    if (data[key]) {
      el.innerHTML = data[key];
    }
  });

  // 2. Меняем данные из CONFIG (имена, даты, залы)
  document.getElementById('groomName').textContent = data.groom_name;
  document.getElementById('brideName').textContent = data.bride_name;
  document.getElementById('weddingDate').textContent = data.date_text;
  document.getElementById('venueName').textContent = data.venue_name;
  document.getElementById('venueAddr').textContent = data.venue_addr;
  document.getElementById('footNamesWrap').innerHTML =
    `<span class="name-shine">${data.groom_name}</span><span class="names-and">&amp;</span><span class="name-shine">${data.bride_name}</span>`;
  document.getElementById('footDate').textContent = data.date_short;
  document.getElementById('footMono').textContent = CONFIG.monogram; // монограмма не переводится

  // 3. Обновляем кнопку переключателя (TG заменяем на TJ)
  const switcherBtn = document.querySelector('.lang-switcher-btn');
  if (switcherBtn) {
    const displayLang = lang === 'tg' ? 'TJ' : lang.toUpperCase();
    switcherBtn.textContent = displayLang;
  }
}

function detectLanguage() {
  const lang = navigator.language || navigator.languages?.[0] || 'en';
  if (lang.startsWith('tg') || lang.startsWith('tj')) return 'tg';
  if (lang.startsWith('ru')) return 'ru';
  // Для всех остальных (включая норвежский и т.п.) отдаём английский
  return 'en';
}

// Функция для ручного переключения (цикл: ru → en → tg → ru)
// Функция для ручного переключения (цикл: ru → en → tg → ru)
function switchLanguage() {
  const switcherBtn = document.querySelector('.lang-switcher-btn');
  let currentText = switcherBtn ? switcherBtn.textContent : 'RU';
  let current = currentText.toLowerCase();
  if (current === 'tj') current = 'tg';

  const order = ['ru', 'en', 'tg'];
  let idx = order.indexOf(current);
  if (idx === -1) idx = 0;
  const next = order[(idx + 1) % order.length];
  setLanguage(next);
  localStorage.setItem('preferredLang', next);

  // Перезагружаем карусель и счётчик при смене языка
  if (typeof refreshWishes === 'function') {
    refreshWishes();
  }
}
/* ===== ЗАПУСК ===== */
document.addEventListener('DOMContentLoaded', function(){
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  applyConfig();

  // === ВЫБОР ЯЗЫКА ===
  // Сначала проверяем, есть ли сохранённый выбор пользователя
  let savedLang = localStorage.getItem('preferredLang');
  if (savedLang && TRANSLATIONS[savedLang]) {
    setLanguage(savedLang);
  } else {
    setLanguage(detectLanguage());
  }

  // Инициализируем кнопку переключателя языка (если есть)
  const switcherBtn = document.querySelector('.lang-switcher-btn');
  if (switcherBtn) {
    switcherBtn.addEventListener('click', switchLanguage);
  }
  // =========================

  setVH();
  makeParticles();
  fitNames();
  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(()=>{
      fitNames();
      setTimeout(fitNames, 150);
    });
  }
  setTimeout(fitNames, 400);
  setTimeout(fitNames, 1000);

  window.startMusic = startMusic;
  window.initReveal = initReveal;
  window.makePetals = makePetals;
  window.makeCrystalRain = makeCrystalRain;
  window.makeAmbientSparkle = makeAmbientSparkle;
  window.makeFloralDrift = makeFloralDrift;
  window.fitNames = fitNames;
  window.setVH = setVH;
});