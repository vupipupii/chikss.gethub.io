
document.addEventListener('DOMContentLoaded', function () {
    // Конфигурация
    const config = {
        formSelector: '.signup-form',
        inputSelector: 'input, select, textarea',
        submitSelector: '.submit-btn',
        successMessage: 'Спасибо! Мы свяжемся с вами в течение 15 минут 🎉',
        errorMessage: 'Пожалуйста, заполните все поля правильно!',
        whatsappNumber: '89817392342',
        testMode: false
    };

    // Инициализация всех форм
    const forms = document.querySelectorAll(config.formSelector);
    if (!forms.length) return;

    forms.forEach(form => {
        // Элементы формы
        const inputs = form.querySelectorAll(config.inputSelector);
        const submitBtn = form.querySelector(config.submitSelector);

        // Валидация в реальном времени
        inputs.forEach(input => {
            input.addEventListener('input', function () {
                validateField(this);
                toggleSubmitButton(form, config);
            });

            input.addEventListener('blur', function () {
                validateField(this);
                toggleSubmitButton(form, config);
            });
        });

        // Отправка формы
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!validateForm(form, config)) {
                showAlert(config.errorMessage, 'error');
                return;
            }

            const formData = collectFormData(form);

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправка...';

                if (config.testMode) {
                    console.log('Тестовые данные:', formData);
                    simulateResponse(form, config);
                } else {
                    await sendFormData(formData, config);
                }

            } catch (error) {
                console.error('Ошибка отправки:', error);
                showAlert('Ошибка соединения. Попробуйте позже.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Отправить';
            }
        });
    });

    // ===== ФУНКЦИИ =====

    /** Валидация поля */
    function validateField(field) {
        const value = field.value.trim();
        const errorElement = field.nextElementSibling;

        // Удаляем предыдущие сообщения
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }

        // Проверки по типу поля
        if (field.required && !value) {
            showFieldError(field, 'Это поле обязательно');
            return false;
        }

        if (field.type === 'email' && !isValidEmail(value)) {
            showFieldError(field, 'Введите корректный email');
            return false;
        }

        if (field.type === 'tel' && !isValidPhone(value)) {
            showFieldError(field, 'Введите телефон правильно');
            return false;
        }

        // Успешная валидация
        field.classList.remove('invalid');
        field.classList.add('valid');
        return true;
    }

    /** Валидация всей формы */
    function validateForm(form, config) {
        let isValid = true;
        const inputs = form.querySelectorAll(config.inputSelector);

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /** Сбор данных формы */
    function collectFormData(form) {
        const data = {
            fields: {}
        };

        form.querySelectorAll('input, select, textarea').forEach(input => {
            const name = input.name || input.id;
            if (name) {
                data.fields[name] = input.value.trim();
            }
        });

        // Дополнительные данные
        data.pageUrl = window.location.href;
        data.timestamp = new Date().toISOString();

        return data;
    }

    /** Отправка данных */
    async function sendFormData(data, config) {
        // В реальном проекте здесь будет fetch к API
        // Для демо отправляем в WhatsApp
        sendWhatsApp(data, config.whatsappNumber);
        showAlert(config.successMessage, 'success');
        form.reset();
    }

    /** Показать ошибку поля */
    function showFieldError(field, message) {
        field.classList.add('invalid');
        field.classList.remove('valid');

        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#FF2D75';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';

        field.insertAdjacentElement('afterend', errorElement);
    }

    /** Показать уведомление */
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `form-alert ${type}`;
        alert.textContent = message;

        document.body.appendChild(alert);

        setTimeout(() => {
            alert.classList.add('show');
        }, 10);

        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    }

    /** Активация кнопки отправки */
    function toggleSubmitButton(form, config) {
        const submitBtn = form.querySelector(config.submitSelector);
        const isValid = validateForm(form, config);

        if (submitBtn) {
            submitBtn.disabled = !isValid;
        }
    }

    /** Отправка в WhatsApp */
    function sendWhatsApp(data, whatsappNumber) {
        const phone = data.fields.phone ? data.fields.phone.replace(/[^\d]/g, '') : '';
        const name = data.fields.name || '-';
        const direction = data.fields.direction || '-';

        const message = `Новая заявка из формы:\nИмя: ${name}\nТелефон: ${phone}\nНаправление: ${direction}`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    }

    /** Валидация email */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /** Валидация телефона */
    function isValidPhone(phone) {
        return /^[\d\+][\d\s\-\(\)]{7,}$/.test(phone);
    }

    /** Имитация ответа для тестов */
    function simulateResponse(form, config) {
        setTimeout(() => {
            showAlert(config.successMessage, 'success');
            form.reset();
        }, 1500);
    }
});


