/* ===== МУЗЫКА ===== */
const bgMusic = document.getElementById('bgMusic');
bgMusic.src = 'assets/audio/audio.mp3';
const musicBtn = document.getElementById('musicBtn');

function startMusic(){
  bgMusic.volume = 0;
  const pr = bgMusic.play();
  if(pr !== undefined){
    pr.then(()=>{
      musicBtn.classList.add('playing');
      let v = 0;
      const fade = setInterval(()=>{
        v += 0.04;
        if(v >= 0.6){ v = 0.6; clearInterval(fade); }
        bgMusic.volume = v;
      }, 100);
    }).catch(()=>{});
  }
}

musicBtn.addEventListener('click', function(){
  if(bgMusic.paused){
    bgMusic.volume = 0.6;
    bgMusic.play();
    musicBtn.classList.add('playing');
  } else {
    bgMusic.pause();
    musicBtn.classList.remove('playing');
  }
});

// Загружаем аудио (не автовоспроизведение)
bgMusic.load();