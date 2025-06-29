// داده‌های نمونه (باید با API یا دیتابیس واقعی جایگزین شود)
const tronBalance = 100; // مقدار فرضی TRX کاربر
const tronPrice = 5000; // قیمت فرضی TRX به تومان

// محاسبه موجودی تومانی
const tomanBalance = tronBalance * tronPrice;

// نمایش در هدر
document.getElementById('tron-balance').textContent = `${tronBalance} TRX`;
document.getElementById('toman-balance').textContent = `${tomanBalance.toLocaleString()} تومان`;

// نمایش در لیست ارزها
document.getElementById('trx-value').textContent = `${tronBalance} TRX`;

// فرض می‌کنیم تغییر قیمت را هم داریم
const changePercentage = 0.05; // 0.05% تغییر
document.getElementById('trx-change').textContent = `${changePercentage}%`;