// نمونه داده‌ها (با API واقعی جایگزین کن)
const tronBalance = 100; // موجودی TRX کاربر
const tronPrice = 5000; // قیمت TRX به تومان

// محاسبه موجودی تومانی
const tomanBalance = tronBalance * tronPrice;

// آپدیت موجودی توی هدر
document.getElementById('tron-balance').textContent = `${tronBalance} TRX`;
document.getElementById('toman-balance').textContent = `${tomanBalance.toLocaleString()} تومان`;

// آپدیت مقدار TRX توی لیست ارزها
document.getElementById('trx-value').textContent = `${tronBalance} TRX`;