// تنظیم ورودی ID کاربر (برنامه‌نویس باید این مقدار رو از API ربات بگیره)
let userId = '12345'; // نمونه، باید از API جایگزین بشه

// بارگذاری داده‌ها از API ربات
function loadData() {
  fetch('/api/user-data')
    .then(response => response.json())
    .then(data => {
      userId = data.userId || userId; // به‌روزرسانی ID کاربر
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

// نمایش/پنهان کردن جزئیات ترون
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

// نمایش بخش‌های مختلف منو
function showSection(section) {
  const walletSection = document.getElementById('wallet-section');
  const referralSection = document.getElementById('referral-section');
  const profileSection = document.getElementById('profile-section');
  const menuBar = document.querySelector('.menu-bar');
  if (section === 'wallet') {
    walletSection.style.display = 'block';
    referralSection.style.display = 'none';
    profileSection.style.display = 'none';
    menuBar.classList.remove('clicked');
  } else if (section === 'referral') {
    walletSection.style.display = 'none';
    referralSection.style.display = 'block';
    profileSection.style.display = 'none';
    const isConfirmed = sessionStorage.getItem('referralConfirmed');
    if (isConfirmed === 'true') {
      document.querySelector('.referral-confirmation').style.display = 'block';
      document.querySelector('.referral-welcome').style.display = 'none';
      document.querySelector('.referral-rules-container').style.display = 'none';
    } else {
      document.querySelector('.referral-welcome').style.display = 'block';
      document.querySelector('.referral-rules-container').style.display = 'none';
      document.querySelector('.referral-confirmation').style.display = 'none';
    }
    menuBar.classList.add('clicked');
    setTimeout(() => menuBar.classList.remove('clicked'), 500);
  } else if (section === 'profile') {
    walletSection.style.display = 'none';
    referralSection.style.display = 'none';
    profileSection.style.display = 'block';
    menuBar.classList.add('clicked');
    setTimeout(() => menuBar.classList.remove('clicked'), 500);
  }
}

function showReferralRules() {
  document.querySelector('.referral-welcome').style.display = 'none';
  document.querySelector('.referral-rules-container').style.display = 'block';
}

function startReferralProcess() {
  const referralConfirmation = document.querySelector('.referral-confirmation');
  const thankYou = document.getElementById('thank-you');
  referralConfirmation.style.display = 'block';
  document.querySelector('.referral-rules-container').style.display = 'none';
  sessionStorage.setItem('referralConfirmed', 'true');
}

function copyLink() {
  const link = document.getElementById('referral-link').textContent;
  navigator.clipboard.writeText(link).then(() => {
    showNotification('لینک کپی شد!', true);
  });
}

function shareLink() {
  const link = document.getElementById('referral-link').textContent;
  window.open(`https://telegram.me/share/url?url=${encodeURIComponent(link)}`, '_blank');
}

function showNotification(message, isCopy = false) {
  const notification = isCopy ? document.getElementById('copy-notification') : (message.includes('فعال') ? document.getElementById('confirm-notification') : document.getElementById('notification'));
  notification.textContent = message;
  notification.style.display = 'block';
  notification.classList.remove('dragging', 'show');
  notification.style.transform = 'translateX(-50%)';
  notification.style.opacity = '1';

  let startX;
  const handleDrag = (e) => {
    if (e.type === 'touchmove') startX = e.touches[0].clientX;
    else startX = e.clientX;
    const moveHandler = (moveEvent) => {
      const currentX = moveEvent.type === 'touchmove' ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const diff = currentX - startX;
      if (Math.abs(diff) > 50) {
        notification.classList.add('show');
        setTimeout(() => notification.style.display = 'none', 500);
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
      if (notification.style.display !== 'none') {
        notification.classList.add('show');
        setTimeout(() => notification.style.display = 'none', 500);
      }
    }, 5000);
  };

  handleDrag({ type: 'init' });
}

function acceptReferral() {
  startReferralProcess();
  showNotification('تأیید شد! منتظر فعال‌سازی باشید.', false);
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

function closeGuidelines() {
  document.querySelector('.guidelines-section').style.display = 'none';
}

// بارگذاری اولیه داده‌ها
loadData();
setInterval(loadData, 10000); // به‌روزرسانی هر 10 ثانیه