// داده‌های نمونه (باید با API یا دیتابیس واقعی جایگزین شود)
const tronBalance = 100; // مقدار فرضی TRX کاربر
const tronPrice = 5000; // قیمت فرضی TRX به تومان
const maxPriceToday = 5100; // بیشترین قیمت امروز
const minPriceToday = 4900; // کمترین قیمت امروز
const changePercentage = 0.05; // 0.05% تغییر

// محاسبه موجودی تومانی
const tomanBalance = tronBalance * tronPrice;

// نمایش در هدر
document.getElementById('tron-balance').textContent = `${tronBalance} TRX`;
document.getElementById('toman-balance').textContent = `${tomanBalance.toLocaleString()} تومان`;

// نمایش در لیست ارزها
document.getElementById('trx-value').textContent = `${tronBalance} TRX`;
document.getElementById('trx-change').textContent = `${changePercentage}%`;

// نمایش جزئیات قیمت
document.getElementById('max-price').textContent = `${maxPriceToday.toLocaleString()} تومان`;
document.getElementById('min-price').textContent = `${minPriceToday.toLocaleString()} تومان`;

// تابع برای نمایش/پنهان کردن جزئیات
function toggleDetails() {
  const details = document.getElementById('crypto-details');
  if (details.style.display === 'block') {
    details.style.display = 'none';
  } else {
    details.style.display = 'block';
  }
}