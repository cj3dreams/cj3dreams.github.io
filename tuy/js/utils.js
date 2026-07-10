/* ===== Фикс реальной высоты экрана телефона ===== */
function setVH(){
  document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
}

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

/* ===== ГЕНЕРАЦИЯ ФОНОВЫХ ЭФФЕКТОВ ===== */
function makeParticles(){
  const box=document.getElementById('particles');
  if(!box) return;
  for(let i=0;i<40;i++){
    const p=document.createElement('span');p.className='particle';
    p.style.left=Math.random()*100+'%';p.style.top=Math.random()*100+'%';
    p.style.animationDelay=Math.random()*6+'s';p.style.animationDuration=(4+Math.random()*6)+'s';
    const s=2+Math.random()*4;p.style.width=s+'px';p.style.height=s+'px';box.appendChild(p);
  }
}

function makePetals(){
  const box=document.getElementById('petals');if(!box)return;
  for(let i=0;i<16;i++){
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
  for(let i=0;i<18;i++){
    const c=document.createElement('span');c.className='crystal';
    c.style.left=Math.random()*100+'%';
    c.style.animationDuration=(3+Math.random()*4)+'s';
    c.style.animationDelay=Math.random()*5+'s';box.appendChild(c);
  }
}

function makeAmbientSparkle(){
  const box=document.getElementById('ambientSparkle');if(!box)return;
  for(let i=0;i<26;i++){
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
  for(let i=0;i<10;i++){
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

/* ===== ЗОЛОТОЙ ВЗРЫВ (искры) ===== */
function burstGold(x,y){
  const box=document.getElementById('envBurst');if(!box)return;
  for(let i=0;i<26;i++){
    const s=document.createElement('span');
    s.className='spark';
    const angle=Math.random()*Math.PI*2;
    const dist=50+Math.random()*100;
    s.style.setProperty('--dx',Math.cos(angle)*dist+'px');
    s.style.setProperty('--dy',Math.sin(angle)*dist+'px');
    s.style.left=x+'px';s.style.top=y+'px';
    s.style.animationDelay=(Math.random()*0.12)+'s';
    box.appendChild(s);
    setTimeout(()=>s.remove(),1500);
  }
}