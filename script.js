// گرفتن اطلاعات از API ربات (باید URL واقعی رو جایگزین کنی)
function loadData() {
  fetch('/api/user-data') // جایگزین با آدرس API رباتت
    .then(response => response.json())
    .then(data => {
      // نمایش موجودی کل
      const tronValue = data.tronBalance * data.tronPrice;
      const totalAmount = tronValue + data.tomanBalance;
      document.getElementById('total-amount').textContent = totalAmount.toLocaleString();

      // نمایش در کادر ترون
      document.getElementById('tron-amount').textContent = `${tronValue.toLocaleString()} تومان`;
      document.getElementById('tron-value').textContent = `${data.tronBalance} TRX`;
      document.getElementById('tron-price').textContent = `${data.tronPrice.toLocaleString()} تومان`;
      document.getElementById('tron-change').textContent = (data.changeAmount > 0 ? '+' : '') + `${data.changeAmount} تومان`;
      document.getElementById('tron-change').className = 'change ' + (data.changeAmount > 0 ? 'green' : 'red');

      // نمایش در کادر تومان
      document.getElementById('toman-amount').textContent = `${data.tomanBalance.toLocaleString()} تومان`;
      document.getElementById('toman-change').textContent = '0 تومان'; // تغییر برای تومان صفر فرض شده

      // نمایش جزئیات قیمت
      document.getElementById('max-price').textContent = `${data.maxPriceToday.toLocaleString()} تومان`;
      document.getElementById('min-price').textContent = `${data.minPriceToday.toLocaleString()} تومان`;

      // نمایش داده‌های رفرال
      document.getElementById('total-trx').textContent = `${data.totalTrx} TRX`;
      document.getElementById('referral-profit').textContent = `${data.referralProfit.toLocaleString()} تومان`;
      document.getElementById('referral-link').textContent = data.referralLink;
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
  if (section === 'wallet') {
    walletSection.style.display = 'block';
    referralSection.style.display = 'none';
  } else if (section === 'referral') {
    walletSection.style.display = 'none';
    referralSection.style.display = 'block';
  }
}

// تابع‌های رفرال (برای تعامل با کاربر)
function acceptReferral() {
  alert('قبول شد! لطفاً منتظر تأیید از ربات باشید.');
  // اینجا باید به API ربات برای تأیید رفرال متصل بشه
}

function declineReferral() {
  alert('لغو شد! می‌تونی بعداً برگردی.');
  showSection('wallet'); // برمی‌گرده به صفحه اصلی
}

// بارگذاری اولیه داده‌ها
loadData();
setInterval(loadData, 10000); // به‌روزرسانی هر 10 ثانیه