// ==================== ЗАВДАННЯ 19.2 ====================
/**
 * Створіть retry з експоненційною затримкою (exponential backoff)
 * Затримка збільшується: 100ms, 200ms, 400ms, 800ms...
 * 
 * @param {Function} fn 
 * @param {number} maxRetries 
 * @param {number} initialDelay - Початкова затримка в мс
 * @returns {Promise}
 */
async function retryWithBackoff(fn, maxRetries, initialDelay = 100) {
    let attempt = 0;
    let delay = initialDelay;

    while (attempt < maxRetries) {
        try {
            return await fn();
        } catch (error) {
            attempt++;
            if (attempt >= maxRetries) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
}

// Перевірка:
let attempt2 = 0;
function unstableAPI() {
    attempt2++;
    console.log(`  Attempt ${attempt2} at ${new Date().toLocaleTimeString()}`);
    if (attempt2 < 3) {
        return Promise.reject(new Error('API Error'));
    }
    return Promise.resolve('API Success');
}

console.log('Starting retryWithBackoff at', new Date().toLocaleTimeString());
retryWithBackoff(unstableAPI, 5, 100)
    .then(result => console.log(' Тест 19.2:', result));


// ==================== ЗАВДАННЯ 19.4 ====================
/**
 * Створіть retry з детальним логуванням
 * Логуйте кожну спробу, затримку, та результат
 */

/**
 * @param {Function} fn 
 * @param {number} maxRetries 
 * @param {Object} options - {initialDelay, maxDelay, onRetry}
 * @returns {Promise}
 */
async function retryWithLogging(fn, maxRetries, options = {}) {
    const {
        initialDelay = 100,
        maxDelay = 5000,
        onRetry = null
    } = options;

    let attempt = 0;
    let delay = initialDelay;

    while (attempt < maxRetries) {
        try {
            return await fn();
        } catch (error) {
            attempt++;
            if (attempt >= maxRetries) {
                throw error;
            }
            
            if (onRetry) {
                onRetry(attempt, error, delay);
            }

            await new Promise(resolve => setTimeout(resolve, delay));
            
            delay = Math.min(delay * 2, maxDelay);
        }
    }
}

// Перевірка:
let attempt4 = 0;
function trackableFunction() {
    attempt4++;
    if (attempt4 < 4) {
        return Promise.reject(new Error(`Fail ${attempt4}`));
    }
    return Promise.resolve('Success!');
}

retryWithLogging(trackableFunction, 5, {
    initialDelay: 50,
    maxDelay: 500,
    onRetry: (attempt, error, delay) => {
        console.log(`  Retry ${attempt}: ${error.message}, waiting ${delay}ms`);
    }
})
    .then(result => console.log(' Тест 19.4:', result));


// ==================== ЗАВДАННЯ 19.5 ====================
/**
 * Створіть систему retry з обмеженням за часом
 * Навіть якщо є спроби, зупиніться якщо пройшло багато часу
 */

/**
 * @param {Function} fn 
 * @param {Object} options - {maxRetries, maxTime, initialDelay}
 * @returns {Promise}
 */
async function retryWithTimeout(fn, options = {}) {
    const {
        maxRetries = 3,
        maxTime = 5000,  // Максимальний час в мс
        initialDelay = 100
    } = options;

    let attempt = 0;
    let delay = initialDelay;
    const startTime = Date.now();

    while (attempt < maxRetries) {
        try {
            return await fn();
        } catch (error) {
            attempt++;
            const elapsedTime = Date.now() - startTime;

            if (attempt >= maxRetries) {
                throw new Error(`Max retries reached: ${error.message}`);
            }
            
            if (elapsedTime + delay > maxTime) {
                throw new Error(`Timeout reached: ${elapsedTime}ms elapsed`);
            }

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Перевірка:
let attempt5 = 0;
function slowFunction() {
    attempt5++;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (attempt5 < 10) {
                reject(new Error(`Attempt ${attempt5}`));
            } else {
                resolve('Success');
            }
        }, 200);
    });
}

console.log('Starting retryWithTimeout at', new Date().toLocaleTimeString());
retryWithTimeout(slowFunction, {
    maxRetries: 20,
    maxTime: 1000,
    initialDelay: 100
})
    .catch(error => {
        console.log(' Тест 19.5: Stopped due to timeout');
        console.log('  Total attempts:', attempt5);
    });


/**
 * ПИТАННЯ ДЛЯ САМОПЕРЕВІРКИ:
 * 
 * 1. Чому важливо мати затримку між спробами?
 * 2. Що таке exponential backoff і чому він корисний?
 * 3. Які типи помилок варто повторювати, а які ні?
 * 4. Як захистити систему від нескінченних retry?
 * 5. Коли краще використовувати часовий ліміт замість лічильника спроб?
 * 6. Як retry впливає на продуктивність системи?
 * 7. Що таке jitter в контексті retry і навіщо він потрібен?
 */
