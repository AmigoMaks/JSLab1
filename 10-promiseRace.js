// ==================== ЗАВДАННЯ 10.1 ====================
/**
 * Створіть функцію, яка повертає найшвидшу відповідь
 * 
 * @param {number[]} delays - Масив затримок в мілісекундах
 * @returns {Promise<number>} - Найменша затримка
 */
function getFastestResponse(delays) {
    const promises = delays.map(delay => 
        new Promise(resolve => setTimeout(() => resolve(delay), delay))
    );
    return Promise.race(promises);
}

// Перевірка:
getFastestResponse([1000, 500, 2000, 300])
    .then(result => console.log(' Тест 10.1:', result)); // 300


// ==================== ЗАВДАННЯ 10.3 ====================
/**
 * Симуляція запитів до різних серверів
 * Поверніть відповідь від найшвидшого сервера
 */

function fetchFromServer(serverName, delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                server: serverName,
                data: `Data from ${serverName}`,
                responseTime: delay
            });
        }, delay);
    });
}

/**
 * Отримайте дані від найшвидшого сервера
 * 
 * @returns {Promise<{server: string, data: string, responseTime: number}>}
 */
function fetchFromFastestServer() {
    const serverA = fetchFromServer('Server A', 1000);
    const serverB = fetchFromServer('Server B', 500);
    const serverC = fetchFromServer('Server C', 800);

    return Promise.race([serverA, serverB, serverC]);
}

// Перевірка:
fetchFromFastestServer()
    .then(result => console.log(' Тест 10.3:', result));
// Очікується: { server: 'Server B', data: 'Data from Server B', responseTime: 500 }


// ==================== ЗАВДАННЯ 10.4 ====================
/**
 * Створіть функцію, яка конкурує кілька джерел даних
 * і повертає першу успішну відповідь
 * Але якщо всі джерела падають - reject
 */

function unreliableSource(name, delay, shouldFail) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error(`${name} failed`));
            } else {
                resolve({ source: name, data: 'Success!' });
            }
        }, delay);
    });
}

/**
 * Спробуйте отримати дані з кількох джерел
 * Поверніть перше успішне
 * 
 * @returns {Promise<{source: string, data: string}>}
 */
function getDataFromAnySource() {
    const sources = [
        unreliableSource('Source A', 300, true),
        unreliableSource('Source B', 500, false),
        unreliableSource('Source C', 200, true)
    ];

    let errorsCount = 0;

    const wrappedSources = sources.map(sourcePromise => 
        sourcePromise.catch(error => {
            errorsCount++;
            
            if (errorsCount === sources.length) {
                return Promise.reject(new Error('All sources failed'));
            }
            return new Promise(() => {}); 
        })
    );

    return Promise.race(wrappedSources);
}

// Перевірка:
getDataFromAnySource()
    .then(result => console.log(' Тест 10.4:', result));
// Очікується: { source: 'Source B', data: 'Success!' }



/**
 * ПИТАННЯ ДЛЯ САМОПЕРЕВІРКИ:
 * 
 * 1. Що поверне Promise.race([]) з пустим масивом?
 * 2. Чи продовжують виконуватися інші проміси після того, як один виконався?
 * 3. Як Promise.race() обробляє reject?
 * 4. Яка різниця між Promise.race() та Promise.any()?
 * 5. Чи можна використовувати Promise.race() для таймаутів?
 * 6. Що станеться якщо передати в Promise.race() не-проміси?
 */
