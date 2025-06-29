const tg = window.Telegram.WebApp;
tg.ready();

// درخواست خودکار موجودی هنگام لود
if (tg.initDataUnsafe.user) {
    tg.sendData(JSON.stringify({
        type: 'get_balance',
        user_id: tg.initDataUnsafe.user.id
    }));
}

// دریافت پاسخ از ربات
tg.onEvent('web_app_data', (data) => {
    try {
        const response = JSON.parse(data);
        document.getElementById('toman-balance').textContent = `${response.toman_balance.toLocaleString('fa-IR')} تومان`;
        document.getElementById('trx-balance').textContent = `${response.trx_balance.toFixed(2)} TRX`;
    } catch (e) {
        console.error('Error processing Web App data:', e);
        document.getElementById('toman-balance').textContent = 'خطا در بارگذاری';
        document.getElementById('trx-balance').textContent = 'خطا در بارگذاری';
    }
});

// تنظیمات Canvas برای انیمیشن دایره‌ها
const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const logos = [];

class Logo {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 15; // اندازه دایره
        this.speedX = (Math.random() - 0.5) * 1.5; // سرعت کمتر برای حرکت نرم
        this.speedY = (Math.random() - 0.5) * 1.5;
    }

    update() {
        const box = document.querySelector('.balance-box');
        if (!box) return; // اگر مستطیل پیدا نشد، انیمیشن متوقف می‌شه
        const rect = box.getBoundingClientRect();
        const boxLeft = rect.left, boxRight = rect.right, boxTop = rect.top, boxBottom = rect.bottom;

        const nextX = this.x + this.speedX;
        const nextY = this.y + this.speedY;

        const isInsideBox = nextX > boxLeft && nextX < boxRight && nextY > boxTop && nextY < boxBottom;

        if (!isInsideBox) {
            this.x = nextX;
            this.y = nextY;
        }

        // برگشت به لبه‌ها در صورت خروج از صفحه
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0033'; // دایره قرمز
        ctx.fill();
        ctx.closePath();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (logos.length < 5) { // محدود به 5 دایره
        logos.push(new Logo());
    }
    logos.forEach(logo => {
        logo.update();
        logo.draw();
    });
    requestAnimationFrame(animate);
}

animate();

// انیمیشن کلیک روی مستطیل
const balanceBox = document.getElementById('balance-box');
const lightBar = document.getElementById('light-bar');

if (balanceBox && lightBar) {
    balanceBox.addEventListener('click', () => {
        lightBar.classList.add('pulse');
        setTimeout(() => {
            lightBar.classList.remove('pulse');
        }, 2000); // 2 ثانیه
    });
}