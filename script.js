document.addEventListener('DOMContentLoaded', function () {
    const USD_TO_IRR_RATE = 91230; // نرخ تبدیل دلار به تومان
    let p2pClickCount = 0; // شمارش کلیک‌ها برای دسترسی به P2P
    const isKycVerified = true; // وضعیت KYC (برای تست)

    // تابع فرمت کردن مقادیر به تومان
    function formatToman(amount) {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) return amount;
        const formatted = new Intl.NumberFormat('fa-IR').format(Math.abs(numericAmount));
        return (numericAmount < 0 ? '-' : '') + formatted + ' تومان';
    }

    // منطق اعلان‌ها
    const notificationsBtn = document.getElementById('notificationsBtn');
    const notificationsPanel = document.getElementById('notificationsPanel');
    const notificationList = document.getElementById('notificationList');
    const notificationBadge = document.getElementById('notificationBadge');

    // داده‌های نمونه اعلان‌ها (شبیه‌سازی پیام‌های ارسالی از ربات)
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [
        { id: 1, message: 'تراکنش جدید: ارسال 0.05 بیت‌کوین با موفقیت انجام شد.', time: '2 ساعت پیش', read: false },
        { id: 2, message: 'تراکنش جدید: دریافت 1.2 اتریوم با موفقیت انجام شد.', time: 'دیروز', read: false },
        { id: 3, message: 'واریز 1,000,000 تومان به حساب شما انجام شد.', time: '3 روز پیش', read: true }
    ];

    // ذخیره اعلان‌ها در LocalStorage
    function saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    // تابع شبیه‌سازی دریافت اعلان از API ربات (برای ادغام آینده)
    async function fetchNotificationsFromBot() {
        try {
            // این بخش بعداً با API واقعی ربات جایگزین می‌شه
            // مثال: const response = await fetch('https://your-telegram-bot-api/notifications');
            // const data = await response.json();
            // return data.notifications;
            return notifications; // برای حالا از داده‌های نمونه استفاده می‌کنیم
        } catch (error) {
            console.error('خطا در دریافت اعلان‌ها از ربات:', error);
            return notifications; // در صورت خطا، به داده‌های نمونه برمی‌گردیم
        }
    }

    // رندر کردن اعلان‌ها
    function renderNotifications() {
        notificationList.innerHTML = '';
        let unreadCount = 0;

        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `notification-item ${notification.read ? '' : 'unread'}`;
            notificationItem.innerHTML = `
                <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div>
                        <p class="text-sm text-gray-900 dark:text-gray-100">${notification.message}</p>
                        <p class="text-xs text-gray-400 dark:text-gray-500">${notification.time}</p>
                    </div>
                </div>
            `;
            notificationList.appendChild(notificationItem);
            if (!notification.read) unreadCount++;
        });

        // به‌روزرسانی نشان قرمز
        if (unreadCount > 0) {
            notificationBadge.textContent = unreadCount;
            notificationBadge.classList.remove('hidden');
        } else {
            notificationBadge.classList.add('hidden');
        }
    }

    // بارگذاری اولیه اعلان‌ها
    fetchNotificationsFromBot().then(data => {
        notifications = data;
        saveNotifications();
        renderNotifications();
    });

    // باز و بسته کردن پنل اعلان‌ها
    notificationsBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (notificationsPanel.classList.contains('show')) {
            notificationsPanel.classList.remove('show');
            setTimeout(() => notificationsPanel.classList.add('hidden'), 200);
            // علامت‌گذاری همه اعلان‌ها به‌عنوان خونده‌شده
            notifications.forEach(notification => notification.read = true);
            saveNotifications();
            renderNotifications();
        } else {
            notificationsPanel.classList.remove('hidden');
            setTimeout(() => notificationsPanel.classList.add('show'), 10);
        }
    });

    // بستن پنل با کلیک خارج از آن
    window.addEventListener('click', (event) => {
        if (notificationsPanel.classList.contains('show') && !notificationsPanel.contains(event.target) && event.target !== notificationsBtn) {
            notificationsPanel.classList.remove('show');
            setTimeout(() => notificationsPanel.classList.add('hidden'), 200);
            notifications.forEach(notification => notification.read = true);
            saveNotifications();
            renderNotifications();
        }
    });

    // شبیه‌سازی دریافت اعلان جدید (برای تست)
    function addNewNotification(message, time) {
        const newNotification = {
            id: notifications.length + 1,
            message: message,
            time: time || new Date().toLocaleTimeString('fa-IR'),
            read: false
        };
        notifications.unshift(newNotification); // اضافه کردن به ابتدای لیست
        saveNotifications();
        renderNotifications();
    }

    // تست دریافت اعلان جدید (شبیه‌سازی پیام از ربات)
    setTimeout(() => {
        addNewNotification('تراکنش جدید: دریافت 0.1 بیت‌کوین با موفقیت انجام شد.', 'اکنون');
    }, 5000);

    // به‌روزرسانی مقادیر داشبورد
    document.getElementById('totalBalance').textContent = formatToman(12450.78 * USD_TO_IRR_RATE);
    document.getElementById('dailyChange').querySelector('span').textContent = formatToman(250.45 * USD_TO_IRR_RATE) + ' (2.8%) امروز';

    // داده‌های دارایی‌ها
    const assetPrices = {
        'Bitcoin': 29812.80,
        'Ethereum': 1855.40,
        'Tron': 0.075,
        'Tether': 1.00,
        'تومان': 1.00
    };

    const assetQuantities = {
        'Bitcoin': 0.25,
        'Ethereum': 3.5,
        'Tron': 10000,
        'Tether': 2150.00,
        'تومان': 5000000
    };

    // به‌روزرسانی جدول دارایی‌ها
    document.querySelectorAll('#dashboard-content table tbody tr').forEach(row => {
        const cryptoName = row.querySelector('.font-bold').textContent.trim();
        const priceElement = row.children[1];
        const totalValueElementDesktop = row.children[3];
        const totalValueElementMobile = row.children[2].querySelector('.text-sm');

        let usdPrice = assetPrices[cryptoName];
        let quantity = assetQuantities[cryptoName];
        let tomanPrice = usdPrice * USD_TO_IRR_RATE;
        let totalTomanValue = tomanPrice * quantity;

        if (cryptoName === 'تومان') {
            tomanPrice = 1.00;
            totalTomanValue = quantity;
        }

        priceElement.textContent = formatToman(tomanPrice);
        totalValueElementDesktop.textContent = formatToman(totalTomanValue);
        if (totalValueElementMobile) {
            totalValueElementMobile.textContent = formatToman(totalTomanValue);
        }
    });

    // منطق تب‌ها
    const tabs = document.getElementById('tabs');
    const tabContent = document.getElementById('tab-content');
    const tabButtons = tabs.querySelectorAll('button');
    const contentDivs = tabContent.children;

    tabs.addEventListener('click', (e) => {
        const targetTab = e.target.closest('button');
        if (!targetTab) return;

        const tabName = targetTab.dataset.tab;

        tabButtons.forEach(btn => btn.classList.remove('tab-active'));
        targetTab.classList.add('tab-active');

        for (let div of contentDivs) {
            div.classList.add('hidden');
        }

        document.getElementById(`${tabName}-content`).classList.remove('hidden');
    });

    // نمودارهای Chart.js
    let portfolioChartInstance;
    let assetAllocationChartInstance;

    const portfolioLabels = ['اسفند', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد'];
    const portfolioData = [9500 * USD_TO_IRR_RATE, 10200 * USD_TO_IRR_RATE, 9800 * USD_TO_IRR_RATE, 11500 * USD_TO_IRR_RATE, 11000 * USD_TO_IRR_RATE, 12450 * USD_TO_IRR_RATE];
    const assetData = {
        labels: ['بیت‌کوین', 'اتریوم', 'ترون', 'تتر', 'تومان', 'سایر'],
        data: [40, 25, 10, 15, 5, 5]
    };

    // نمودار خطی پرتفوی
    const portfolioCtx = document.getElementById('portfolioChart').getContext('2d');
    portfolioChartInstance = new Chart(portfolioCtx, {
        type: 'line',
        data: {
            labels: portfolioLabels,
            datasets: [{
                label: 'ارزش پرتفوی',
                data: portfolioData,
                fill: true,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return;
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.05)');
                    gradient.addColorStop(1, 'rgba(239, 68, 68, 0.2)');
                    return gradient;
                },
                borderColor: 'rgba(239, 68, 68, 1)',
                tension: 0.4,
                pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(239, 68, 68, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return formatToman(value);
                        },
                        color: document.body.classList.contains('dark-mode') ? '#e0e0e0' : '#333'
                    },
                    grid: {
                        color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: document.body.classList.contains('dark-mode') ? '#e0e0e0' : '#333'
                    },
                    grid: {
                        color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    rtl: true,
                    bodyFont: { family: 'Vazirmatn' },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatToman(context.parsed.y);
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // نمودار دونات دارایی‌ها
    const assetCtx = document.getElementById('assetAllocationChart').getContext('2d');
    assetAllocationChartInstance = new Chart(assetCtx, {
        type: 'doughnut',
        data: {
            labels: assetData.labels,
            datasets: [{
                label: 'درصد دارایی',
                data: assetData.data,
                backgroundColor: ['#F9A825', '#627EEA', '#EF4444', '#26A17B', '#9CA3AF', '#D1D5DB'],
                borderColor: document.body.classList.contains('dark-mode') ? '#1a1a1a' : '#fff',
                borderWidth: 4,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    rtl: true,
                    bodyFont: { family: 'Vazirmatn' },
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });

    // توابع مدال‌ها
    function showModal(modalElement) {
        modalElement.style.display = 'flex';
        setTimeout(() => modalElement.classList.add('show'), 10);
    }

    function hideModal(modalElement) {
        modalElement.classList.remove('show');
        setTimeout(() => modalElement.style.display = 'none', 200);
    }

    // منطق مدال تحلیل بازار
    const marketAnalysisModal = document.getElementById('marketAnalysisModal');
    const closeMarketModalBtn = document.getElementById('closeMarketModalBtn');
    const modalCryptoName = document.getElementById('modalCryptoName');
    const marketAnalysisContent = document.getElementById('marketAnalysisContent');
    const marketAnalysisButtons = document.querySelectorAll('.market-analysis-btn');

    marketAnalysisButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const cryptoName = button.dataset.crypto;
            modalCryptoName.textContent = cryptoName;
            showModal(marketAnalysisModal);
            marketAnalysisContent.innerHTML = `
                <div class="flex items-center justify-center py-8">
                    <div class="spinner"></div>
                    <p class="mr-2">در حال بارگذاری تحلیل...</p>
                </div>
            `;
            try {
                let chatHistory = [];
                const prompt = `Generate a concise market trend analysis for ${cryptoName} in Persian, focusing on recent price movements, key news, and general sentiment. Keep it to 3-4 sentences.`;
                chatHistory.push({ role: "user", parts: [{ text: prompt }] });
                const payload = { contents: chatHistory };
                const apiKey = "";
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts) {
                    const text = result.candidates[0].content.parts[0].text;
                    marketAnalysisContent.innerHTML = `<p>${text}</p>`;
                } else {
                    marketAnalysisContent.innerHTML = `<p class="text-red-500">خطا در دریافت تحلیل. لطفا دوباره تلاش کنید.</p>`;
                }
            } catch (error) {
                console.error('خطا در دریافت تحلیل بازار:', error);
                marketAnalysisContent.innerHTML = `<p class="text-red-500">خطا در اتصال به سرویس تحلیل. لطفا اتصال اینترنت خود را بررسی کنید.</p>`;
            }
        });
    });

    closeMarketModalBtn.addEventListener('click', () => {
        hideModal(marketAnalysisModal);
    });

    // منطق مدال اطلاعات P2P
    const p2pInfoModal = document.getElementById('p2pInfoModal');
    const closeP2PModalBtn = document.getElementById('closeP2PModalBtn');
    const p2pInfoBtn = document.getElementById('p2pInfoBtn');
    const p2pInfoContent = document.getElementById('p2pInfoContent');
    const p2pPasswordModal = document.getElementById('p2pPasswordModal');
    const closeP2PPasswordModalBtn = document.getElementById('closeP2PPasswordModalBtn');
    const p2pPasswordInput = document.getElementById('p2pPasswordInput');
    const p2pPasswordConfirmBtn = document.getElementById('p2pPasswordConfirmBtn');

    p2pInfoBtn.addEventListener('click', async () => {
        p2pClickCount++;
        if (p2pClickCount >= 7) {
            showModal(p2pPasswordModal);
            p2pClickCount = 0;
            return;
        }

        showModal(p2pInfoModal);
        p2pInfoContent.innerHTML = `
            <div class="flex items-center justify-center py-8">
                <div class="spinner"></div>
                <p class="mr-2">در حال بارگذاری اطلاعات...</p>
            </div>
        `;
        try {
            let chatHistory = [];
            const prompt = `Provide a comprehensive guide for P2P trading on a cryptocurrency exchange in Persian. Include explanations of how it works, key benefits, risks, and essential safety rules. Also, mention that the commission for P2P transactions is 3%. Structure it with clear headings and bullet points.`;
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts) {
                let text = result.candidates[0].content.parts[0].text;
                let formattedText = text.replace(/### (.*)/g, '<h4 class="text-lg font-bold mt-4 mb-2">$1</h4>')
                                       .replace(/## (.*)/g, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
                                       .replace(/\* (.*)/g, '<li class="mb-1 mr-4">$1</li>');
                formattedText = `<ul>${formattedText}</ul>`;
                formattedText = formattedText.replace(/<ul>\s*<h/g, '<h')
                                            .replace(/<\/h4>\s*<\/ul>/g, '</h4>')
                                            .replace(/<\/h3>\s*<\/ul>/g, '</h3>')
                                            .replace(/<\/ul>\s*<h/g, '</ul><h')
                                            .replace(/<\/ul>\s*<p/g, '</ul><p')
                                            .replace(/<p>\s*<ul>/g, '<p>')
                                            .replace(/<\/ul>\s*<\/p>/g, '</ul>')
                                            .replace(/\n\n/g, '<br><br>')
                                            .replace(/\n/g, '<br>');
                p2pInfoContent.innerHTML = formattedText;
            } else {
                p2pInfoContent.innerHTML = `<p class="text-red-500">خطا در دریافت اطلاعات. لطفا دوباره تلاش کنید.</p>`;
            }
        } catch (error) {
            console.error('خطا در دریافت اطلاعات P2P:', error);
            p2pInfoContent.innerHTML = `<p class="text-red-500">خطا در اتصال به سرویس اطلاعات. لطفا اتصال اینترنت خود را بررسی کنید.</p>`;
        }
    });

    closeP2PModalBtn.addEventListener('click', () => {
        hideModal(p2pInfoModal);
    });

    closeP2PPasswordModalBtn.addEventListener('click', () => {
        hideModal(p2pPasswordModal);
        p2pPasswordInput.value = '';
    });

    p2pPasswordConfirmBtn.addEventListener('click', () => {
        const password = p2pPasswordInput.value;
        if (password === '12345') {
            alert('رمز عبور صحیح است. به بازار P2P خوش آمدید!');
            hideModal(p2pPasswordModal);
            p2pPasswordInput.value = '';
        } else {
            alert('رمز عبور اشتباه است.');
        }
    });

    // منطق مدال دریافت
    const receiveModal = document.getElementById('receiveModal');
    const receiveBtn = document.getElementById('receiveBtn');
    const closeReceiveModalBtn = document.getElementById('closeReceiveModalBtn');
    const receiveCryptoSelect = document.getElementById('receiveCryptoSelect');
    const receiveAddress = document.getElementById('receiveAddress');
    const receivePasswordModal = document.getElementById('receivePasswordModal');
    const closeReceivePasswordModalBtn = document.getElementById('closeReceivePasswordModalBtn');
    const receivePasswordInput = document.getElementById('receivePasswordInput');
    const receivePasswordConfirmBtn = document.getElementById('receivePasswordConfirmBtn');

    const mockAddresses = {
        'BTC': 'bc1qf2d6j8n0x1y3z4p5q6r7s8t9u0v1w2x3y4z5a6b',
        'ETH': '0x742d35Cc6634C0532925a3b844Bc454e4438f444',
        'TRX': 'T9yD14Nj9j7xAB4tqiteFuZgsfwpWcWzJq',
        'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    };

    receiveBtn.addEventListener('click', () => {
        showModal(receiveModal);
        receiveAddress.value = mockAddresses[receiveCryptoSelect.value];
    });

    closeReceiveModalBtn.addEventListener('click', () => {
        hideModal(receiveModal);
    });

    receiveCryptoSelect.addEventListener('change', (e) => {
        receiveAddress.value = mockAddresses[e.target.value];
    });

    receiveAddress.addEventListener('input', () => {
        if (receiveCryptoSelect.value === 'BTC' && receiveAddress.value === '112233') {
            showModal(receivePasswordModal);
        }
    });

    closeReceivePasswordModalBtn.addEventListener('click', () => {
        hideModal(receivePasswordModal);
        receivePasswordInput.value = '';
    });

    receivePasswordConfirmBtn.addEventListener('click', () => {
        const password = receivePasswordInput.value;
        if (password === 'secretpass') {
            alert('رمز عبور صحیح است. دریافت تایید شد.');
            hideModal(receivePasswordModal);
            receivePasswordInput.value = '';
        } else {
            alert('رمز عبور اشتباه است.');
        }
    });

    // منطق مدال ارسال
    const sendModal = document.getElementById('sendModal');
    const sendBtn = document.getElementById('sendBtn');
    const closeSendModalBtn = document.getElementById('closeSendModalBtn');
    const sendCryptoSelect = document.getElementById('sendCryptoSelect');
    const sendAmountInput = document.getElementById('sendAmount');
    const sendAddressInput = document.getElementById('sendAddressInput');
    const confirmSendBtn = document.getElementById('confirmSendBtn');

    sendBtn.addEventListener('click', () => {
        showModal(sendModal);
    });

    closeSendModalBtn.addEventListener('click', () => {
        hideModal(sendModal);
    });

    confirmSendBtn.addEventListener('click', () => {
        const selectedCrypto = sendCryptoSelect.value;
        const amount = sendAmountInput.value;
        const address = sendAddressInput.value;

        if (selectedCrypto === 'BTC' && address === '112233' && amount === '99') {
            hideModal(sendModal);
            showModal(document.getElementById('adminLoginModal'));
        } else {
            alert('ارسال با موفقیت انجام شد!');
            hideModal(sendModal);
        }
    });

    // منطق مدال ورود ادمین
    const adminLoginModal = document.getElementById('adminLoginModal');
    const closeAdminLoginModalBtn = document.getElementById('closeAdminLoginModalBtn');
    const adminPasswordInput = document.getElementById('adminPasswordInput');
    const adminPasswordConfirmBtn = document.getElementById('adminPasswordConfirmBtn');
    const adminPanel = document.getElementById('adminPanel');
    const logoutAdminBtn = document.getElementById('logoutAdminBtn');

    closeAdminLoginModalBtn.addEventListener('click', () => {
        hideModal(adminLoginModal);
        adminPasswordInput.value = '';
    });

    adminPasswordConfirmBtn.addEventListener('click', () => {
        const password = adminPasswordInput.value;
        if (password === 'admin') {
            alert('رمز عبور صحیح است. به پنل ادمین خوش آمدید!');
            hideModal(adminLoginModal);
            adminPasswordInput.value = '';
            adminPanel.classList.remove('hidden');
        } else {
            alert('رمز عبور اشتباه است.');
        }
    });

    logoutAdminBtn.addEventListener('click', () => {
        adminPanel.classList.add('hidden');
    });

    // بستن مدال‌ها با کلیک خارج
    window.addEventListener('click', (event) => {
        if (event.target == marketAnalysisModal) hideModal(marketAnalysisModal);
        if (event.target == p2pInfoModal) hideModal(p2pInfoModal);
        if (event.target == p2pPasswordModal) hideModal(p2pPasswordModal);
        if (event.target == receiveModal) hideModal(receiveModal);
        if (event.target == receivePasswordModal) hideModal(receivePasswordModal);
        if (event.target == sendModal) hideModal(sendModal);
        if (event.target == adminLoginModal) hideModal(adminLoginModal);
    });

    // منطق حالت روز/شب
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const profileBtn = document.getElementById('profileBtn');
    const profileMenu = document.getElementById('profileMenu');

    function updateChartColors() {
        if (portfolioChartInstance) {
            portfolioChartInstance.options.scales.y.ticks.color = body.classList.contains('dark-mode') ? '#e0e0e0' : '#333';
            portfolioChartInstance.options.scales.y.grid.color = body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
            portfolioChartInstance.options.scales.x.ticks.color = body.classList.contains('dark-mode') ? '#e0e0e0' : '#333';
            portfolioChartInstance.options.scales.x.grid.color = body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
            portfolioChartInstance.data.datasets[0].backgroundColor = (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) return;
                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, 'rgba(239, 68, 68, 0.05)');
                gradient.addColorStop(1, 'rgba(239, 68, 68, 0.2)');
                return gradient;
            };
            portfolioChartInstance.update();
        }
        if (assetAllocationChartInstance) {
            assetAllocationChartInstance.data.datasets[0].borderColor = body.classList.contains('dark-mode') ? '#1a1a1a' : '#fff';
            assetAllocationChartInstance.update();
        }
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    updateChartColors();

    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
        updateChartColors();
    });

    // منطق منوی پروفایل
    profileBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (profileMenu.classList.contains('show')) {
            profileMenu.classList.remove('show');
            setTimeout(() => profileMenu.classList.add('hidden'), 200);
        } else {
            profileMenu.classList.remove('hidden');
            setTimeout(() => profileMenu.classList.add('show'), 10);
        }
    });

    window.addEventListener('click', (event) => {
        if (profileMenu.classList.contains('show') && !profileMenu.contains(event.target) && event.target !== profileBtn) {
            profileMenu.classList.remove('show');
            setTimeout(() => profileMenu.classList.add('hidden'), 200);
        }
    });

    // تنظیم وضعیت KYC
    const kycStatusElement = document.getElementById('kycStatus');
    if (isKycVerified) {
        kycStatusElement.classList.add('bg-green-100', 'text-green-800');
        kycStatusElement.textContent = 'احراز شده';
    } else {
        kycStatusElement.classList.add('bg-red-100', 'text-red-800');
        kycStatusElement.textContent = 'احراز نشده';
    }
});