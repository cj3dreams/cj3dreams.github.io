/* =========================================================
   5. FOOTER — ПРЯМОЙ REST API
   ========================================================= */

const APP_ID = "GYjlhj70ugQnkWt1O9peSmyM6tWYPX686sdAoL1y";
const REST_KEY = "kYumQQMAUjKCCHGoOwlyLwRPlSjMBEgQhssjTfjO";
const WISH_URL = "https://parseapi.back4app.com/classes/Wish";
const GUEST_URL = "https://parseapi.back4app.com/classes/Guest";

let swiper = null;
let currentPage = 1;
const limit = 20;
let isLoading = false;
let hasMore = true;
const wishesWrapper = document.getElementById('wishesList');
const wishesCount = document.getElementById('wishesCount');

// Набор эмодзи только из сайта (цветы, листья) – золотой цвет в CSS
const EMOJIS = ['❀', '✿', '❁', '❦', '✦', '❖', '☆', '❋', '☘', '🌿', '🌸', '🌼'];
let lastEmojiIndex = -1;

function getRandomEmoji() {
  let idx;
  do {
    idx = Math.floor(Math.random() * EMOJIS.length);
  } while (idx === lastEmojiIndex && EMOJIS.length > 1);
  lastEmojiIndex = idx;
  return EMOJIS[idx];
}

document.addEventListener('DOMContentLoaded', function() {

  wishesCount.textContent = '0';

  function formatDate(dateString, lang) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const months = (TRANSLATIONS && TRANSLATIONS[lang] && TRANSLATIONS[lang].months)
      || ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${day} ${months[monthIndex]} ${year}`;
  }

  function renderWishCard(wish) {
    const lang = localStorage.getItem('preferredLang') || 'ru';
    const dateStr = formatDate(wish.createdAt, lang);
    let text = wish.text || '';
    if (text.length > 100) {
      text = text.substring(0, 100) + '...';
    }
    const emoji = getRandomEmoji();
    return `
      <div class="swiper-slide">
        <div class="wish-card">
          <div class="wish-name">${escapeHtml(wish.name || 'Аноним')}</div>
          <div class="wish-text">${escapeHtml(text)}</div>
          ${dateStr ? `<div class="wish-date">${dateStr}</div>` : ''}
          <div class="wish-emoji">${emoji}</div>
        </div>
      </div>
    `;
  }

  async function loadWishes(page) {
    if (isLoading || !hasMore) return;
    isLoading = true;
    try {
      const where = encodeURIComponent(JSON.stringify({ status: "approved" }));
      const url = `${WISH_URL}?where=${where}&order=-createdAt&limit=${limit}&skip=${(page-1)*limit}`;

      const resp = await fetch(url, {
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "X-Parse-REST-API-Key": REST_KEY
        }
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();

      if (data.results.length === 0) {
        hasMore = false;
        return;
      }

      data.results.forEach(wish => {
        wishesWrapper.insertAdjacentHTML('beforeend', renderWishCard(wish));
      });

      if (swiper) swiper.update();
      hasMore = data.results.length === limit;
      currentPage++;

      const countUrl = `${WISH_URL}?where=${where}&count=1&limit=0`;
      const countResp = await fetch(countUrl, {
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "X-Parse-REST-API-Key": REST_KEY
        }
      });
      const countData = await countResp.json();
      const total = countData.count || 0;
      const lang = localStorage.getItem('preferredLang') || 'ru';
      const countText = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang])
        ? TRANSLATIONS[lang].wishes_count
        : 'Уже получено {count} поздравлений';
      wishesCount.textContent = countText.replace('{count}', total);

    } catch (e) {
      console.error('❌ Ошибка загрузки поздравлений:', e);
    } finally {
      isLoading = false;
    }
  }

  function initSwiper() {
    if (!document.querySelector('.wishes-carousel')) return;
    swiper = new Swiper('.wishes-carousel', {
      slidesPerView: 1.2,
      spaceBetween: 16,
      centeredSlides: true, // по умолчанию центрируем на всех экранах (включая мобильные)
      loop: false,
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20, centeredSlides: true },
        1024: { slidesPerView: 3, spaceBetween: 24, centeredSlides: false },
      },
      on: {
        reachEnd: function() {
          if (!isLoading && hasMore) {
            loadWishes(currentPage);
          }
        }
      }
    });
  }

  window.refreshWishes = function() {
    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }
    wishesWrapper.innerHTML = '';
    currentPage = 1;
    hasMore = true;
    isLoading = false;
    loadWishes(1).then(() => initSwiper());
  };

  loadWishes(1).then(() => initSwiper());

  // ---------- 2. Модальное окно "Оставить поздравление" ----------
  const wishOpenBtn = document.getElementById('wishOpenBtn');
  const wishModal = document.getElementById('wishModal');
  const wishModalClose = document.getElementById('wishModalClose');
  const wishForm = document.getElementById('wishForm');
  const wishSuccess = document.getElementById('wishSuccess');
  const wishSuccessOutside = document.getElementById('wishSuccessOutside');

  if (localStorage.getItem('wish_sent') === 'true') {
    wishOpenBtn.style.display = 'none';
    wishSuccessOutside.style.display = 'block';
  }

  function openWishModal() { wishModal.classList.add('active'); }
  function closeWishModal() { wishModal.classList.remove('active'); }

  wishOpenBtn.addEventListener('click', openWishModal);
  wishModalClose.addEventListener('click', closeWishModal);
  wishModal.addEventListener('click', function(e) {
    if (e.target === wishModal) closeWishModal();
  });

  wishForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('wishName').value.trim();
    const text = document.getElementById('wishText').value.trim();
    const consent = document.getElementById('wishConsent').checked;

    if (!name || !text || !consent) {
      alert('Заполните все обязательные поля.');
      return;
    }
    if (name.length < 2 || text.length < 6) {
      alert('Имя (мин. 2), текст (мин. 6 символов).');
      return;
    }

    try {
      const resp = await fetch(WISH_URL, {
        method: 'POST',
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "X-Parse-REST-API-Key": REST_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          text,
          status: "pending"
        })
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      wishForm.style.display = 'none';
      wishSuccess.style.display = 'block';
      localStorage.setItem('wish_sent', 'true');
      wishOpenBtn.style.display = 'none';
      wishSuccessOutside.style.display = 'block';
      setTimeout(closeWishModal, 2500);
    } catch (err) {
      alert('Ошибка: ' + (err.message || 'Не удалось отправить.'));
    }
  });

  // ---------- 3. Модальное окно RSVP ----------
  const rsvpOpenBtn = document.getElementById('rsvpOpenBtn');
  const rsvpModal = document.getElementById('rsvpModal');
  const rsvpModalClose = document.getElementById('rsvpModalClose');
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');
  const rsvpSuccessOutside = document.getElementById('rsvpSuccessOutside');

  if (localStorage.getItem('rsvp_sent') === 'true') {
    rsvpOpenBtn.style.display = 'none';
    rsvpSuccessOutside.style.display = 'block';
  }

  function openRsvpModal() { rsvpModal.classList.add('active'); }
  function closeRsvpModal() { rsvpModal.classList.remove('active'); }

  rsvpOpenBtn.addEventListener('click', openRsvpModal);
  rsvpModalClose.addEventListener('click', closeRsvpModal);
  rsvpModal.addEventListener('click', function(e) {
    if (e.target === rsvpModal) closeRsvpModal();
  });

  rsvpForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('rsvpName').value.trim();
    const phone = document.getElementById('rsvpPhone').value.trim();
    const side = document.getElementById('rsvpSide').value;
    const guests = document.getElementById('rsvpGuests').value;

    if (!name || !side || !guests) {
      alert('Заполните все обязательные поля (кроме телефона).');
      return;
    }

    const payload = {
      name: name,
      phone: phone || '',
      side: side,
      guests: guests
    };

    try {
      const resp = await fetch(GUEST_URL, {
        method: 'POST',
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "X-Parse-REST-API-Key": REST_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      rsvpForm.style.display = 'none';
      rsvpSuccess.style.display = 'block';
      localStorage.setItem('rsvp_sent', 'true');
      rsvpOpenBtn.style.display = 'none';
      rsvpSuccessOutside.style.display = 'block';
      setTimeout(closeRsvpModal, 2500);
    } catch (err) {
      alert('Ошибка: ' + (err.message || 'Не удалось подтвердить.'));
    }
  });

  function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/[&<>"]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      if (m === '"') return '&quot;';
      return m;
    });
  }
});