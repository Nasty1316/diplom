// Переводы для сайта
const translations = {
    ru: {
        'nav-home': 'Главная',
        'nav-about': 'О нас',
        'nav-services': 'Услуги',
        'nav-facilities': 'Объекты',
        'nav-news': 'Новости',
        'nav-gallery': 'Фотогалерея',
        'nav-contacts': 'Контакты',
        'hero-title': 'Государственное учебно-спортивное учреждение',
        'hero-subtitle': '"Горецкая детско-юношеская спортивная школа"',
        'hero-description': 'Ледовая арена, спортивные залы, тренажерные залы, конный спорт и многое другое!',
        'btn-facilities': 'Наши объекты',
        'btn-contacts': 'Связаться с нами',
        'about-title': 'О нас',
        'about-description': 'Горецкая детско-юношеская спортивная школа - современный спортивный комплекс, предлагающий широкий выбор услуг для занятий спортом и активного отдыха.',
        'about-stat-1': 'Лет работы',
        'about-stat-2': 'Спортсменов',
        'about-stat-3': 'Объектов',
        'about-stat-4': 'Тренеров',
        'services-title': 'Услуги',
        'services-description': 'Комплексные спортивные услуги для всех возрастов и уровней подготовки',
        'facilities-title': 'Наши объекты и услуги',
        'facilities-description': 'Современные спортивные сооружения с актуальными ценами',
        'news-title': 'Новости и объявления',
        'news-description': 'Последние события и важная информация',
        'gallery-title': 'Фотогалерея',
        'gallery-description': 'Фотографии наших объектов и мероприятий',
        'contacts-title': 'Контакты',
        'contacts-description': 'Свяжитесь с нами для консультации',
        'contact-address': 'Адрес',
        'contact-phones': 'Телефоны',
        'contact-email': 'Email',
        'contact-schedule': 'График работы',
        'management-title': 'Руководство',
        'bank-details-title': 'Банковские реквизиты',
        'form-name': 'Ваше имя',
        'form-email': 'Email',
        'form-phone': 'Телефон',
        'form-message': 'Сообщение',
        'form-submit': 'Отправить',
        'footer-copyright': '© 2024 Горецкая ДЮСШ. Все права защищены.'
    },
    en: {
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-services': 'Services',
        'nav-facilities': 'Facilities',
        'nav-news': 'News',
        'nav-gallery': 'Gallery',
        'nav-contacts': 'Contacts',
        'hero-title': 'State Educational Sports Institution',
        'hero-subtitle': '"Gorki Children and Youth Sports School"',
        'hero-description': 'Ice arena, sports halls, gyms, equestrian sports and much more!',
        'btn-facilities': 'Our Facilities',
        'btn-contacts': 'Contact Us',
        'about-title': 'About Us',
        'about-description': 'Gorki Children and Youth Sports School is a modern sports complex offering a wide range of services for sports and active recreation.',
        'about-stat-1': 'Years of Work',
        'about-stat-2': 'Athletes',
        'about-stat-3': 'Facilities',
        'about-stat-4': 'Coaches',
        'services-title': 'Services',
        'services-description': 'Comprehensive sports services for all ages and skill levels',
        'facilities-title': 'Our Facilities and Services',
        'facilities-description': 'Modern sports facilities with current prices',
        'news-title': 'News and Announcements',
        'news-description': 'Latest events and important information',
        'gallery-title': 'Photo Gallery',
        'gallery-description': 'Photos of our facilities and events',
        'contacts-title': 'Contacts',
        'contacts-description': 'Contact us for consultation',
        'contact-address': 'Address',
        'contact-phones': 'Phones',
        'contact-email': 'Email',
        'contact-schedule': 'Working Hours',
        'management-title': 'Management',
        'bank-details-title': 'Bank Details',
        'form-name': 'Your Name',
        'form-email': 'Email',
        'form-phone': 'Phone',
        'form-message': 'Message',
        'form-submit': 'Send',
        'footer-copyright': '© 2024 Gorki CYSS. All rights reserved.'
    },
    be: {
        'nav-home': 'Галоўная',
        'nav-about': 'Пра нас',
        'nav-services': 'Паслугі',
        'nav-facilities': 'Аб\'екты',
        'nav-news': 'Навіны',
        'nav-gallery': 'Фотагалерэя',
        'nav-contacts': 'Кантакты',
        'hero-title': 'Дзяржаўная вучэбна-спартыўная ўстанова',
        'hero-subtitle': '"Горацкая дзіцяча-юнацкая спартыўная школа"',
        'hero-description': 'Лядовая арэна, спартыўныя залы, трэнажорныя залы, конны спорт і многае іншае!',
        'btn-facilities': 'Нашы аб\'екты',
        'btn-contacts': 'Звязацца з намі',
        'about-title': 'Пра нас',
        'about-description': 'Горацкая дзіцяча-юнацкая спартыўная школа - сучасны спартыўны комплекс, які прапануе шырокі выбар паслуг для заняткаў спортам і актыўнага адпачынку.',
        'about-stat-1': 'Гадоў працы',
        'about-stat-2': 'Спартсменаў',
        'about-stat-3': 'Аб\'ектаў',
        'about-stat-4': 'Трэнераў',
        'services-title': 'Паслугі',
        'services-description': 'Комплексныя спартыўныя паслугі для ўсіх узростаў і узроўняў падрыхтоўкі',
        'facilities-title': 'Нашы аб\'екты і паслугі',
        'facilities-description': 'Сучасныя спартыўныя збудаванні з актуальнымі цэнамі',
        'news-title': 'Навіны і аб\'явы',
        'news-description': 'Апошнія падзеі і важная інфармацыя',
        'gallery-title': 'Фотагалерэя',
        'gallery-description': 'Фотаграфіі нашых аб\'ектаў і мерапрыемстваў',
        'contacts-title': 'Кантакты',
        'contacts-description': 'Звяжыцеся з намі для кансультацыі',
        'contact-address': 'Адрас',
        'contact-phones': 'Тэлефоны',
        'contact-email': 'Email',
        'contact-schedule': 'Графік працы',
        'management-title': 'Кіраўніцтва',
        'bank-details-title': 'Банкаўскія рэквізіты',
        'form-name': 'Ваша імя',
        'form-email': 'Email',
        'form-phone': 'Тэлефон',
        'form-message': 'Паведамленне',
        'form-submit': 'Адправіць',
        'footer-copyright': '© 2024 Горацкая ДЮСШ. Усе правы абаронены.'
    }
};

// Функция переключения языка
function switchLanguage(lang) {
    // Сохраняем выбранный язык в localStorage
    localStorage.setItem('selectedLanguage', lang);
    
    // Обновляем активную кнопку языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    
    // Обновляем все элементы с data-translate атрибутом
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Обновляем атрибут lang у html
    document.documentElement.lang = lang;
    
    // Обновляем направление текста для RTL языков (если понадобится)
    if (lang === 'ar' || lang === 'he') {
        document.documentElement.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Получаем сохраненный язык или используем русский по умолчанию
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'ru';
    
    // Устанавливаем сохраненный язык
    switchLanguage(savedLanguage);
    
    // Добавляем обработчики событий для кнопок языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
});
