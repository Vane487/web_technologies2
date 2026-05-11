const cities = {
    ukraine: ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро'],
    usa:     ['New York', 'Los Angeles', 'Chicago'],
    poland:  ['Варшава', 'Краків', 'Вроцлав'],
    germany: ['Берлін', 'Мюнхен', 'Гамбург'],
    uk:      ['Лондон', 'Манчестер', 'Бірмінгем']
};

const cn = document.getElementById('cn');
const ct = document.getElementById('ct');

// Перемикання табів
document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab, .form').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.t).classList.add('active');
    });
});

// Показ/приховання пароля
document.querySelectorAll('.eye').forEach(eye => {
    eye.addEventListener('click', function () {
        const input = this.previousElementSibling;
        input.type = input.type === 'password' ? 'text' : 'password';
        this.textContent = input.type === 'password' ? '👁️' : '🔒';
    });
});

// Динамічні міста
cn.addEventListener('change', function () {
    ct.innerHTML = '<option value="">Оберіть місто...</option>';
    ct.disabled = !this.value;
    if (this.value) {
        (cities[this.value] || []).forEach(city => {
            const opt = document.createElement('option');
            opt.value = city.toLowerCase();
            opt.textContent = city;
            ct.appendChild(opt);
        });
    }
});

// Максимальна дата — сьогодні
document.getElementById('bd').max = new Date().toISOString().split('T')[0];

// Хелпер валідації
function v(el, valid, msg) {
    const g = el.closest('.g');
    const m = g.querySelector('.msg');
    g.classList.toggle('ok', valid);
    g.classList.toggle('err', !valid);
    m.textContent = valid ? '✓ Виглядає добре' : '✕ ' + msg;
    return valid;
}

// Розрахунок віку
function calcAge(d) {
    const t = new Date();
    const a = t.getFullYear() - d.getFullYear();
    const m = t.getMonth() - d.getMonth();
    return a - (m < 0 || (m === 0 && t.getDate() < d.getDate()) ? 1 : 0);
}

// Валідація форми реєстрації
document.getElementById('sf').addEventListener('submit', function (e) {
    e.preventDefault();
    let ok = true;

    const fn = document.getElementById('fn');
    const ln = document.getElementById('ln');
    const em = document.getElementById('em');
    const ph = document.getElementById('ph');
    const pw = document.getElementById('pw');
    const cp = document.getElementById('cp');
    const bd = document.getElementById('bd');
    const sg = document.getElementById('sg');

    ok &= v(fn, fn.value.trim().length >= 3 && fn.value.trim().length <= 15, 'Від 3 до 15 символів');
    ok &= v(ln, ln.value.trim().length >= 3 && ln.value.trim().length <= 15, 'Від 3 до 15 символів');
    ok &= v(em, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim()), 'Невірний email');
    ok &= v(ph, /^\+380\d{9}$/.test(ph.value.trim()), 'Формат: +380XXXXXXXXX');
    ok &= v(pw, pw.value.length >= 6, 'Мін. 6 символів');
    ok &= v(cp, cp.value !== '' && cp.value === pw.value, 'Паролі не збігаються');

    // Дата народження
    const bDate = new Date(bd.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!bd.value)          ok &= v(bd, false, "Обов'язкове поле");
    else if (bDate > today) ok &= v(bd, false, 'Дата не може бути в майбутньому');
    else if (calcAge(bDate) < 12) ok &= v(bd, false, 'Має бути не менше 12 років');
    else v(bd, true);

    // Стать
    const sx = document.querySelector('input[name="sex"]:checked');
    const sm = sg.querySelector('.msg');
    sg.classList.toggle('ok', !!sx);
    sg.classList.toggle('err', !sx);
    sm.textContent = sx ? '✓ Виглядає добре' : '✕ Оберіть стать';
    sm.style.color = sx ? '#16a34a' : '#dc2626';
    if (!sx) ok = false;

    ok &= v(cn, !!cn.value, 'Оберіть країну');
    ok &= v(ct, !!ct.value, 'Оберіть місто');

    if (ok) {
        const banner = document.getElementById('sb');
        banner.textContent = '✅ Вас успішно зареєстровано!';
        banner.classList.add('show');
        this.reset();
        ct.disabled = true;
        document.querySelectorAll('#signup .g').forEach(g => g.classList.remove('ok', 'err'));
        document.querySelectorAll('#signup .msg').forEach(m => m.textContent = '');
        setTimeout(() => banner.classList.remove('show'), 4000);
    }
});

// Валідація форми авторизації
document.getElementById('lf').addEventListener('submit', function (e) {
    e.preventDefault();
    let ok = true;

    const lu = document.getElementById('lu');
    const lp = document.getElementById('lp');
    const rm = document.getElementById('rm');

    ok &= v(lu, lu.value.trim() !== '', 'Введіть логін');
    ok &= v(lp, lp.value.length >= 6, 'Мін. 6 символів');

    if (ok) {
        const banner = document.getElementById('lb');
        banner.textContent = `✅ Ласкаво просимо, ${lu.value.trim()}!${rm.checked ? ' Сесію збережено.' : ''}`;
        banner.classList.add('show');
        this.reset();
        document.querySelectorAll('#login .g').forEach(g => g.classList.remove('ok', 'err'));
        document.querySelectorAll('#login .msg').forEach(m => m.textContent = '');
        setTimeout(() => banner.classList.remove('show'), 4000);
    }
});