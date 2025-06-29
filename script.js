// داده‌های نمونه (باید با API یا دیتابیس واقعی جایگزین شود)
const tronBalance = 100; // مقدار فرضی TRX کاربر
const tomanBalanceUser = 50000; // مقدار فرضی تومان کاربر
const tronPrice = 23500; // قیمت فرضی TRX به تومان
const maxPriceToday = 24000; // بیشترین قیمت امروز
const minPriceToday = 23000; // کمترین قیمت امروز
const changeAmount = 100; // تغییر قیمت (مثبت یا منفی)

// محاسبه موجودی کل (ترون به تومان + موجودی تومانی)
const tronValue = tronBalance * tronPrice;
const totalAmount = tronValue + tomanBalanceUser;

// نمایش موجودی کل
document.getElementById('total-amount').textContent = totalAmount.toLocaleString();

// نمایش در کادر ترون
document.getElementById('tron-balance').textContent = `${tronBalance} TRX | ${tronPrice.toLocaleString()} تومان`;
document.getElementById('trx-price').textContent = `${tronPrice.toLocaleString()} تومان`;
document.getElementById('trx-change').textContent = (changeAmount > 0 ? '+' : '') + `${changeAmount} تومان`;
document.getElementById('trx-change').className = 'change ' + (changeAmount > 0 ? 'green' : 'red');

// نمایش در کادر تومان
document.getElementById('toman-price').textContent = `${tomanBalanceUser.toLocaleString()} تومان`;
document.getElementById('toman-change').textContent = '0 تومان'; // فرض می‌کنیم تغییر برای تومان صفره
document.getElementById('toman-user-balance').textContent = `${tomanBalanceUser.toLocaleString()} تومان`;

// نمایش جزئیات قیمت
document.getElementById('max-price').textContent = `${maxPriceToday.toLocaleString()} تومان`;
document.getElementById('min-price').textContent = `${minPriceToday.toLocaleString()} تومان`;

// تابع برای نمایش/پنهان کردن جزئیات با انیمیشن
function toggleDetails() {
  const details = document.getElementById('crypto-details');
  if (details.style.display === 'block') {
    details.style.animation = 'slideUp 0.5s ease-in-out forwards';
    setTimeout(() => {
      details.style.display = 'none';
    }, 500);
  } else {
    details.style.display = 'block';
    details.style.animation = 'slideDown 0.5s ease-in-out';
  }
}