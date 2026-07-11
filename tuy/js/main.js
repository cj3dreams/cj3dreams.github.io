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
  document.getElementById('letterMono').textContent = CONFIG.monogram;
  document.querySelectorAll('#waxMono, .wax-monogram-echo').forEach(el=>{
    el.textContent = CONFIG.waxMonogram;
  });
  document.getElementById('footMono').textContent = CONFIG.monogram;
  const lat=CONFIG.mapLat, lng=CONFIG.mapLng;
  document.getElementById('mapFrame').src = `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
  document.getElementById('mapBtn').href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  document.getElementById('rsvpBtn').href = "tel:" + CONFIG.rsvpPhone;
}

/* ===== REVEAL (появление блоков) ===== */
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

/* ===== ЗАПУСК ===== */
document.addEventListener('DOMContentLoaded', function(){

   if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  applyConfig();
  setVH();
  makeParticles();
  fitNames();
  // Отложенный вызов fitNames после загрузки шрифтов
  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(()=>{
      fitNames();
      setTimeout(fitNames, 150);
    });
  }
  setTimeout(fitNames, 400);
  setTimeout(fitNames, 1000);

  // Передаём функции в глобальную область, чтобы они были доступны из других модулей
  window.startMusic = startMusic;
  window.initReveal = initReveal;
  window.burstGold = burstGold;
  window.makePetals = makePetals;
  window.makeCrystalRain = makeCrystalRain;
  window.makeAmbientSparkle = makeAmbientSparkle;
  window.makeFloralDrift = makeFloralDrift;
  window.fitNames = fitNames;
  window.setVH = setVH;
});