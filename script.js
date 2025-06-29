function updateBalance() {
  // داده‌های نمونه (باید با API یا دیتابیس واقعی جایگزین شود)
  let tronBalance = 10; // مقدار فرضی ترون کاربر
  let tronPrice = 6000; // قیمت فرضی ترون به تومان
  
  // محاسبه موجودی تومانی
  let tronValue = tronBalance * tronPrice;
  let totalBalance = tronValue;
  
  // نمایش در صفحه
  document.getElementById('total-balance').textContent = totalBalance.toLocaleString() + ' تومان';
  document.querySelector('.currency-item:nth-child(1)').textContent = `ترون: ${tronBalance} TRX`;
  document.querySelector('.currency-item:nth-child(2)').textContent = `تومان: ${totalBalance.toLocaleString()} تومان`;
}

// فراخوانی اولیه
updateBalance();

// به‌روزرسانی هر 10 ثانیه (برای تست)
setInterval(updateBalance, 10000);