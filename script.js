// نمونه اولیه برای محاسبه موجودی (باید با API یا داده واقعی جایگزین شود)
function updateBalance() {
  // داده‌های نمونه
  let tronBalance = 10; // مقدار فرضی ترون کاربر
  let tronPrice = 5000; // قیمت فرضی ترون به تومان
  
  // محاسبه موجودی تومانی
  let tronValue = tronBalance * tronPrice;
  let totalBalance = tronValue; // برای سادگی، فقط ترون را در نظر می‌گیریم
  
  // نمایش در صفحه
  document.getElementById('total-balance').textContent = totalBalance.toLocaleString() + ' تومان';
  document.querySelector('.currency-item:nth-child(1)').textContent = `ترون: ${tronBalance} TRX`;
  document.querySelector('.currency-item:nth-child(2)').textContent = `تومان: ${totalBalance.toLocaleString()} تومان`;
}

// فراخوانی اولیه
updateBalance();

// به‌روزرسانی هر 10 ثانیه (برای تست)
setInterval(updateBalance, 10000);