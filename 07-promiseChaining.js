// ==================== ЗАВДАННЯ 7.2 ====================
/**
 * Створіть ланцюжок обробки даних користувача:
 * 1. Отримати об'єкт {name: 'john doe', age: 25}
 * 2. Конвертувати name у верхній регістр
 * 3. Додати поле isAdult (age >= 18)
 * 4. Додати поле nameLength
 * 
 * @param {{name: string, age: number}} user 
 * @returns {Promise<{name: string, age: number, isAdult: boolean, nameLength: number}>}
 */
function processUser(user) {
    return Promise.resolve(user)
        .then(u => ({ ...u, name: u.name.toUpperCase() }))
        .then(u => ({ ...u, isAdult: u.age >= 18 }))
        .then(u => ({ ...u, nameLength: u.name.length }));
}

// Перевірка:
processUser({ name: 'john doe', age: 25 })
    .then(result => console.log(' Тест 7.2:', result));
// Очікується: { name: 'JOHN DOE', age: 25, isAdult: true, nameLength: 8 }


// ==================== ЗАВДАННЯ 7.3 ====================
/**
 * Створіть ланцюжок з асинхронними операціями
 * Використовуйте функції нижче для побудови ланцюжка
 */

function fetchUserData(userId) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ id: userId, username: 'user_' + userId });
        }, 100);
    });
}

function fetchUserPosts(user) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                ...user,
                posts: ['Post 1', 'Post 2', 'Post 3']
            });
        }, 100);
    });
}

function countPosts(userData) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                ...userData,
                postCount: userData.posts.length
            });
        }, 100);
    });
}

/**
 * Створіть функцію, яка:
 * 1. Отримує дані користувача
 * 2. Отримує його пости
 * 3. Рахує кількість постів
 * 
 * @param {number} userId 
 * @returns {Promise<{id: number, username: string, posts: string[], postCount: number}>}
 */
function getUserWithPostCount(userId) {
    return fetchUserData(userId).then(fetchUserPosts).then(countPosts);
}

// Перевірка:
getUserWithPostCount(123)
    .then(result => console.log(' Тест 7.3:', result));


// ==================== ЗАВДАННЯ 7.4 ====================
/**
 * Створіть ланцюжок з обробкою помилок
 * Якщо number < 0 - кинути помилку
 * Інакше виконати обчислення
 */

function validateNumber(number) {
    if (number < 0) {
        throw new Error('Number must be positive');
    }
    return number;
}

/**
 * Створіть функцію, яка:
 * 1. Валідує число (використовуйте validateNumber)
 * 2. Множить на 2
 * 3. Додає 5
 * 4. Повертає результат у форматі {original: number, result: number}
 * 5. Обробляє помилки та повертає {error: string}
 * 
 * @param {number} number 
 * @returns {Promise<{original?: number, result?: number, error?: string}>}
 */
function safeCalculation(number) {
    return Promise.resolve(number)
        .then(n => validateNumber(n))
        .then(n => n * 2)
        .then(n => n + 5)
        .then(result => ({ original: number, result: result }))
        .catch(error => ({ error: error.message }));
}

// Перевірка:
safeCalculation(10)
    .then(result => console.log(' Тест 7.4a:', result));
// Очікується: { original: 10, result: 25 }

safeCalculation(-5)
    .then(result => console.log(' Тест 7.4b:', result));
// Очікується: { error: 'Number must be positive' }


/**
 * ПИТАННЯ ДЛЯ САМОПЕРЕВІРКИ:
 * 
 * 1. Що повертає .then()?
 * 2. Чи можна повернути проміс з .then()?
 * 3. Що станеться якщо в .then() кинути помилку?
 * 4. Як працює .catch() в середині ланцюжка?
 * 5. Чи можна продовжити ланцюжок після .catch()?
 * 6. Яка різниця між return value та return Promise.resolve(value) в .then()?
 */
