/* ===== ПРОГРЕСС-БАР ТАЙМЛАЙНА ===== */
window.addEventListener('scroll', function(){
  const tl = document.getElementById('timeline');
  const prog = document.getElementById('tlProgress');
  if(!tl || !prog) return;
  const rect = tl.getBoundingClientRect();
  const vh = window.innerHeight;
  const total = rect.height;
  let visible = Math.min(vh * 0.5 - rect.top + vh * 0.2, total);
  visible = Math.max(0, Math.min(visible, total));
  prog.style.height = (visible / total * 100) + '%';
});