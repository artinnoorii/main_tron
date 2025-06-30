// گرفتن اطلاعات از API ربات (باید URL واقعی رو جایگزین کنی)
function loadData() {
  fetch('/api/user-data')
    .then(response => response.json())
    .then(data => {
      const tronValue = data.tronBalance * data.tronPrice;
      const totalAmount = tronValue + data.tomanBalance;
      document.getElementById('total-amount').textContent = totalAmount.toLocaleString();

      document.getElementById('tron-amount').textContent = `${tronValue.toLocaleString()} تومان`;
      document.getElementById('tron-value').textContent = `${data.tronBalance} TRX`;
      document.getElementById('tron-price').textContent = `${data.tronPrice.toLocaleString()} تومان`;
      document.getElementById('tron-change').textContent = (data.changeAmount > 0 ? '+' : '') + `${data.changeAmount} تومان`;
      document.getElementById('tron-change').className = 'change ' + (data.changeAmount > 0 ? 'green' : 'red');

      document.getElementById('toman-amount').textContent = `${data.tomanBalance.toLocaleString()} تومان`;
      document.getElementById('toman-change').textContent = '0 تومان';

      document.getElementById('max-price').textContent = `${data.maxPriceToday.toLocaleString()} تومان`;
      document.getElementById('min-price').textContent = `${data.minPriceToday.toLocaleString()} تومان`;
    })
    .catch(error => console.error('خطا در بارگذاری داده‌ها:', error));
}

// تابع برای نمایش/پنهان کردن جزئیات ترون
function toggleDetails() {
  const details = document.getElementById('crypto-details');
  if (details.style.display === 'block') {
    details.style.animation = 'slideUp 0.5s forwards';
    setTimeout(() => details.style.display = 'none', 500);
  } else {
    details.style.display = 'block';
    details.style.animation = 'slideDown 0.5s';
  }
}

// تابع برای نمایش بخش‌های مختلف منو
function showSection(section) {
  const walletSection = document.getElementById('wallet-section');
  const referralSection = document.getElementById('referral-section');
  const menuBar = document.querySelector('.menu-bar');
  if (section === 'wallet') {
    walletSection.style.display = 'block';
    referralSection.style.display = 'none';
    menuBar.classList.remove('clicked');
  } else if (section === 'referral') {
    walletSection.style.display = 'none';
    referralSection.style.display = 'block';
    document.querySelector('.referral-welcome').style.display = 'block';
    document.querySelector('.referral-rules-container').style.display = 'none';
    document.querySelector('.timer-section').style.display = 'none';
    document.getElementById('thank-you').style.display = 'none';
    const timer = sessionStorage.getItem('referralTimer');
    if (timer && parseInt(timer) > 0) {
      document.querySelector('.timer-section').style.display = 'block';
      document.querySelector('.referral-welcome').style.display = 'none';
      document.querySelector('.referral-rules-container').style.display = 'none';
    }
    menuBar.classList.add('clicked');
  }
}

let timerInterval;
function startReferralProcess() {
  const timerSection = document.querySelector('.timer-section');
  const thankYou = document.getElementById('thank-you');
  timerSection.style.display = 'block';
  document.querySelector('.referral-rules-container').style.display = 'none';

  let timeLeft = sessionStorage.getItem('referralTimer');
  if (!timeLeft) timeLeft = 10 * 60; // 10 دقیقه به ثانیه
  else timeLeft = parseInt(timeLeft);

  const timerValue = document.getElementById('timer-value');
  clearInterval(timerInterval); // پاک کردن تایمر قبلی
  timerInterval = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerValue.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    sessionStorage.setItem('referralTimer', timeLeft); // ذخیره تایمر
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      timerSection.style.display = 'none';
      showNotification('رفرال با موفقیت فعال شد!', true);
      sessionStorage.removeItem('referralTimer');
    }
  }, 1000);
}

function showReferralRules() {
  document.querySelector('.referral-welcome').style.display = 'none';
  document.querySelector('.referral-rules-container').style.display = 'block';
}

function showNotification(message, isConfirm = false) {
  const notification = isConfirm ? document.getElementById('confirm-notification') : document.getElementById('notification');
  notification.textContent = message;
  notification.style.display = 'block';

  let startX;
  const handleDrag = (e) => {
    if (e.type === 'touchmove') startX = e.touches[0].clientX;
    else startX = e.clientX;
    const moveHandler = (moveEvent) => {
      const currentX = moveEvent.type === 'touchmove' ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const diff = currentX - startX;
      if (Math.abs(diff) > 50) {
        notification.classList.add('dragging');
        setTimeout(() => notification.style.display = 'none', 300);
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('touchmove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
        document.removeEventListener('touchend', upHandler);
      }
    };
    const upHandler = () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('touchmove', moveHandler);
    };

    notification.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', upHandler);
    });

    notification.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      document.addEventListener('touchmove', moveHandler);
      document.addEventListener('touchend', upHandler);
    });

    setTimeout(() => {
      if (notification.style.display !== 'none') notification.style.display = 'none';
    }, 5000);
  };

  handleDrag({ type: 'init' });
}

function acceptReferral() {
  startReferralProcess();
  showNotification('تأیید شد! منتظر فعال‌سازی باشید.', true);
}

function declineReferral() {
  showNotification('رفرال‌گیری فعال نشد');
  const thankYou = document.getElementById('thank-you');
  thankYou.style.display = 'block';
  setTimeout(() => {
    thankYou.style.display = 'none';
    showSection('wallet');
  }, 3000);
}

// بارگذاری اولیه داده‌ها
loadData();
setInterval(loadData, 10000); // به‌روزرسانی هر 10 ثانیه

// چک کردن تایمر ذخیره‌شده
if (sessionStorage.getItem('referralTimer')) {
  startReferralProcess();
}