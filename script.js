const tg = window.Telegram.WebApp;
tg.ready();

// درخواست موجودی از ربات
tg.MainButton.setText('دریافت موجودی').show();
tg.MainButton.onClick(() => {
    tg.sendData(JSON.stringify({
        type: 'get_balance',
        user_id: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id : null
    }));
});

// تنظیمات Canvas برای انیمیشن
const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const logos = [];
const logoImg = new Image();
logoImg.src = 'tron_logo.png';

class Logo {
    constructor() {
        const edge = Math.floor(Math.random() * 4);
        const x = edge % 2 === 0 ? (edge === 0 ? 0 : canvas.width) : Math.random() * canvas.width;
        const y = edge % 2 === 0 ? Math.random() * canvas.height : (edge === 1 ? 0 : canvas.height);
        this.x = x;
        this.y = y;
        this.size = 30;
        this.speedX = (canvas.width / 2 - x) / 100;
        this.speedY = (canvas.height / 2 - y) / 100;
    }

    update() {
        const box = document.querySelector('.balance-box').getBoundingClientRect();
        const boxLeft = box.left, boxRight = box.right, boxTop = box.top, boxBottom = box.bottom;

        const nextX = this.x + this.speedX;
        const nextY = this.y + this.speedY;

        const isInsideBox = nextX > boxLeft && nextX < boxRight && nextY > boxTop && nextY < boxBottom;

        if (!isInsideBox) {
            this.x = nextX;
            this.y = nextY;
        }

        if (Math.abs(this.x - canvas.width / 2) < 10 && Math.abs(this.y - canvas.height / 2) < 10) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speedX = (canvas.width / 2 - this.x) / 100;
            this.speedY = (canvas.height / 2 - this.y) / 100;
        }
    }

    draw() {
        ctx.drawImage(logoImg, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (logos.length < 20) {
        logos.push(new Logo());
    }
    logos.forEach(logo => {
        logo.update();
        logo.draw();
    });
    requestAnimationFrame(animate);
}

logoImg.onload = () => animate();