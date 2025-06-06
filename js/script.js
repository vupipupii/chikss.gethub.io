/**
 * CHIKSA Dance Studio - Main JS
 * Версия 3.1 (исправленная)
 */

document.addEventListener('DOMContentLoaded', function () {
    // Конфигурация
    const config = {
        whatsappNumber: '89817392342',
        telegram: '@vupipupii',
        successMessage: 'Спасибо! Мы скоро свяжемся с вами! 💃',
        redirectDelay: 3000,
        testMode: false
    };

    // Инициализация компонентов
    initMobileMenu();
    initForms(config);
    initSmoothScroll();
    initGallery();
    initScheduleFilter();
    initModal();
    initBackToTop();
    initAnimations();
});

// 1. Мобильное меню
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.main-nav');

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', function () {
            this.classList.toggle('open');
            menu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('open');
                menu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
}

// 2. Работа форм
function initForms(config) {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateForm(this)) {
                const formData = getFormData(this);

                if (config.testMode) {
                    console.log('Данные формы:', formData);
                    showSuccess(this, config.successMessage);
                } else {
                    sendToWhatsApp(formData, config.whatsappNumber);
                    showSuccess(this, config.successMessage);
                }
            }
        });
    });

    // Открытие модалки
    document.querySelectorAll('.signup-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const modal = document.getElementById('signup-modal');
            if (modal) {
                modal.style.display = 'block';

                // Установка направления, если указано в data-атрибуте
                const direction = this.dataset.direction;
                if (direction) {
                    const directionSelect = modal.querySelector('#direction');
                    if (directionSelect) {
                        directionSelect.value = direction;
                    }
                }
            }
        });
    });
}

// 3. Плавный скролл
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                return;
            }

            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 4. Галерея
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            if (img) {
                showLightbox(img.src);
            }
        });
    });
}

// 5. Фильтр расписания
function initScheduleFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const scheduleItems = document.querySelectorAll('.schedule-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Удаляем активный класс у всех кнопок
            filterBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');

            const day = this.dataset.day;

            scheduleItems.forEach(item => {
                if (day === 'all' || item.dataset.day === day) {
                    item.style.display = 'grid';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// 6. Модальное окно
function initModal() {
    const modal = document.getElementById('signup-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.close-modal');

    // Закрытие по кнопке
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Закрытие по клику вне модалки
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 7. Кнопка "Наверх"
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 8. Анимации
function initAnimations() {
    const animateItems = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    animateItems.forEach(item => observer.observe(item));
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

/** Валидация формы */
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('invalid');
            isValid = false;
        } else {
            input.classList.remove('invalid');

            // Дополнительная валидация для телефона
            if (input.type === 'tel' && !isValidPhone(input.value)) {
                input.classList.add('invalid');
                isValid = false;
            }
        }
    });

    return isValid;
}

/** Проверка телефона */
function isValidPhone(phone) {
    return /^[\d\+][\d\s\-\(\)]{7,}$/.test(phone);
}

/** Получение данных формы */
function getFormData(form) {
    const data = {};
    form.querySelectorAll('input, select, textarea').forEach(input => {
        data[input.name || input.id] = input.value.trim();
    });
    return data;
}

/** Отправка в WhatsApp */
function sendToWhatsApp(data, whatsappNumber) {
    const message = `Новая заявка из CHIKSA:%0A%0A` +
        `Имя: ${data.name || '-'}%0A` +
        `Телефон: ${data.phone || '-'}%0A` +
        `Направление: ${data.direction || '-'}`;

    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
}
function initScheduleFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const scheduleItems = document.querySelectorAll('.schedule-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Удаляем активный класс у всех кнопок
            filterBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');

            const day = this.dataset.day;

            scheduleItems.forEach(item => {
                if (day === 'all' || item.dataset.day === day) {
                    item.style.display = 'grid';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}
/** Показать успешную отправку */
function showSuccess(form, message) {
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `<p>${message}</p>`;

    form.parentNode.insertBefore(successMsg, form.nextSibling);
    form.reset();

    setTimeout(() => {
        successMsg.remove();
    }, 3000);
}

/** Лайтбокс */
function showLightbox(imgSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
    <div class="lightbox-content">
      <img src="${imgSrc}" alt="CHIKSA Gallery">
      <button class="lightbox-close">&times;</button>
    </div>
  `;

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        lightbox.remove();
        document.body.style.overflow = '';
    });
}