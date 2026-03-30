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
    basePath: 'assets/images/gallery/photo-',
    extension: '.jpg',
    maxProbe: 60,
    initialShow: 6
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
      audio = new Audio('audio/audio_test.mp3');
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

  // Scroll position saved before lock for iOS scroll restoration
  let savedScrollY = 0;

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
    savedScrollY = Math.round(window.scrollY);
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + savedScrollY + 'px';
    document.body.style.width = '100%';
    lightbox.hidden = false;
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, savedScrollY);
    document.documentElement.style.scrollBehavior = '';
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

  function refresh() {
    images = Array.from(document.querySelectorAll('.gallery__img'));
  }

  return { init: init, refresh: refresh };
})();

/* ===== Module 3-B: Gallery Builder ===== */
const Gallery = (() => {
  function init() {
    const grid = document.querySelector('.gallery__grid');
    if (!grid) return;

    const { basePath, extension, maxProbe, initialShow } = CONFIG.gallery;
    probeImages(basePath, extension, maxProbe, function (srcs) {
      buildGallery(grid, srcs, initialShow);
    });
  }

  function probeImages(basePath, ext, max, callback) {
    const found = [];
    let idx = 1;

    function next() {
      if (idx > max) { callback(found); return; }
      const num = String(idx).padStart(2, '0');
      const src = basePath + num + ext;
      const probe = new Image();
      probe.onload = function () { found.push(src); idx++; next(); };
      probe.onerror = function () { callback(found); }; // Stop at first 404
      probe.src = src;
    }

    next();
  }

  function buildGallery(grid, srcs, initialShow) {
    grid.innerHTML = '';
    if (srcs.length === 0) return;

    srcs.forEach(function (src, i) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '웨딩 사진 ' + (i + 1);
      img.width = 400;
      img.height = 500;
      img.loading = 'lazy';
      img.className = 'gallery__img';
      if (i >= initialShow) {
        img.classList.add('gallery__img--hidden');
      }
      grid.appendChild(img);
    });

    Lightbox.refresh();

    if (srcs.length > initialShow) {
      addMoreButton(grid, srcs.length);
    }
  }

  function addMoreButton(grid, total) {
    const STEP = CONFIG.gallery.initialShow;
    const btn = document.createElement('button');
    btn.className = 'gallery__more-btn';
    btn.type = 'button';

    function updateButton() {
      const hiddenImgs = grid.querySelectorAll('.gallery__img--hidden');
      if (hiddenImgs.length === 0) {
        btn.remove();
        return;
      }
      btn.textContent = '더 많은 사진 보기';
    }

    btn.addEventListener('click', function () {
      const hiddenImgs = Array.from(grid.querySelectorAll('.gallery__img--hidden'));
      hiddenImgs.slice(0, STEP).forEach(function (img) {
        img.classList.remove('gallery__img--hidden');
      });
      Lightbox.refresh();
      updateButton();
    });

    grid.insertAdjacentElement('afterend', btn);
    updateButton();
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
        html += '<td class="calendar-today"><span class="cal-num">' + d + '</span></td>';
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

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const isAfternoon = hours >= 12;
    const displayHour = isAfternoon ? (hours === 12 ? 12 : hours - 12) : (hours === 0 ? 12 : hours);
    const displayMinute = minutes < 10 ? '0' + minutes : '' + minutes;
    const timeStr = (isAfternoon ? '오후' : '오전') + ' ' + displayHour + ':' + displayMinute;
    html += '<p class="calendar-time">' + timeStr + '</p>';

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
  let editDocId = null;
  let cachedMessages = [];
  let savedScrollY = 0;
  let passwordInput = null;
  let pwVerifyModal = null;
  let pwVerifyInput = null;
  let pwVerifyCallback = null;
  let pwVerifySavedScrollY = 0;
  let historyPushed = false;

  function init() {
    modal = document.getElementById('guestbook-modal');
    form = document.getElementById('guestbook-form');
    nameInput = document.getElementById('gb-name');
    messageInput = document.getElementById('gb-message');
    charCount = document.getElementById('gb-char-count');
    messagesContainer = document.getElementById('guestbook-messages');
    passwordInput = document.getElementById('gb-password');
    pwVerifyModal = document.getElementById('pw-verify-modal');
    pwVerifyInput = document.getElementById('pw-verify-input');

    if (!modal || !form) return;

    // Open modal
    var openBtn = document.getElementById('guestbook-open');
    if (openBtn) {
      openBtn.addEventListener('click', openModal);
    }

    // Close handlers
    modal.querySelector('.modal__close').addEventListener('click', closeModal);
    modal.querySelector('.modal__backdrop').addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') closeModal();
    });

    // Android back button: intercept popstate to close modal instead of leaving page
    window.addEventListener('popstate', function () {
      if (!modal.hidden) {
        historyPushed = false;
        resetModalState();
      }
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

    // Edit/delete button delegation
    if (messagesContainer) {
      messagesContainer.addEventListener('click', function (e) {
        var editBtn = e.target.closest('.gb-edit-btn');
        var deleteBtn = e.target.closest('.gb-delete-btn');
        if (editBtn) {
          handleEdit(editBtn.getAttribute('data-doc-id'));
        } else if (deleteBtn) {
          handleDelete(deleteBtn.getAttribute('data-doc-id'));
        }
      });
    }


    // Password verify modal event listeners
    if (pwVerifyModal) {
      pwVerifyModal.querySelector('.modal__close').addEventListener('click', closePasswordVerify);
      pwVerifyModal.querySelector('.modal__backdrop').addEventListener('click', function (e) {
        if (e.target === this) closePasswordVerify();
      });
      var pwVerifyForm = document.getElementById('pw-verify-form');
      if (pwVerifyForm) {
        pwVerifyForm.addEventListener('submit', function(e) {
          e.preventDefault();
          var entered = pwVerifyInput ? pwVerifyInput.value : '';
          if (pwVerifyCallback) pwVerifyCallback(entered);
        });
      }
    }

    // Render existing messages (localStorage fallback until Firebase loads)
    renderMessages();

    // Expose render function for Firebase real-time updates
    window.__renderGuestBookMessages = renderMessages;
  }

  function openModal() {
    if (!modal.hidden) return; // Prevent double-open on rapid tap
    document.body.style.overflow = 'hidden';
    modal.hidden = false;

    // iOS Safari: focus() must be called synchronously within user gesture to show keyboard
    if (nameInput) nameInput.focus();

    // Android: push a history state so the back button closes the modal instead of leaving the page
    history.pushState({ gbModal: true }, '');
    historyPushed = true;
  }

  function resetModalState() {
    modal.hidden = true;
    document.body.style.overflow = '';

    editDocId = null;
    form.reset();
    if (charCount) charCount.textContent = '0';

    var pwGroup = document.getElementById('gb-password-group');
    if (pwGroup) pwGroup.hidden = false;

    var modalTitle = modal.querySelector('.modal__title');
    var submitBtn = form.querySelector('.form__submit');
    if (modalTitle) modalTitle.textContent = '축하 메시지';
    if (submitBtn) submitBtn.textContent = '등록하기';

    clearErrors();
  }

  function closeModal() {
    resetModalState();

    // Pop the history state we pushed on open (triggers popstate, but modal is already hidden so handler is a no-op)
    if (historyPushed) {
      historyPushed = false;
      history.back();
    }
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

    var password = '';
    if (!editDocId) {
      password = passwordInput ? passwordInput.value.trim() : '';
      if (!password) {
        showError('gb-password-error', '비밀번호를 입력해주세요');
        valid = false;
      }
    }

    if (!valid) return;

    if (editDocId) {
      // Edit mode: update existing message in Firestore
      var docIdToUpdate = editDocId;
      form.reset();
      if (charCount) charCount.textContent = '0';
      closeModal();

      if (window.__fbUpdate) {
        window.__fbUpdate(docIdToUpdate, name, message).then(function () {
          showToast('메시지가 수정되었습니다');
        }).catch(function () {
          showToast('수정에 실패했습니다. 다시 시도해주세요');
        });
      } else {
        showToast('데이터베이스 연결 오류. 새로고침 후 다시 시도해주세요');
      }
    } else {
      // New message mode
      var entry = {
        name: name,
        message: message,
        password: password,
        date: new Date().toISOString()
      };

      saveMessage(entry);

      // Only re-render from localStorage when Firebase is not active.
      // When Firebase is active, onSnapshot handles rendering automatically.
      if (!window.__fbSave) {
        renderMessages();
      }

      form.reset();
      if (charCount) charCount.textContent = '0';
      showToast('메시지가 등록되었습니다');
      closeModal();
    }
  }

  function handleEdit(docId) {
    var msg = null;
    for (var i = 0; i < cachedMessages.length; i++) {
      if (cachedMessages[i].docId === docId) {
        msg = cachedMessages[i];
        break;
      }
    }
    if (!msg) return;

    var desc = document.getElementById('pw-verify-desc');
    if (desc) desc.textContent = '메시지를 수정하려면 비밀번호를 입력해주세요';

    showPasswordVerify(function(entered) {
      if (entered !== msg.password) {
        var errEl = document.getElementById('pw-verify-error');
        if (errEl) errEl.textContent = '비밀번호가 올바르지 않습니다';
        return;
      }
      closePasswordVerify();

      editDocId = docId;
      if (nameInput) nameInput.value = msg.name;
      if (messageInput) {
        messageInput.value = msg.message;
        if (charCount) charCount.textContent = String(msg.message.length);
      }

      var pwGroup = document.getElementById('gb-password-group');
      if (pwGroup) pwGroup.hidden = true;

      var modalTitle = modal.querySelector('.modal__title');
      var submitBtn = form.querySelector('.form__submit');
      if (modalTitle) modalTitle.textContent = '메시지 수정';
      if (submitBtn) submitBtn.textContent = '수정하기';

      openModal();
    });
  }

  function handleDelete(docId) {
    var msg = null;
    for (var i = 0; i < cachedMessages.length; i++) {
      if (cachedMessages[i].docId === docId) {
        msg = cachedMessages[i];
        break;
      }
    }
    if (!msg) return;

    var desc = document.getElementById('pw-verify-desc');
    if (desc) desc.textContent = '메시지를 삭제하려면 비밀번호를 입력해주세요';

    showPasswordVerify(function(entered) {
      if (entered !== msg.password) {
        var errEl = document.getElementById('pw-verify-error');
        if (errEl) errEl.textContent = '비밀번호가 올바르지 않습니다';
        return;
      }
      closePasswordVerify();

      if (!window.__fbDelete) {
        showToast('데이터베이스 연결 오류. 새로고침 후 다시 시도해주세요');
        return;
      }

      window.__fbDelete(docId).then(function () {
        showToast('메시지가 삭제되었습니다');
      }).catch(function () {
        showToast('삭제에 실패했습니다. 다시 시도해주세요');
      });
    });
  }

  function showPasswordVerify(callback) {
    pwVerifyCallback = callback;
    var errEl = document.getElementById('pw-verify-error');
    if (errEl) errEl.textContent = '';
    if (pwVerifyInput) pwVerifyInput.value = '';
    if (pwVerifyModal) {
      document.body.style.overflow = 'hidden';
      pwVerifyModal.hidden = false;
    }
  }

  function closePasswordVerify() {
    if (pwVerifyModal) {
      pwVerifyModal.hidden = true;
      document.body.style.overflow = '';
    }
    pwVerifyCallback = null;
    if (pwVerifyInput) pwVerifyInput.value = '';
    var errEl = document.getElementById('pw-verify-error');
    if (errEl) errEl.textContent = '';
  }

  function saveMessage(entry) {
    if (window.__fbSave) {
      // Firebase active: save to Firestore, fall back to localStorage on error
      window.__fbSave(entry).catch(function() {
        var messages = getMessages();
        messages.unshift(entry);
        try {
          localStorage.setItem(CONFIG.guestbook.storageKey, JSON.stringify(messages));
        } catch (e) {}
      });
    } else {
      var messages = getMessages();
      messages.unshift(entry);
      try {
        localStorage.setItem(CONFIG.guestbook.storageKey, JSON.stringify(messages));
      } catch (e) {}
    }
  }

  function getMessages() {
    try {
      var data = localStorage.getItem(CONFIG.guestbook.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Failed to parse guestbook data from localStorage:', e);
      return [];
    }
  }

  function renderMessages(messages) {
    if (!messagesContainer) return;

    if (messages === undefined) {
      messages = getMessages();
    }

    cachedMessages = messages;

    if (messages.length === 0) {
      messagesContainer.innerHTML = '';
      return;
    }

    var html = '';
    messages.forEach(function (msg) {
      var dateStr = formatDate(msg.date);
      var escapedName = escapeHTML(msg.name);
      var escapedMessage = escapeHTML(msg.message);

      var actionBtns = '';
      if (msg.docId) {
        var safeDocId = (msg.docId || '').replace(/[^A-Za-z0-9\-_]/g, '');
        actionBtns =
          '<div class="guestbook__message-actions">' +
            '<button class="gb-delete-btn" type="button" data-doc-id="' + safeDocId + '" aria-label="메시지 삭제">&times;</button>' +
            '<button class="gb-edit-btn" type="button" data-doc-id="' + safeDocId + '" aria-label="메시지 수정">&#9998;</button>' +
          '</div>';
      }

      html += '<div class="guestbook__message">' +
        actionBtns +
        '<p class="guestbook__message-text">' + escapedMessage + '</p>' +
        '<div class="guestbook__message-footer">' +
          '<span class="guestbook__message-from">From <em>' + escapedName + '</em></span>' +
          '<span class="guestbook__message-date">' + dateStr + '</span>' +
        '</div>' +
      '</div>';
    });

    messagesContainer.innerHTML = html;
  }

  function formatDate(isoString) {
    try {
      var d = new Date(isoString);
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var hours = d.getHours();
      var minutes = d.getMinutes();
      var seconds = d.getSeconds();
      var isAM = hours < 12;
      var h = hours % 12 || 12;
      var mm = minutes < 10 ? '0' + minutes : '' + minutes;
      var ss = seconds < 10 ? '0' + seconds : '' + seconds;
      return year + '. ' + month + '. ' + day + '. ' + (isAM ? '오전' : '오후') + ' ' + h + ':' + mm + ':' + ss;
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
// @MX:NOTE: [AUTO] duration 파라미터 추가 (기본값 2000ms, 공유 토스트는 3000ms 사용)
function showToast(message, duration) {
  var toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.hidden = false;

  // 강제 리플로우 후 visible 클래스 추가
  void toast.offsetWidth;
  toast.classList.add('is-visible');

  setTimeout(function () {
    toast.classList.remove('is-visible');
    setTimeout(function () {
      toast.hidden = true;
    }, 300);
  }, duration !== undefined ? duration : 2000);
}

/* ===== Naver Map Init ===== */
function initNaverMap() {
  var container = document.getElementById('naver-map');
  if (!container) return;

  // SDK 로드 여부 확인
  if (typeof naver === 'undefined' || typeof naver.maps === 'undefined') {
    console.warn('[NaverMap] SDK가 로드되지 않았습니다. Client ID와 서비스 URL을 확인하세요.');
    container.hidden = true;
    return;
  }

  try {
    var map = new naver.maps.Map('naver-map', {
      center: new naver.maps.LatLng(CONFIG.venue.lat, CONFIG.venue.lng),
      zoom: 16
    });

    new naver.maps.Marker({
      position: new naver.maps.LatLng(CONFIG.venue.lat, CONFIG.venue.lng),
      map: map
    });
  } catch (e) {
    console.error('[NaverMap] 초기화 오류:', e);
  }
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
    /*
    var infowindow = new kakao.maps.InfoWindow({
      content: '<div style="padding:5px;font-size:12px;text-align:center;">' +
        CONFIG.venue.name + '</div>'
    });
    infowindow.open(map, marker);
    */

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

/* ===== Module N: Zoom Controller ===== */
const ZoomController = (() => {
  let btn = null;
  let sign = null;
  let isZoomed = false;
  const STORAGE_KEY = 'wedding-zoom-state';

  function applyZoom(zoomed) {
    isZoomed = zoomed;
    if (zoomed) {
      document.documentElement.style.fontSize = '125%';
      if (sign) sign.textContent = '\u2212';
      if (btn) btn.classList.add('is-zoomed');
      localStorage.setItem(STORAGE_KEY, '1');
    } else {
      document.documentElement.style.fontSize = '';
      if (sign) sign.textContent = '+';
      if (btn) btn.classList.remove('is-zoomed');
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function init() {
    btn = document.getElementById('zoom-toggle');
    if (!btn) return;
    sign = btn.querySelector('.zoom-btn__sign');

    // Restore zoom preference from localStorage
    if (localStorage.getItem(STORAGE_KEY) === '1') {
      applyZoom(true);
    }

    btn.addEventListener('click', function () { applyZoom(!isZoomed); });
  }

  return { init: init };
})();

/* ===== Module 10: PhotoShare ===== */
// @MX:NOTE: [AUTO] Web Share API + Kakao Share SDK 폴백 구현 모듈 (SPEC-SHARE-001)
// @MX:SPEC: SPEC-SHARE-001
var PhotoShare = (function () {
  'use strict';

  // 사이트 기본 URL (단일 관리)
  var BASE_URL = 'https://songhongseob.github.io/friend-wedding/';

  var _resizedBlobs = [];
  var _modal = null;
  var _previewImg = null;
  var _shareBtn = null;
  var _kakaoShareBtn = null;
  var _input = null;
  var _historyPushed = false;
  var _savedScrollY = 0;

  // Kakao Share SDK 초기화 (REQ-SHARE-009)
  function initKakaoSDK() {
    if (typeof Kakao === 'undefined') return;
    if (!Kakao.isInitialized()) {
      Kakao.init('ee2826711b4264015800d17421300f05');
    }
  }

  // 이미지 리사이즈: Canvas API로 최대 1920px, JPEG 0.85 (REQ-SHARE-002)
  function resizeImage(file, callback) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        var MAX = 1920;
        var w = img.naturalWidth;
        var h = img.naturalHeight;
        if (w > MAX || h > MAX) {
          var ratio = Math.min(MAX / w, MAX / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        if (!ctx) { callback(null); return; }
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(function (blob) {
          callback(blob);
        }, 'image/jpeg', 0.85);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // 미리보기 모달 열기 - 다중 사진 지원 (REQ-SHARE-003)
  function openPreviewModal(blobs) {
    // 이전 Object URL이 있으면 먼저 해제 (메모리 누수 방지)
    if (_previewImg.src) {
      URL.revokeObjectURL(_previewImg.src);
    }
    _resizedBlobs = blobs;
    var url = URL.createObjectURL(blobs[0]);
    _previewImg.src = url;

    // 카운트 배지: 2장 이상일 때 표시
    var countBadge = document.getElementById('photo-count-badge');
    if (countBadge) {
      if (blobs.length > 1) {
        countBadge.textContent = blobs.length + '장 선택됨';
        countBadge.hidden = false;
      } else {
        countBadge.hidden = true;
      }
    }

    // 공유하기 버튼만 표시 (Web Share API 파일 공유 → 미지원 시 링크 공유로 폴백)
    _shareBtn.hidden = false;
    _kakaoShareBtn.hidden = true;

    // 스크롤 잠금 (기존 GuestBook 패턴 재사용)
    _savedScrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + _savedScrollY + 'px';
    document.body.style.width = '100%';

    _modal.hidden = false;

    // Android 뒤로가기 처리
    if (!_historyPushed) {
      history.pushState({ photoPreview: true }, '');
      _historyPushed = true;
    }
  }

  // 미리보기 모달 닫기 (REQ-SHARE-003)
  function closePreviewModal() {
    _modal.hidden = true;

    // 스크롤 잠금 해제
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo({ top: _savedScrollY, behavior: 'instant' });

    if (_previewImg.src) {
      URL.revokeObjectURL(_previewImg.src);
      _previewImg.src = '';
    }
    _resizedBlobs = [];
    _historyPushed = false;
  }

  // Web Share API 공유: 다중 파일 지원, 미지원 시 링크 공유로 폴백
  function shareViaWebAPI() {
    if (!_resizedBlobs || _resizedBlobs.length === 0) return;
    if (!navigator.canShare) { shareViaNative(); return; }

    try {
      var files = _resizedBlobs.map(function (blob, i) {
        return new File([blob], 'wedding-photo-' + (i + 1) + '.jpg', { type: 'image/jpeg' });
      });

      if (!navigator.canShare({ files: files })) { shareViaNative(); return; }

      navigator.share({
        files: files,
        title: '박상우 ♥ 박재은 결혼합니다',
        text: '박상우 ♥ 박재은 결혼식 스냅샷을 보냅니다.'
      }).catch(function (err) {
        if (err && err.name !== 'AbortError') {
          shareViaNative();
        }
      });
    } catch (e) {
      // File 생성 실패 등 예외 처리
      shareViaNative();
    }
  }

  // @MX:NOTE: [AUTO] REQ-SHARE-008 폴백 체인의 중간 단계: Kakao SDK 실패 시 Web Share API 시도, 미지원 시 클립보드로 최종 폴백
  // Web Share API로 공유 (카카오톡 포함 네이티브 공유 시트) - Kakao SDK 불가 시 폴백
  function shareViaNative() {
    if (navigator.share) {
      navigator.share({
        title: '박상우 ♥ 박재은 결혼합니다',
        text: '2026년 11월 15일 일요일 오후 2시, 루클라비더화이트에서 두 사람이 하나가 됩니다.',
        url: BASE_URL
      }).catch(function (e) {
        if (e.name !== 'AbortError') copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  }

  // Kakao Share SDK → Web Share API → 클립보드 순서로 공유 시도 (REQ-SHARE-008)
  function shareViaKakao() {
    if (typeof Kakao === 'undefined' || !Kakao.Share) {
      shareViaNative();
      return;
    }
    try {
      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '박상우 ♥ 박재은 결혼합니다',
          description: '2026년 11월 15일 일요일 오후 2시, 루클라비더화이트에서 두 사람이 하나가 됩니다.',
          imageUrl: BASE_URL + 'assets/images/couple-main.jpg',
          link: {
            mobileWebUrl: BASE_URL,
            webUrl: BASE_URL
          }
        },
        buttons: [{
          title: '청첩장 보기',
          link: {
            mobileWebUrl: BASE_URL,
            webUrl: BASE_URL
          }
        }]
      });
    } catch (e) {
      // Kakao SDK 실패(도메인 미등록 등) 시 네이티브 공유로 폴백
      shareViaNative();
    }
  }

  // 클립보드 복사 폴백 (REQ-SHARE-010)
  function copyToClipboard() {
    var url = BASE_URL;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        showToast('링크가 복사되었습니다', 3000);
      }).catch(function () {
        fallbackCopy(url);
      });
    } else {
      fallbackCopy(url);
    }
  }

  function fallbackCopy(url) {
    var ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showToast('링크가 복사되었습니다', 3000);
    } catch (e) {
      showToast('링크를 복사할 수 없습니다', 3000);
    }
    document.body.removeChild(ta);
  }

  // 카메라/갤러리 트리거 (REQ-SHARE-001)
  function triggerCamera() {
    _resizedBlobs = []; // 이전 선택 Blob 초기화
    _input.value = '';
    _input.click();
  }

  // 파일 선택 핸들러 - 다중 선택 지원 (REQ-SHARE-002, REQ-SHARE-007)
  function handleFileSelect(e) {
    var MAX_SIZE = 20 * 1024 * 1024; // 20MB per file
    var MAX_FILES = 10;              // 최대 10장
    var rawFiles = Array.from(e.target.files || []);
    var files = rawFiles.filter(function (f) {
      return f.type.startsWith('image/') && f.size <= MAX_SIZE;
    }).slice(0, MAX_FILES);

    if (files.length === 0) {
      var total = rawFiles.length;
      if (total > MAX_FILES) {
        showToast('최대 ' + MAX_FILES + '장까지 선택할 수 있습니다', 3000);
      } else {
        showToast(total > 0 ? '이미지 파일만 선택해주세요 (최대 20MB)' : '파일이 선택되지 않았습니다', 3000);
      }
      return;
    }

    // 10장 초과 선택 시 안내 (일부는 처리)
    if (rawFiles.length > MAX_FILES) {
      showToast('최대 ' + MAX_FILES + '장만 처리합니다', 2000);
    }

    // 모든 파일을 순서 유지하며 리사이즈
    var results = new Array(files.length);
    var done = 0;
    files.forEach(function (file, i) {
      resizeImage(file, function (blob) {
        results[i] = blob;
        done++;
        if (done === files.length) {
          var blobs = results.filter(Boolean);
          if (blobs.length === 0) {
            showToast('이미지 처리에 실패했습니다', 3000);
            return;
          }
          if (blobs.length < files.length) {
            showToast((files.length - blobs.length) + '장을 처리하지 못했습니다', 2000);
          }
          openPreviewModal(blobs);
        }
      });
    });
  }

  function init() {
    _modal = document.getElementById('photo-preview-modal');
    if (!_modal) return; // DOM 없으면 조기 종료 (중복 init 방지)

    _previewImg = document.getElementById('photo-preview-img');
    _shareBtn = document.getElementById('photo-share-btn');
    _kakaoShareBtn = document.getElementById('photo-kakao-share-btn');
    _input = document.getElementById('photo-input');
    var cameraBtn = document.getElementById('share-camera-btn');
    var kakaoDirectBtn = document.getElementById('share-kakao-btn');

    if (!_input || !cameraBtn) return;

    initKakaoSDK();

    // 카메라 버튼 이벤트
    cameraBtn.addEventListener('click', triggerCamera);

    // 직접 카카오 공유 버튼 → 사진 선택 후 공유하는 플로우로 진입
    if (kakaoDirectBtn) {
      kakaoDirectBtn.addEventListener('click', triggerCamera);
    }

    // 파일 선택 이벤트
    _input.addEventListener('change', handleFileSelect);

    // 미리보기 모달 공유 버튼
    _shareBtn.addEventListener('click', shareViaWebAPI);
    _kakaoShareBtn.addEventListener('click', shareViaKakao);

    // 닫기 버튼
    var closeBtn = _modal.querySelector('.photo-preview__close');
    if (closeBtn) closeBtn.addEventListener('click', closePreviewModal);

    // 배경 클릭으로 닫기
    var backdrop = _modal.querySelector('.photo-preview__backdrop');
    if (backdrop) backdrop.addEventListener('click', closePreviewModal);

    // Android 뒤로가기 처리 (REQ-SHARE-003) - _historyPushed는 closePreviewModal에서 리셋
    window.addEventListener('popstate', function () {
      if (!_modal.hidden) {
        closePreviewModal();
      }
    });
  }

  return { init: init };
})();

/* ===== DOMContentLoaded Init ===== */
document.addEventListener('DOMContentLoaded', function () {
  ScrollReveal.init();
  ZoomController.init();
  AudioPlayer.init();
  Lightbox.init();
  Gallery.init();
  Countdown.init();
  CalendarWidget.init();
  AccountCopy.init();
  Collapsible.init();
  GuestBook.init();
  PhotoShare.init();
  initKakaoMap();
  initNaverMap();
});
