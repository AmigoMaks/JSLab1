// ==================== ЗАВДАННЯ 11.3 ====================
/**
 * Завантажити дані з кількох API
 * Використати успішні результати, логувати помилки
 */

function fetchAPI(url) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (url.includes('broken')) {
                reject(new Error(`API ${url} is down`));
            } else {
                resolve({ url, data: `Data from ${url}` });
            }
        }, Math.random() * 300);
    });
}

/**
 * @param {string[]} urls 
 * @returns {Promise<{successful: object[], failed: Error[]}>}
 */
async function fetchMultipleAPIs(urls) {
    const promises = urls.map(url => fetchAPI(url));
    const results = await Promise.allSettled(promises);

    const successful = [];
    const failed = [];

    results.forEach(result => {
        if (result.status === 'fulfilled') {
            successful.push(result.value);
        } else {
            failed.push(result.reason);
        }
    });

    return { successful, failed };
}

// Перевірка:
const apis = [
    'https://api1.com/data',
    'https://api2-broken.com/data',
    'https://api3.com/data',
    'https://api4-broken.com/data',
    'https://api5.com/data'
];

fetchMultipleAPIs(apis)
    .then(result => {
        console.log(' Тест 11.3:');
        console.log('  Successful:', result.successful.length);
        console.log('  Failed:', result.failed.length);
    });


// ==================== ЗАВДАННЯ 11.4 ====================
/**
 * Створіть систему моніторингу здоров'я серверів
 * Перевірте всі сервери і створіть звіт про їх статус
 */

function checkServerHealth(serverName, delay, shouldFail) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error(`${serverName} is down`));
            } else {
                resolve({
                    server: serverName,
                    status: 'healthy',
                    responseTime: delay
                });
            }
        }, delay);
    });
}

/**
 * @returns {Promise<{healthy: object[], unhealthy: object[], totalServers: number}>}
 */
async function monitorServers() {
    const servers = [
        { name: 'Server A', delay: 100, shouldFail: false },
        { name: 'Server B', delay: 300, shouldFail: true },
        { name: 'Server C', delay: 150, shouldFail: false },
        { name: 'Server D', delay: 500, shouldFail: true },
        { name: 'Server E', delay: 200, shouldFail: false }
    ];

    const promises = servers.map(s => checkServerHealth(s.name, s.delay, s.shouldFail));
    const results = await Promise.allSettled(promises);

    const healthy = [];
    const unhealthy = [];

    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            healthy.push(result.value);
        } else {
            unhealthy.push({
                server: servers[index].name,
                error: result.reason.message
            });
        }
    });

    return {
        healthy,
        unhealthy,
        totalServers: servers.length
    };
}

// Перевірка:
monitorServers()
    .then(report => {
        console.log(' Тест 11.4: Server Health Report');
        console.log('  Healthy:', report.healthy.length);
        console.log('  Unhealthy:', report.unhealthy.length);
        console.log('  Total:', report.totalServers);
    });



/**
 * ПИТАННЯ ДЛЯ САМОПЕРЕВІРКИ:
 * 
 * 1. Яка різниця між Promise.all() та Promise.allSettled()?
 * 2. Коли краще використовувати Promise.allSettled()?
 * 3. Який формат результату у Promise.allSettled()?
 * 4. Чи може Promise.allSettled() кинути помилку?
 * 5. Як обробити результати Promise.allSettled()?
 * 6. Чи виконуються всі проміси до кінця?
 */
