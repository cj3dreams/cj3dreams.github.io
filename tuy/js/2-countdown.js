/* ===== ОБРАТНЫЙ ОТСЧЁТ ===== */
function updateCountdown(){
  const dist = CONFIG.targetDate.getTime() - Date.now();
  if(dist < 0) return;
  const d = Math.floor(dist / 864e5),
        h = Math.floor((dist % 864e5) / 36e5),
        m = Math.floor((dist % 36e5) / 6e4),
        s = Math.floor((dist % 6e4) / 1e3);
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('cdDays').textContent = pad(d);
  document.getElementById('cdHours').textContent = pad(h);
  document.getElementById('cdMins').textContent = pad(m);
  document.getElementById('cdSecs').textContent = pad(s);
}
setInterval(updateCountdown, 1000);
updateCountdown();