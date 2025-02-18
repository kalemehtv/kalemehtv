// تابع برای اضافه کردن ردیف جدید
function addRow() {
    const tableBody = document.querySelector('#textTable tbody');
    const rowCount = tableBody.rows.length + 1;

    const row = document.createElement('tr');

    // ستون ردیف
    const cell1 = document.createElement('td');
    cell1.textContent = rowCount;

    // ستون متن
    const cell2 = document.createElement('td');
    const textarea = document.createElement('textarea');
    textarea.setAttribute('placeholder', 'متن خود را وارد کنید...');
    textarea.addEventListener('input', () => updateCharCount(row));
    cell2.appendChild(textarea);

    // ستون تعداد حروف
    const cell3 = document.createElement('td');
    cell3.classList.add('char-count');
    cell3.textContent = '0';

    // ستون وضعیت
    const cell4 = document.createElement('td');
    cell4.classList.add('status-message');
    cell4.textContent = '';

    // ستون عملیات
    const cell5 = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.backgroundColor = '#dc3545';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';
    deleteBtn.style.borderRadius = '4px';
    deleteBtn.style.padding = '5px 10px';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.onclick = () => deleteRow(row);
    cell5.appendChild(deleteBtn);

    // اضافه کردن سلول‌ها به ردیف
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    row.appendChild(cell5);

    // اضافه کردن ردیف به جدول
    tableBody.appendChild(row);
}

// تابع برای حذف ردیف
function deleteRow(row) {
    row.remove();
    updateRowNumbers();
}

// تابع برای حذف همه ردیف‌ها
function deleteAllRows() {
    const tableBody = document.querySelector('#textTable tbody');
    tableBody.innerHTML = '';
}

// تابع برای به‌روزرسانی شماره ردیف‌ها
function updateRowNumbers() {
    const rows = document.querySelectorAll('#textTable tbody tr');
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

// تابع برای به‌روزرسانی تعداد حروف و وضعیت
function updateCharCount(row) {
    const textarea = row.cells[1].querySelector('textarea');
    const charCountCell = row.cells[2];
    const statusCell = row.cells[3];
    const charCount = textarea.value.length;

    charCountCell.textContent = charCount;

    if (charCount > 73) {
        charCountCell.classList.add('red'); // رنگ قرمز برای تعداد حروف بیشتر از 73
        statusCell.textContent = 'برای یوتیوب طولانی است';
        statusCell.classList.add('red');
        showNotification('متن شما برای یوتیوب طولانی است.');
    } else if (charCount > 67) {
        charCountCell.classList.add('red'); // رنگ قرمز برای تعداد حروف بیشتر از 67
        statusCell.textContent = 'برای زیرنویس طولانی است';
        statusCell.classList.add('red');
        showNotification('متن شما برای زیرنویس طولانی است.');
    } else if (charCount > 37) {
        statusCell.textContent = 'برای زیرنویس مناسب است';
        statusCell.classList.remove('red');
        charCountCell.classList.remove('red');
    } else {
        statusCell.textContent = '';
        statusCell.classList.remove('red');
        charCountCell.classList.remove('red');
    }
}

// تابع برای نمایش اعلان
let notificationTimeout;
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    notificationMessage.textContent = message;
    notification.classList.add('show');

    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
    }, 3000); // اعلان بعد از 3 ثانیه مخفی می‌شود
}

// تابع برای ذخیره داده‌ها در localStorage
function saveData() {
    const rows = document.querySelectorAll('#textTable tbody tr');
    const data = [];
    rows.forEach(row => {
        const textarea = row.cells[1].querySelector('textarea');
        data.push(textarea.value);
    });
    localStorage.setItem('savedTexts', JSON.stringify(data));
    alert('داده‌ها ذخیره شدند!');
}

// تابع برای کپی متن انتخاب‌شده
function copySelectedText() {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        navigator.clipboard.writeText(selectedText).then(() => {
            showNotification('متن انتخاب شده کپی شد!');
        }).catch(err => {
            showNotification('خطا در کپی کردن متن!');
        });
    } else {
        showNotification('لطفاً متنی را انتخاب کنید.');
    }
}

// تابع برای پیست کردن متن از خارج نرم‌افزار
function pasteText() {
    const activeTextarea = document.activeElement;
    if (activeTextarea.tagName === 'TEXTAREA') {
        navigator.clipboard.readText().then(text => {
            activeTextarea.value += text;
            updateCharCount(activeTextarea.closest('tr'));
            showNotification('متن با موفقیت پیست شد!');
        }).catch(err => {
            showNotification('خطا در پیست کردن متن!');
        });
    } else {
        showNotification('لطفاً در یکی از فیلدهای متن قرار داشته باشید.');
    }
}

// افزودن رویدادها به دکمه‌ها
document.getElementById('addRowBtn').addEventListener('click', addRow);
document.getElementById('saveBtn').addEventListener('click', saveData);
document.getElementById('copyBtn').addEventListener('click', copySelectedText);
document.getElementById('pasteBtn').addEventListener('click', pasteText);
document.getElementById('deleteAllBtn').addEventListener('click', deleteAllRows);

// بارگذاری داده‌های ذخیره‌شده از localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedTexts = JSON.parse(localStorage.getItem('savedTexts')) || [];
    savedTexts.forEach(() => addRow());
    const rows = document.querySelectorAll('#textTable tbody tr');
    rows.forEach((row, index) => {
        row.cells[1].querySelector('textarea').value = savedTexts[index];
        updateCharCount(row);
    });

    // نمایش تاریخ و زمان فعلی
    updateDateTime();
});

// تابع برای نمایش تاریخ و زمان فعلی
function updateDateTime() {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const now = new Date();
    const dayOfWeek = daysOfWeek[now.getUTCDay()];
    const month = months[now.getUTCMonth()];
    const day = now.getUTCDate();
    const year = now.getUTCFullYear();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');

    const formattedDateTime = `${dayOfWeek}, ${month} ${day}, ${year} - ${hours}:${minutes}:${seconds}`;
    document.getElementById('currentDateTime').textContent = formattedDateTime;
}

// به‌روزرسانی تاریخ و زمان هر ثانیه
setInterval(updateDateTime, 1000);

// ذخیره خودکار داده‌ها قبل از بسته شدن صفحه
window.addEventListener('beforeunload', () => {
    const rows = document.querySelectorAll('#textTable tbody tr');
    const data = [];
    rows.forEach(row => {
        const textarea = row.cells[1].querySelector('textarea');
        data.push(textarea.value);
    });
    localStorage.setItem('savedTexts', JSON.stringify(data));
});