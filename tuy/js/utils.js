/* ===== Фикс реальной высоты экрана телефона ===== */
function setVH(){
  document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
}

/* Обновляем --vh при изменении размеров вьюпорта (появление/скрытие адресной
   строки браузера на мобильных при скролле, поворот экрана и т.д.).
   Без этого фоновые слои (.hero, .crystal-rain и др.) "прыгали" во время
   быстрого скролла на телефоне, т.к. --vh оставалась зафиксированной на
   значении при самой первой загрузке. Дебаунсим через rAF, чтобы не грузить CPU. */
(function () {
  let vhRaf = null;
  function scheduleSetVH() {
    if (vhRaf) return;
    vhRaf = requestAnimationFrame(function () {
      setVH();
      vhRaf = null;
    });
  }
  window.addEventListener('resize', scheduleSetVH, { passive: true });
  window.addEventListener('orientationchange', scheduleSetVH, { passive: true });
})();

/* ===== АВТО-ПОДГОНКА ИМЁН ===== */
function fitNames(){
  document.querySelectorAll('.fit-text').forEach(el=>{
    el.style.transform='scale(1)';
    const parent = el.parentElement;
    if(!parent) return;
    void el.offsetWidth;
    const parentWidth = parent.clientWidth;
    const elWidth = el.scrollWidth;
    if(elWidth > parentWidth && parentWidth > 0){
      const scale = Math.max(0.45, (parentWidth/elWidth)*0.94);
      el.style.transform = `scale(${scale})`;
    }
  });
}

/* ===== ГЕНЕРАЦИЯ ФОНОВЫХ ЭФФЕКТОВ =====
   На маленьких экранах (телефоны) слегка уменьшаем количество декоративных
   частиц — на маленьком экране всё равно тесно и разницы не видно, а CPU/
   батарея телефона экономятся заметно. На десктопе количество не меняется,
   дизайн остаётся прежним. */
const IS_SMALL_SCREEN = window.matchMedia && window.matchMedia('(max-width: 480px)').matches;
function scaleCount(n){ return IS_SMALL_SCREEN ? Math.round(n * 0.7) : n; }

function makeParticles(){
  const box=document.getElementById('particles');
  if(!box) return;
  const total = scaleCount(40);
  for(let i=0;i<total;i++){
    const p=document.createElement('span');p.className='particle';
    p.style.left=Math.random()*100+'%';p.style.top=Math.random()*100+'%';
    p.style.animationDelay=Math.random()*6+'s';p.style.animationDuration=(4+Math.random()*6)+'s';
    const s=2+Math.random()*4;p.style.width=s+'px';p.style.height=s+'px';box.appendChild(p);
  }
}

function makePetals(){
  const box=document.getElementById('petals');if(!box)return;
  const total = scaleCount(16);
  for(let i=0;i<total;i++){
    const p=document.createElement('span');p.className='petal';
    p.style.left=Math.random()*100+'%';
    p.style.animationDuration=(9+Math.random()*10)+'s';
    p.style.animationDelay=Math.random()*12+'s';
    const s=10+Math.random()*14;p.style.width=s+'px';p.style.height=s+'px';
    p.style.opacity=0.35+Math.random()*0.45;box.appendChild(p);
  }
}

function makeCrystalRain(){
  const box=document.getElementById('crystalRain');if(!box)return;
  const total = scaleCount(18);
  for(let i=0;i<total;i++){
    const c=document.createElement('span');c.className='crystal';
    c.style.left=Math.random()*100+'%';
    c.style.animationDuration=(3+Math.random()*4)+'s';
    c.style.animationDelay=Math.random()*5+'s';box.appendChild(c);
  }
}

function makeAmbientSparkle(){
  const box=document.getElementById('ambientSparkle');if(!box)return;
  const total = scaleCount(26);
  for(let i=0;i<total;i++){
    const s=document.createElement('span');
    s.style.left=Math.random()*100+'%';
    s.style.top=Math.random()*100+'%';
    s.style.animationDelay=Math.random()*7+'s';
    s.style.animationDuration=(5+Math.random()*7)+'s';
    const sz=1.5+Math.random()*3;s.style.width=sz+'px';s.style.height=sz+'px';
    box.appendChild(s);
  }
}

function makeFloralDrift(){
  const box=document.getElementById('floralDrift');if(!box)return;
  const glyphs=['❀','✿','❁'];
  const total = scaleCount(10);
  for(let i=0;i<total;i++){
    const f=document.createElement('span');
    f.className='drift-flower';
    f.textContent=glyphs[i%glyphs.length];
    f.style.left=Math.random()*100+'%';
    f.style.animationDuration=(14+Math.random()*10)+'s';
    f.style.animationDelay=Math.random()*14+'s';
    const sz=14+Math.random()*12;f.style.fontSize=sz+'px';
    box.appendChild(f);
  }
}