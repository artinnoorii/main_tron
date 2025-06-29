const tg = window.Telegram.WebApp;
tg.ready();

// درخواست خودکار موجودی هنگام لود
tg.sendData(JSON.stringify({
    type: 'get_balance',
    user_id: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id : null
}));

// دریافت پاسخ از ربات
tg.onEvent('web_app_data', data => {
    try {
        const response = JSON.parse(data);
        document.getElementById('toman-balance').textContent = `${response.toman_balance.toLocaleString('fa-IR')} تومان`;
        document.getElementById('trx-balance').textContent = `${response.trx_balance.toFixed(2)} TRX`;
    } catch (e) {
        console.error('Error processing web app data:', e);
        document.getElementById('toman-balance').textContent = 'خطا در بارگذاری';
        document.getElementById('trx-balance').textContent = 'خطا در بارگذاری';
    }
});

// تنظیمات Canvas برای انیمیشن لوگوها
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
        this.speedX = (Math.random() - 0.5) * 2; // حرکت تصادفی با سرعت کم
        this.speedY = (Math.random() - 0.5) * 2;
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
        ctx.fillStyle = '#ff0033'; // دایره قرمز به جای لوگوی ترون
        ctx.fill();
        ctx.closePath();
    }
}

function animateLogos() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (logos.length < 20) {
        logos.push(new Logo());
    }
    logos.forEach(logo => {
        logo.update();
        logo.draw();
    });
    requestAnimationFrame(animateLogos);
}

animateLogos();

// انیمیشن کلیک روی مستطیل
const balanceBox = document.querySelector('.balance-box');
if (balanceBox) {
    const glowBar = document.createElement('div');
    glowBar.className = 'glow-bar';
    balanceBox.appendChild(glowBar);

    const glowBarClick = document.createElement('div');
    glowBarClick.className = 'glow-bar-click';
    balanceBox.appendChild(glowBarClick);

    balanceBox.addEventListener('click', () => {
        glowBarClick.style.animation = 'glow-click 2s ease-in-out';
        setTimeout(() => {
            glowBarClick.style.animation = '';
            glowBar.style.animation = 'expand-bar 1s ease-in-out forwards, rotate-around-box 6s linear infinite';
        }, 2000);
    });

    // تنظیم موقعیت نوار نوری
    glowBar.style.left = '50%';
    glowBar.style.top = '50%';
}