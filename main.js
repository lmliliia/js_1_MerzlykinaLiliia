/**
 * Name/Value pairs manager.
 * Формат запису: <name> = <value>, лише літери та цифри; пробіли навколо "=" ігноруються.
 */

// ---------- Налаштування та елементи сторінки ----------

// Допустимий формат: name=value (alpha-numeric), пробіли навколо = і по краях дозволені.
// Дужки "захоплюють" name і value без пробілів: match[1] - name, match[2] - value.
const PAIR_REGEX = /^\s*([A-Za-z0-9]+)\s*=\s*([A-Za-z0-9]+)\s*$/;

const input = document.getElementById('pair-input');
const list = document.getElementById('pair-list');
const errorBox = document.getElementById('error');

// ---------- Допоміжні функції ----------

/** Показати або очистити повідомлення про помилку */
function showError(message) {
    errorBox.textContent = message;
}

/**
 * Створити елемент списку для пари та додати його у кінець списку.
 * name і value зберігаємо в data-атрибутах, щоб сортувати без розбору тексту.
 */
function appendOption(name, value) {
    const option = document.createElement('option');
    option.dataset.name = name;
    option.dataset.value = value;
    option.textContent = name + '=' + value;
    list.appendChild(option);
}

// ---------- Дії користувача ----------

/** Додати пару до списку, якщо вона валідна */
function addPair() {
    const match = PAIR_REGEX.exec(input.value);

    // Неправильний формат: пару НЕ додаємо, показуємо повідомлення
    if (!match) {
        showError('Invalid format. Use Name=Value (letters and digits only).');
        input.focus();
        return;
    }

    appendOption(match[1], match[2]);

    // Прибираємо помилку, очищаємо поле, повертаємо курсор для наступного вводу
    showError('');
    input.value = '';
    input.focus();
}

/** Сортувати список за name або value (за зростанням, без урахування регістру) */
function sortBy(field) {
    const options = Array.from(list.options);
    options.sort((a, b) =>
        a.dataset[field].localeCompare(b.dataset[field], undefined, { sensitivity: 'base' })
    );
    // appendChild переміщує вже існуючий елемент, тож список переставляється у новому порядку
    options.forEach(option => list.appendChild(option));
}

/** Видалити всі вибрані елементи */
function deleteSelected() {
    Array.from(list.selectedOptions).forEach(option => option.remove());
}

// ---------- Обробники подій ----------

document.getElementById('add-btn').addEventListener('click', addPair);
document.getElementById('sort-name-btn').addEventListener('click', () => sortBy('name'));
document.getElementById('sort-value-btn').addEventListener('click', () => sortBy('value'));
document.getElementById('delete-btn').addEventListener('click', deleteSelected);

// Enter у полі вводу = Add
input.addEventListener('keydown', event => {
    if (event.key === 'Enter') addPair();
});

// Delete на клавіатурі у списку
list.addEventListener('keydown', event => {
    if (event.key === 'Delete') deleteSelected();
});

// ---------- Початкові дані ----------
// Дві пари, як на зразку з ТЗ. Це звичайні елементи списку:
// їх можна сортувати, виділяти та видаляти нарівні з доданими.
appendOption('Hello', 'World');
appendOption('Happy', 'Coding');