/* ===== Module 1: Configuration ===== */
const CONFIG = {
  weddingDate: new Date('2026-11-15T14:00:00+09:00'),
  venue: {
    name: '루클라비더화이트',
    address: '서울 강남구 논현로 742',
    lat: 37.518471,
    lng: 127.029254
  },
  gallery: {
    count: 12,
    basePath: 'assets/images/gallery/photo-',
    extension: '.jpg'
  },
  guestbook: {
    storageKey: 'wedding-guestbook-messages',
    maxMessageLength: 200
  }
};

/* ===== Module 2: Audio Player ===== */
const AudioPlayer = (() => {
  let audio = null;
  let btn = null;
  let isPlaying = false;

  function init() {
    btn = document.getElementById('audio-toggle');
    if (!btn) return;

    try {
      audio = new Audio('audio/bgm.mp3');
      audio.loop = true;
      audio.preload = 'none';
    } catch (e) {
      // Audio not supported or file missing -- fail silently
      btn.classList.add('is-muted');
      return;
    }

    btn.classList.add('is-muted');
    btn.addEventListener('click', toggle);

    audio.addEventListener('error', function () {
      btn.classList.add('is-muted');
      btn.classList.remove('is-playing');
    });
  }

  function toggle() {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      btn.classList.remove('is-playing');
      btn.classList.add('is-muted');
    } else {
      audio.play().then(function () {
        isPlaying = true;
        btn.classList.add('is-playing');
        btn.classList.remove('is-muted');
      }).catch(function () {
        // Autoplay blocked -- remain muted
        btn.classList.add('is-muted');
        btn.classList.remove('is-playing');
      });
    }
  }

  return { init: init };
})();

/* ===== Module 3: Gallery Lightbox ===== */
const Lightbox = (() => {
  let lightbox = null;
  let lightboxImg = null;
  let images = [];
  let currentIndex = 0;
  let scrollY = 0;

  // Touch tracking
  let touchStartX = 0;
  let touchEndX = 0;

  function init() {
    lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightboxImg = lightbox.querySelector('.lightbox__img');
    images = Array.from(document.querySelectorAll('.gallery__img'));

    // Event delegation on gallery
    var gallery = document.getElementById('gallery');
    if (gallery) {
      gallery.addEventListener('click', function (e) {
        var img = e.target.closest('.gallery__img');
        if (img) {
          var idx = images.indexOf(img);
          if (idx !== -1) open(idx);
        }
      });
    }

    // Close handlers
    lightbox.querySelector('.lightbox__close').addEventListener('click', close);
    lightbox.querySelector('.lightbox__backdrop').addEventListener('click', close);

    // Navigation
    lightbox.querySelector('.lightbox__prev').addEventListener('click', prev);
    lightbox.querySelector('.lightbox__next').addEventListener('click', next);

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    // Touch swipe
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function open(index) {
    currentIndex = index;
    updateImage();
    lightbox.hidden = false;
    scrollY = window.scrollY;
    document.body.classList.add('scroll-locked');
    document.body.style.top = '-' + scrollY + 'px';
  }

  function close() {
    lightbox.hidden = true;
    document.body.classList.remove('scroll-locked');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }

  function prev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  }

  function next() {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  }

  function updateImage() {
    if (images[currentIndex]) {
      lightboxImg.src = images[currentIndex].src;
      lightboxImg.alt = images[currentIndex].alt || '확대 사진';
    }
  }

  function handleSwipe() {
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) < 50) return;
    if (diff > 0) {
      next(); // swipe left = next
    } else {
      prev(); // swipe right = prev
    }
  }

  return { init: init };
})();

/* ===== Module 4: Countdown Timer ===== */
const Countdown = (() => {
  let daysEl, hoursEl, minutesEl, secondsEl;
  let intervalId = null;

  function init() {
    daysEl = document.getElementById('countdown-days');
    hoursEl = document.getElementById('countdown-hours');
    minutesEl = document.getElementById('countdown-minutes');
    secondsEl = document.getElementById('countdown-seconds');

    if (!daysEl) return;

    update();
    intervalId = setInterval(update, 1000);
  }

  function update() {
    var now = new Date();
    var diff = CONFIG.weddingDate - now;

    if (diff <= 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minutesEl.textContent = '0';
      secondsEl.textContent = '0';
      if (intervalId) clearInterval(intervalId);
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;
  }

  return { init: init };
})();

/* ===== Module 5: Calendar Widget ===== */
const CalendarWidget = (() => {
  function init() {
    var container = document.getElementById('calendar-widget');
    if (!container) return;

    var date = CONFIG.weddingDate;
    var year = date.getFullYear();
    var month = date.getMonth(); // 0-indexed
    var weddingDay = date.getDate();

    var timeHour = date.getHours();
    var timeMinute = date.getMinutes();
    var isAfternoon = timeHour >= 12;
    var displayHour = isAfternoon ? (timeHour === 12 ? 12 : timeHour - 12) : (timeHour === 0 ? 12 : timeHour);
    var displayMinute = timeMinute < 10 ? '0' + timeMinute : '' + timeMinute;
    var timeStr = (isAfternoon ? '오후' : '오전') + ' ' + displayHour + ':' + displayMinute;

    var firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var dayHeaders = ['일', '월', '화', '수', '목', '금', '토'];
    var html = '<table><thead><tr>';

    for (var i = 0; i < 7; i++) {
      html += '<th>' + dayHeaders[i] + '</th>';
    }
    html += '</tr></thead><tbody><tr>';

    // Empty cells before first day
    for (var i = 0; i < firstDay; i++) {
      html += '<td class="calendar-empty"></td>';
    }

    // Day cells
    var cellIndex = firstDay;
    for (var d = 1; d <= daysInMonth; d++) {
      if (cellIndex > 0 && cellIndex % 7 === 0) {
        html += '</tr><tr>';
      }

      if (d === weddingDay) {
        html += '<td class="calendar-today"><span class="cal-num">' + d + '</span><span class="cal-time">' + timeStr + '</span></td>';
      } else {
        html += '<td>' + d + '</td>';
      }
      cellIndex++;
    }

    // Fill remaining cells
    while (cellIndex % 7 !== 0) {
      html += '<td class="calendar-empty"></td>';
      cellIndex++;
    }

    html += '</tr></tbody></table>';
    container.innerHTML = html;
  }

  return { init: init };
})();

/* ===== Module 6: Account Copy ===== */
const AccountCopy = (() => {
  function init() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.copy-btn');
      if (!btn) return;

      var account = btn.getAttribute('data-account');
      if (!account) return;

      copyToClipboard(account);
    });
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('계좌번호가 복사되었습니다');
      }).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      var success = document.execCommand('copy');
      if (success) {
        showToast('계좌번호가 복사되었습니다');
      } else {
        showToast('복사에 실패했습니다. 직접 입력해주세요');
      }
    } catch (e) {
      showToast('복사에 실패했습니다. 직접 입력해주세요');
    }

    document.body.removeChild(textarea);
  }

  return { init: init };
})();

/* ===== Module 7: Collapsible Sections ===== */
const Collapsible = (() => {
  function init() {
    var triggers = document.querySelectorAll('.collapsible__trigger');
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var parent = trigger.closest('.collapsible');
        if (!parent) return;

        var isOpen = parent.classList.contains('is-open');
        parent.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', !isOpen);
      });
    });
  }

  return { init: init };
})();

/* ===== Module 8: Guest Book ===== */
const GuestBook = (() => {
  let modal = null;
  let form = null;
  let nameInput = null;
  let messageInput = null;
  let charCount = null;
  let messagesContainer = null;
  let scrollY = 0;

  function init() {
    modal = document.getElementById('guestbook-modal');
    form = document.getElementById('guestbook-form');
    nameInput = document.getElementById('gb-name');
    messageInput = document.getElementById('gb-message');
    charCount = document.getElementById('gb-char-count');
    messagesContainer = document.getElementById('guestbook-messages');

    if (!modal || !form) return;

    // Open modal
    var openBtn = document.getElementById('guestbook-open');
    if (openBtn) {
      openBtn.addEventListener('click', openModal);
    }

    // Close handlers
    modal.querySelector('.modal__close').addEventListener('click', closeModal);
    modal.querySelector('.modal__backdrop').addEventListener('click', closeModal);

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') closeModal();
    });

    // Character count
    if (messageInput && charCount) {
      messageInput.addEventListener('input', function () {
        charCount.textContent = messageInput.value.length;
      });
    }

    // Form submit
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleSubmit();
    });

    // Render existing messages
    renderMessages();
  }

  function openModal() {
    modal.hidden = false;
    scrollY = window.scrollY;
    document.body.classList.add('scroll-locked');
    document.body.style.top = '-' + scrollY + 'px';
    if (nameInput) nameInput.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('scroll-locked');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
    clearErrors();
  }

  function handleSubmit() {
    var name = nameInput.value.trim();
    var message = messageInput.value.trim();
    var valid = true;

    clearErrors();

    if (!name) {
      showError('gb-name-error', '이름을 입력해주세요');
      valid = false;
    }

    if (!message) {
      showError('gb-message-error', '메시지를 입력해주세요');
      valid = false;
    } else if (message.length > CONFIG.guestbook.maxMessageLength) {
      showError('gb-message-error', '메시지는 ' + CONFIG.guestbook.maxMessageLength + '자 이내로 입력해주세요');
      valid = false;
    }

    if (!valid) return;

    var entry = {
      name: name,
      message: message,
      date: new Date().toISOString()
    };

    saveMessage(entry);
    renderMessages();

    // Reset form
    form.reset();
    if (charCount) charCount.textContent = '0';

    showToast('메시지가 등록되었습니다');
    closeModal();
  }

  function saveMessage(entry) {
    var messages = getMessages();
    messages.unshift(entry);

    try {
      localStorage.setItem(CONFIG.guestbook.storageKey, JSON.stringify(messages));
    } catch (e) {
      // localStorage full or unavailable
    }
  }

  function getMessages() {
    try {
      var data = localStorage.getItem(CONFIG.guestbook.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function renderMessages() {
    if (!messagesContainer) return;

    var messages = getMessages();

    if (messages.length === 0) {
      messagesContainer.innerHTML = '';
      return;
    }

    var html = '';
    messages.forEach(function (msg) {
      var dateStr = formatDate(msg.date);
      var escapedName = escapeHTML(msg.name);
      var escapedMessage = escapeHTML(msg.message);

      html += '<div class="guestbook__message">' +
        '<div class="guestbook__message-header">' +
          '<span class="guestbook__message-name">' + escapedName + '</span>' +
          '<span class="guestbook__message-date">' + dateStr + '</span>' +
        '</div>' +
        '<p class="guestbook__message-text">' + escapedMessage + '</p>' +
      '</div>';
    });

    messagesContainer.innerHTML = html;
  }

  function formatDate(isoString) {
    try {
      var d = new Date(isoString);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      return month + '.' + day;
    } catch (e) {
      return '';
    }
  }

  function showError(id, message) {
    var el = document.getElementById(id);
    if (el) el.textContent = message;
  }

  function clearErrors() {
    var errors = form.querySelectorAll('.form__error');
    errors.forEach(function (el) { el.textContent = ''; });
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  return { init: init };
})();

/* ===== Module 9: Scroll Animations ===== */
const ScrollReveal = (() => {
  function init() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all sections
      reveals.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  return { init: init };
})();

/* ===== Toast Utility ===== */
function showToast(message) {
  var toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.hidden = false;

  // Force reflow then add visible class
  void toast.offsetWidth;
  toast.classList.add('is-visible');

  setTimeout(function () {
    toast.classList.remove('is-visible');
    setTimeout(function () {
      toast.hidden = true;
    }, 300);
  }, 2000);
}

/* ===== Kakao Map Init ===== */
function initKakaoMap() {
  var container = document.getElementById('kakao-map');
  var fallback = document.getElementById('map-fallback');

  if (!container) return;

  if (typeof kakao === 'undefined' || !kakao.maps) {
    if (container) container.hidden = true;
    if (fallback) fallback.hidden = false;
    return;
  }

  try {
    var options = {
      center: new kakao.maps.LatLng(CONFIG.venue.lat, CONFIG.venue.lng),
      level: 3
    };

    var map = new kakao.maps.Map(container, options);

    var markerPosition = new kakao.maps.LatLng(CONFIG.venue.lat, CONFIG.venue.lng);
    var marker = new kakao.maps.Marker({ position: markerPosition });
    marker.setMap(map);

    // Info window
    var infowindow = new kakao.maps.InfoWindow({
      content: '<div style="padding:5px;font-size:12px;text-align:center;">' +
        CONFIG.venue.name + '</div>'
    });
    infowindow.open(map, marker);

    // Handle resize
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        map.relayout();
        map.setCenter(new kakao.maps.LatLng(CONFIG.venue.lat, CONFIG.venue.lng));
      }, 200);
    });
  } catch (e) {
    if (container) container.hidden = true;
    if (fallback) fallback.hidden = false;
  }
}

/* ===== DOMContentLoaded Init ===== */
document.addEventListener('DOMContentLoaded', function () {
  ScrollReveal.init();
  AudioPlayer.init();
  Lightbox.init();
  Countdown.init();
  CalendarWidget.init();
  AccountCopy.init();
  Collapsible.init();
  GuestBook.init();
  initKakaoMap();
});
