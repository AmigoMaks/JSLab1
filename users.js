// Use https://gorest.co.in/ REST API for Testing and Prototyping
// Write function to fetch data from https://gorest.co.in/public/v2/users
// This function should print in console array of obects with the following structure {id, name, email}
// and handle possible errors 

async function fetchAndFormatUsers() {
    const url = 'https://gorest.co.in/public/v2/users';

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Помилка HTTP! Статус: ${response.status}`);
        }

        const data = await response.json();

        const formattedUsers = data.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email
        }));

        console.log('Отримані користувачі:');
        console.log(formattedUsers);

    } catch (error) {
        console.error('Помилка при отриманні даних:', error.message);
    }
}

fetchAndFormatUsers();
