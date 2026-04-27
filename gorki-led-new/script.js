// Мобильное меню
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const isHttpContext = window.location.protocol === 'http:' || window.location.protocol === 'https:';

// Загрузка новостей из localStorage
function loadNewsFromStorage() {
    try {
        const stored = localStorage.getItem('gorkiNews');
        if (stored) {
            const news = JSON.parse(stored);
            if (Array.isArray(news)) {
                console.log(`Загружено ${news.length} новостей`);
                return news;
            } else {
                console.warn('Некорректные данные новостей в localStorage, очищаем');
                localStorage.removeItem('gorkiNews');
                return [];
            }
        }
        return [];
    } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
        localStorage.removeItem('gorkiNews');
        return [];
    }
}

// Отображение новостей на сайте
function renderSiteNews() {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;
    
    const newsItems = loadNewsFromStorage();
    
    if (newsItems.length === 0) {
        // Если нет новостей, оставляем существующие карточки
        return;
    }
    
    // Очищаем существующие карточки новостей
    newsGrid.innerHTML = '';
    
    // Добавляем новости из localStorage
    newsItems.forEach((news, index) => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        
        const newsDate = new Date(news.createdAt).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        newsCard.innerHTML = `
            <div class="news-header">
                <h3>${news.title}</h3>
                <span class="news-date">${newsDate}</span>
            </div>
            <div class="news-content">
                <p>${news.excerpt || news.content.substring(0, 150) + '...'}</p>
                <button class="btn btn-secondary" onclick="showNewsDetails(${index})" style="margin-top: 1rem;">
                    <i class="fas fa-arrow-right"></i> Подробнее
                </button>
            </div>
        `;
        
        newsGrid.appendChild(newsCard);
    });
}

// Показать детали новости
function showNewsDetails(index) {
    const newsItems = loadNewsFromStorage();
    const news = newsItems[index];
    
    if (!news) return;
    
    // Создаем модальное окно для просмотра новости
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${news.title}</h3>
                <button class="modal-close" onclick="closeNewsModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="news-meta">
                    <span class="news-date">
                        <i class="fas fa-calendar"></i>
                        ${new Date(news.createdAt).toLocaleString('ru-RU')}
                    </span>
                </div>
                <div class="news-full-content">
                    ${news.content.split('\n').map(p => `<p>${p}</p>`).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeNewsModal()">
                    <i class="fas fa-times"></i> Закрыть
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Закрыть модальное окно новости
function closeNewsModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Загрузка данных "О нас" из localStorage
function loadAboutFromStorage() {
    try {
        const stored = localStorage.getItem('gorkiAbout');
        if (stored) {
            const about = JSON.parse(stored);
            if (about && typeof about === 'object') {
                console.log('Загружены данные "О нас"');
                return about;
            } else {
                console.warn('Некорректные данные "О нас" в localStorage, очищаем');
                localStorage.removeItem('gorkiAbout');
                return null;
            }
        }
        return null;
    } catch (error) {
        console.error('Ошибка при загрузке данных "О нас":', error);
        localStorage.removeItem('gorkiAbout');
        return null;
    }
}

// Обновление раздела "О нас" на сайте
function updateAboutSection() {
    const aboutSection = document.querySelector('.about');
    if (!aboutSection) return;
    
    const aboutData = loadAboutFromStorage();
    if (!aboutData) return;
    
    // Обновляем заголовок раздела
    const sectionHeader = aboutSection.querySelector('.section-header h2');
    if (sectionHeader && aboutData.title) {
        sectionHeader.textContent = aboutData.title;
    }
    
    // Обновляем подзаголовок
    const sectionSubtitle = aboutSection.querySelector('.section-header p');
    if (sectionSubtitle && aboutData.subtitle) {
        sectionSubtitle.textContent = aboutData.subtitle;
    }
    
    // Обновляем описание
    const aboutText = aboutSection.querySelector('.about-text h3');
    if (aboutText && aboutData.description) {
        aboutText.nextElementSibling.textContent = aboutData.description;
    }
    
    // Обновляем статистику
    const statsItems = aboutSection.querySelectorAll('.stat-item h4');
    if (statsItems.length >= 3) {
        if (aboutData.years) statsItems[0].textContent = aboutData.years;
        if (aboutData.students) statsItems[1].textContent = aboutData.students;
        if (aboutData.sports) statsItems[2].textContent = aboutData.sports;
    }
}

// Загрузка галереи из localStorage
function loadGalleryFromStorage() {
    try {
        const stored = localStorage.getItem('gorkiGallery');
        if (stored) {
            const images = JSON.parse(stored);
            // Поддерживаем старый формат (data) и серверный формат (url)
            if (Array.isArray(images) && images.every(img => img && (img.data || img.url))) {
                console.log(`Загружено ${images.length} изображений галереи`);
                return images;
            } else {
                console.warn('Некорректные данные галереи в localStorage, очищаем');
                localStorage.removeItem('gorkiGallery');
                return [];
            }
        }
        return [];
    } catch (error) {
        console.error('Ошибка при загрузке галереи:', error);
        localStorage.removeItem('gorkiGallery');
        return [];
    }
}

async function loadGalleryFromServer() {
    if (!isHttpContext) {
        return [];
    }
    try {
        const response = await fetch('get_images.php?type=gallery');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.files)) {
            return result.files;
        }
    } catch (error) {
        console.log('Серверные изображения галереи недоступны:', error.message);
    }
    return [];
}

// Отображение галереи на сайте
async function renderSiteGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    let uploadedImages = await loadGalleryFromServer();
    if (uploadedImages && uploadedImages.length > 0) {
        simpleSave('gorkiGallery', uploadedImages);
    } else {
        uploadedImages = loadGalleryFromStorage();
    }
    if (!Array.isArray(uploadedImages)) {
        uploadedImages = [];
    }
    
    if (uploadedImages.length === 0) {
        // Если нет загруженных изображений, показываем placeholder
        galleryGrid.innerHTML = `
            <div class="gallery-item">
                <div class="gallery-image">
                    <i class="fas fa-image"></i>
                </div>
                <div class="gallery-overlay">
                    <h4>Ледовая арена</h4>
                    <p>Тренировки по хоккею</p>
                </div>
            </div>
            <div class="gallery-item">
                <div class="gallery-image">
                    <i class="fas fa-image"></i>
                </div>
                <div class="gallery-overlay">
                    <h4>Спортивный зал</h4>
                    <p>Соревнования по баскетболу</p>
                </div>
            </div>
            <div class="gallery-item">
                <div class="gallery-image">
                    <i class="fas fa-image"></i>
                </div>
                <div class="gallery-overlay">
                    <h4>Стадион</h4>
                    <p>Футбольные матчи</p>
                </div>
            </div>
            <div class="gallery-item">
                <div class="gallery-image">
                    <i class="fas fa-image"></i>
                </div>
                <div class="gallery-overlay">
                    <h4>Тренажерный зал</h4>
                    <p>Современное оборудование</p>
                </div>
            </div>
        `;
        return;
    }

    // Отображаем загруженные изображения
    galleryGrid.innerHTML = uploadedImages.map((image, index) => `
        <div class="gallery-item">
            <div class="gallery-image">
                <img src="${image.url || image.data}" alt="${image.name}">
            </div>
            <div class="gallery-overlay">
                <h4>${image.name.replace(/\.[^/.]+$/, "")}</h4>
                <p>Загружено: ${new Date(image.uploadDate).toLocaleDateString('ru-RU')}</p>
            </div>
        </div>
    `).join('');
}

// Загрузка фонового изображения главного экрана из localStorage
function loadHeroImageFromStorage() {
    const stored = localStorage.getItem('gorkiHeroImage');
    return stored ? JSON.parse(stored) : null;
}

async function loadHeroImageFromServer() {
    if (!isHttpContext) {
        return null;
    }
    try {
        const response = await fetch('get_images.php?type=hero');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.files) && result.files.length > 0) {
            return result.files[0];
        }
    } catch (error) {
        console.log('Серверное изображение главного экрана недоступно:', error.message);
    }
    return null;
}

// Применение фонового изображения главного экрана
async function applyHeroBackground() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    let heroImage = await loadHeroImageFromServer();
    if (heroImage) {
        localStorage.setItem('gorkiHeroImage', JSON.stringify(heroImage));
    } else {
        heroImage = loadHeroImageFromStorage();
    }
    
    if (heroImage) {
        heroSection.style.backgroundImage = `url(${heroImage.url || heroImage.data})`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
        heroSection.style.backgroundRepeat = 'no-repeat';
    } else {
        // Если нет загруженного изображения, используем градиент по умолчанию
        heroSection.style.backgroundImage = '';
        heroSection.style.background = 'var(--gradient-sports)';
    }
}

// Удаление фонового изображения главного экрана
function removeHeroBackground() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    localStorage.removeItem('gorkiHeroImage');
    heroSection.style.backgroundImage = '';
    heroSection.style.background = 'var(--gradient-sports)';
}

// Обновление фона в реальном времени (для админ-панели)
function updateHeroBackground() {
    applyHeroBackground();
}

// Загрузка изображений о нас (универсальная система)
async function loadAboutImages() {
    console.log('=== ЗАГРУЗКА ИЗОБРАЖЕНИЙ О НАС ===');
    
    // Сначала пробуем базу данных (работает и локально и на сервере)
    try {
        console.log('Пробуем загрузить из базы данных...');
        const dbImages = await loadFromDatabase('about');
        
        if (dbImages && Array.isArray(dbImages) && dbImages.length > 0) {
            console.log('Изображения загружены из базы данных:', dbImages.length);
            // Сохраняем в localStorage как бэкап
            simpleSave('gorkiAboutImages', dbImages);
            return dbImages;
        }
    } catch (error) {
        console.log('База данных недоступна:', error.message);
    }
    
    // Если база данных не сработала, пробуем localStorage
    console.log('Пробуем localStorage...');
    const localImages = simpleLoad('gorkiAboutImages');
    console.log('Загружено из localStorage:', localImages.length, 'изображений');
    
    if (localImages.length > 0) {
        console.log('Используем изображения из localStorage');
        return localImages;
    }
    
    console.log('Изображений нет нигде, возвращаем пустой массив');
    return [];
}

// Применение изображений о нас (асинхронное)
async function applyAboutImages() {
    console.log('=== ПРИМЕНЕНИЕ ИЗОБРАЖЕНИЙ О НАС ===');
    
    const sliderTrack = document.getElementById('aboutSliderTrack');
    const prevBtn = document.getElementById('aboutPrevBtn');
    const nextBtn = document.getElementById('aboutNextBtn');
    const dotsContainer = document.getElementById('aboutSliderDots');
    
    console.log('Проверка DOM элементов:');
    console.log('- sliderTrack:', sliderTrack ? 'НАЙДЕН' : 'НЕ НАЙДЕН');
    console.log('- prevBtn:', prevBtn ? 'НАЙДЕН' : 'НЕ НАЙДЕН');
    console.log('- nextBtn:', nextBtn ? 'НАЙДЕН' : 'НЕ НАЙДЕН');
    console.log('- dotsContainer:', dotsContainer ? 'НАЙДЕН' : 'НЕ НАЙДЕН');
    
    if (!sliderTrack) {
        console.log('sliderTrack не найден, выходим');
        return;
    }
    
    console.log('Загружаем изображения...');
    const images = await loadAboutImages();
    console.log('Загружено изображений:', images.length);
    
    currentAboutImages = images;
    currentAboutSlide = 0;
    
    if (images.length > 0) {
        console.log('Создаем слайды для', images.length, 'изображений');
        
        // Очищаем слайдер
        sliderTrack.innerHTML = '';
        
        // Добавляем слайды
        images.forEach((image, index) => {
            console.log(`Создаем слайд ${index}:`, image.name);
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `<img src="${image.data}" alt="Фото ${index + 1}">`;
            sliderTrack.appendChild(slide);
        });
        
        console.log('Слайды созданы, настраиваем навигацию...');
        
        // Показываем навигацию
        if (prevBtn) {
            prevBtn.style.display = 'flex';
            prevBtn.onclick = prevAboutSlide;
        }
        
        if (nextBtn) {
            nextBtn.style.display = 'flex';
            nextBtn.onclick = nextAboutSlide;
        }
        
        if (dotsContainer) {
            dotsContainer.style.display = 'flex';
            dotsContainer.innerHTML = '';
            
            // Создаем точки навигации
            images.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.onclick = () => goToAboutSlide(index);
                dotsContainer.appendChild(dot);
            });
        }
        
        console.log('Обновляем слайдер...');
        updateAboutSlider();
        
        console.log('Применение изображений завершено УСПЕШНО');
    } else {
        console.log('Изображений нет, показываем placeholder');
        
        // Показываем placeholder
        sliderTrack.innerHTML = `
            <div class="slide">
                <div class="image-placeholder">
                    <i class="fas fa-school"></i>
                </div>
            </div>
        `;
        
        // Скрываем навигацию
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (dotsContainer) dotsContainer.style.display = 'none';
        
        console.log('Placeholder установлен');
    }
}

// Обновление слайдера
function updateAboutSlider() {
    const sliderTrack = document.getElementById('aboutSliderTrack');
    const dots = document.querySelectorAll('.dot');
    
    if (sliderTrack && currentAboutImages.length > 0) {
        sliderTrack.style.transform = `translateX(-${currentAboutSlide * 100}%)`;
        
        // Обновляем точки
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentAboutSlide);
        });
    }
}

// Переход к конкретному слайду
function goToAboutSlide(index) {
    if (index >= 0 && index < currentAboutImages.length) {
        currentAboutSlide = index;
        updateAboutSlider();
    }
}

// Следующий слайд
function nextAboutSlide() {
    if (currentAboutImages.length > 0) {
        currentAboutSlide = (currentAboutSlide + 1) % currentAboutImages.length;
        updateAboutSlider();
    }
}

// Предыдущий слайд
function prevAboutSlide() {
    if (currentAboutImages.length > 0) {
        currentAboutSlide = (currentAboutSlide - 1 + currentAboutImages.length) % currentAboutImages.length;
        updateAboutSlider();
    }
}

// Работа с базой данных через API (универсальная)
async function loadFromDatabase(type) {
    // Пробуем разные способы доступа к базе данных
    
    // Способ 1: Основной API (для веб-сервера)
    try {
        const response = await fetch(`api.php?action=get_${type}_images`);
        const result = await response.json();
        
        if (result && result.success) {
            const images = result.images || [];
            console.log(`Загружено ${images.length} изображений из базы данных (основной API)`);
            return images;
        }
    } catch (error) {
        console.log('Основной API недоступен:', error.message);
    }
    
    // Способ 2: Локальный сервер (http://localhost:8000)
    try {
        const response = await fetch(`http://localhost:8000/get_db_data.php?type=${type}`);
        const result = await response.json();
        
        if (result && result.success) {
            const images = result.images || [];
            console.log(`Загружено ${images.length} изображений из базы данных (локальный сервер)`);
            return images;
        }
    } catch (error) {
        console.log('Локальный сервер недоступен:', error.message);
    }
    
    // Способ 3: Альтернативный локальный сервер (http://127.0.0.1:8000)
    try {
        const response = await fetch(`http://127.0.0.1:8000/get_db_data.php?type=${type}`);
        const result = await response.json();
        
        if (result && result.success) {
            const images = result.images || [];
            console.log(`Загружено ${images.length} изображений из базы данных (127.0.0.1:8000)`);
            return images;
        }
    } catch (error) {
        console.log('Альтернативный локальный сервер недоступен:', error.message);
    }
    
    console.log('Все способы доступа к базе данных недоступны');
    return [];
}

async function saveToDatabase(type, data) {
    try {
        const response = await fetch(`api.php?action=save_${type}_images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log(`Изображения успешно сохранены в базу данных`);
            return true;
        } else {
            console.error('Ошибка сохранения в базу:', result.message);
            return false;
        }
    } catch (error) {
        console.error('Ошибка запроса к базе данных:', error);
        return false;
    }
}

// Запасные функции для localStorage
function simpleSave(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        return false;
    }
}

function simpleLoad(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

// Асинхронная инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    console.log('=== НАЧАЛО ЗАГРУЗКИ СТРАНИЦЫ ===');
    
    await renderSiteGallery();
    renderSiteNews();
    updateAboutSection();
    await applyHeroBackground();
    
    console.log('Вызываем applyAboutImages...');
    await applyAboutImages();
    console.log('applyAboutImages завершен, текущие изображения:', currentAboutImages.length);
    
    setupAdminModal();
    
    // Автопереключение слайдов
    setInterval(() => {
        if (currentAboutImages.length > 1) {
            nextAboutSlide();
        }
    }, 5000);
    
    console.log('=== ЗАГРУЗКА СТРАНИЦЫ ЗАВЕРШЕНА ===');
});

// Управление модальной админ-панелью
let isAdminLoggedIn = false;
let currentHeroImage = null;
let newHeroImage = null;
let uploadedImages = [];
let currentAboutImages = [];
let newAboutImages = [];
let currentAboutSlide = 0;

// Инициализация IndexedDB
function initIndexedDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }
        
        const request = indexedDB.open('GorkiImagesDB', 1);
        
        request.onerror = () => {
            console.error('Ошибка открытия IndexedDB:', request.error);
            reject(request.error);
        };
        
        request.onsuccess = () => {
            db = request.result;
            console.log('IndexedDB успешно инициализирован');
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            if (!db.objectStoreNames.contains('images')) {
                const objectStore = db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('type', 'type', { unique: false });
                objectStore.createIndex('uploadDate', 'uploadDate', { unique: false });
            }
        };
    });
}

// Сохранение изображения в IndexedDB
async function saveImageToIndexedDB(imageData, type) {
    try {
        const db = await initIndexedDB();
        const transaction = db.transaction(['images'], 'readwrite');
        const store = transaction.objectStore('images');
        
        const record = {
            type: type, // 'hero', 'gallery', 'about'
            data: imageData.data,
            name: imageData.name,
            size: imageData.size,
            uploadDate: imageData.uploadDate || new Date().toISOString()
        };
        
        const request = store.add(record);
        
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log(`Изображение сохранено в IndexedDB с ID: ${request.result}`);
                resolve(request.result);
            };
            request.onerror = () => {
                console.error('Ошибка сохранения в IndexedDB:', request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Ошибка при работе с IndexedDB:', error);
        throw error;
    }
}

// Загрузка изображений из IndexedDB
async function loadImagesFromIndexedDB(type) {
    try {
        const db = await initIndexedDB();
        const transaction = db.transaction(['images'], 'readonly');
        const store = transaction.objectStore('images');
        const index = store.index('type');
        const request = index.getAll(type);
        
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log(`Загружено ${request.result.length} изображений типа "${type}" из IndexedDB`);
                resolve(request.result);
            };
            request.onerror = () => {
                console.error('Ошибка загрузки из IndexedDB:', request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Ошибка при работе с IndexedDB:', error);
        return [];
    }
}

// Удаление изображений из IndexedDB по типу
async function deleteImagesFromIndexedDB(type) {
    try {
        const db = await initIndexedDB();
        const transaction = db.transaction(['images'], 'readwrite');
        const store = transaction.objectStore('images');
        const index = store.index('type');
        const request = index.openCursor(IDBKeyRange.only(type));
        
        return new Promise((resolve, reject) => {
            let deletedCount = 0;
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const deleteRequest = cursor.delete();
                    deleteRequest.onsuccess = () => {
                        deletedCount++;
                        cursor.continue();
                    };
                    deleteRequest.onerror = () => {
                        reject(deleteRequest.error);
                    };
                } else {
                    console.log(`Удалено ${deletedCount} изображений типа "${type}" из IndexedDB`);
                    resolve(deletedCount);
                }
            };
            
            request.onerror = () => {
                console.error('Ошибка удаления из IndexedDB:', request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Ошибка при работе с IndexedDB:', error);
        throw error;
    }
}

// Загрузка изображений на сервер
async function uploadImagesToServer(files, type) {
    const formData = new FormData();
    
    files.forEach(file => {
        formData.append('files[]', file.data, file.name);
    });
    
    formData.append('type', type);
    
    try {
        const response = await fetch('upload.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        console.log('Результат загрузки на сервер:', result);
        
        if (result.success) {
            return result.files;
        } else {
            throw new Error(result.message || 'Ошибка загрузки');
        }
    } catch (error) {
        console.error('Ошибка при загрузке на сервер:', error);
        throw error;
    }
}

// Получение изображений с сервера
async function getImagesFromServer(type) {
    try {
        const response = await fetch(`get_images.php?type=${type}`);
        const result = await response.json();
        
        console.log(`Получено ${result.files.length} изображений типа "${type}" с сервера`);
        
        if (result.success) {
            return result.files;
        } else {
            console.warn('Ошибка получения изображений с сервера:', result.message);
            return [];
        }
    } catch (error) {
        console.error('Ошибка при запросе к серверу:', error);
        return [];
    }
}

// Удаление изображений с сервера (простая реализация)
async function deleteImagesFromServer(type) {
    // Для простоты реализации, пока используем localStorage/IndexedDB как бэкап
    console.log(`Удаление изображений типа "${type}" с сервера (заглушка)`);
    return true;
}

// Открытие модального окна админ-панели
function openAdminModal() {
    document.getElementById('adminModal').classList.add('active');
    checkAdminAuth();
}

// Закрытие модального окна админ-панели
function closeAdminModal() {
    document.getElementById('adminModal').classList.remove('active');
}

// Проверка аутентификации администратора
function checkAdminAuth() {
    if (isAdminLoggedIn) {
        showAdminPanel();
    } else {
        showAdminLogin();
    }
}

// Показ формы входа
function showAdminLogin() {
    hideAllSections();
    document.getElementById('adminLogin').style.display = 'block';
}

// Показ панели управления
function showAdminPanel() {
    hideAllSections();
    document.getElementById('adminPanel').style.display = 'block';
}

// Скрыть все секции
function hideAllSections() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('heroSection').style.display = 'none';
    document.getElementById('gallerySection').style.display = 'none';
    document.getElementById('aboutSection').style.display = 'none';
}

// Вход в админ-панель
function adminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Демо доступ - admin/admin
    if (username === 'admin' && password === 'admin') {
        isAdminLoggedIn = true;
        showAdminPanel();
        
        // Очистка формы
        document.getElementById('adminUsername').value = '';
        document.getElementById('adminPassword').value = '';
    } else {
        alert('Неверный логин или пароль. Используйте admin/admin');
    }
}

// Выход из админ-панели
function adminLogout() {
    isAdminLoggedIn = false;
    showAdminLogin();
}

// Открытие секции главного экрана
function openHeroSection() {
    hideAllSections();
    document.getElementById('heroSection').style.display = 'block';
    loadHeroImage();
    setupHeroDragAndDrop();
}

// Открытие секции галереи
function openGallerySection() {
    hideAllSections();
    document.getElementById('gallerySection').style.display = 'block';
    loadGalleryFromStorage();
    renderGallery();
    setupDragAndDrop();
}

// Открытие секции о нас
async function openAboutSection() {
    hideAllSections();
    document.getElementById('aboutSection').style.display = 'block';
    await loadAboutImagesAdmin();
    setupAboutDragAndDrop();
}

// Возврат к главной панели
function backToAdminPanel() {
    showAdminPanel();
}

// Загрузка изображения главного экрана из localStorage
function loadHeroImage() {
    const stored = localStorage.getItem('gorkiHeroImage');
    if (stored) {
        currentHeroImage = JSON.parse(stored);
        renderCurrentHeroImage();
    } else {
        currentHeroImage = null;
        renderCurrentHeroImage();
    }
}

// Отображение текущего изображения главного экрана
function renderCurrentHeroImage() {
    const preview = document.getElementById('currentHeroPreview');
    const deleteBtn = document.getElementById('deleteHeroBtn');
    
    if (currentHeroImage) {
        preview.innerHTML = `<img src="${currentHeroImage.data}" alt="Главный экран">`;
        deleteBtn.style.display = 'inline-flex';
    } else {
        preview.innerHTML = `
            <div class="no-hero-image">
                <i class="fas fa-image"></i>
                <p>Фоновое изображение не установлено</p>
            </div>
        `;
        deleteBtn.style.display = 'none';
    }
}

// Удаление изображения главного экрана
function deleteHeroImage() {
    if (confirm('Вы уверены, что хотите удалить фоновое изображение? Главный экран вернется к стандартному градиенту.')) {
        localStorage.removeItem('gorkiHeroImage');
        currentHeroImage = null;
        renderCurrentHeroImage();
        applyHeroBackground(); // Обновляем фон на сайте
        alert('Фоновое изображение удалено!');
    }
}

// Сохранение изображения главного экрана
function saveHeroImage() {
    if (newHeroImage) {
        currentHeroImage = newHeroImage;
        localStorage.setItem('gorkiHeroImage', JSON.stringify(currentHeroImage));
        applyHeroBackground(); // Обновляем фон на сайте
        alert('Фоновое изображение успешно сохранено!');
        newHeroImage = null;
        document.getElementById('heroPreviewSection').style.display = 'none';
        document.getElementById('heroFileInput').value = '';
        renderCurrentHeroImage();
    } else {
        alert('Пожалуйста, выберите изображение для сохранения');
    }
}

// Drag and Drop для главного экрана
function setupHeroDragAndDrop() {
    const uploadArea = document.getElementById('heroUploadArea');
    const fileInput = document.getElementById('heroFileInput');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('dragover');
        }, false);
    });

    uploadArea.addEventListener('drop', handleHeroDrop, false);
    fileInput.addEventListener('change', handleHeroFileSelect, false);
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleHeroDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleHeroFiles(files);
}

function handleHeroFileSelect(e) {
    const files = e.target.files;
    handleHeroFiles(files);
}

function handleHeroFiles(files) {
    if (files.length > 0) {
        uploadHeroFile(files[0]);
    }
}

function uploadHeroFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите только изображение');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('Размер файла не должен превышать 10MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        newHeroImage = {
            name: file.name,
            data: e.target.result,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString()
        };
        
        renderHeroPreview();
    };
    reader.readAsDataURL(file);
}

// Отображение предпросмотра нового изображения
function renderHeroPreview() {
    const previewSection = document.getElementById('heroPreviewSection');
    const preview = document.getElementById('heroPreview');
    
    if (newHeroImage) {
        preview.innerHTML = `<img src="${newHeroImage.data}" alt="Предпросмотр">`;
        previewSection.style.display = 'block';
    } else {
        previewSection.style.display = 'none';
    }
}

// Загрузка галереи из localStorage
function loadGalleryFromStorage() {
    const stored = localStorage.getItem('gorkiGallery');
    if (stored) {
        uploadedImages = JSON.parse(stored);
    }
}

// Сохранение галереи в localStorage
function saveGalleryToStorage() {
    localStorage.setItem('gorkiGallery', JSON.stringify(uploadedImages));
}

// Сохранение галереи
function saveGallery() {
    try {
        // Проверяем размер данных перед сохранением
        const dataSize = JSON.stringify(uploadedImages).length;
        if (dataSize > 5 * 1024 * 1024) { // 5MB лимит
            alert('Слишком много данных в галерее! Удалите некоторые изображения.');
            return;
        }
        
        localStorage.setItem('gorkiGallery', JSON.stringify(uploadedImages));
        
        // Проверяем, что данные сохранились
        const saved = localStorage.getItem('gorkiGallery');
        if (!saved) {
            throw new Error('Данные галереи не сохранились в localStorage');
        }
        
        console.log(`Сохранено ${uploadedImages.length} изображений галереи`);
    } catch (error) {
        console.error('Ошибка при сохранении галереи:', error);
        alert('Ошибка при сохранении галереи. Попробуйте снова.');
    }
}

// Отображение галереи
function renderGallery() {
    const preview = document.getElementById('galleryPreview');
    
    if (uploadedImages.length === 0) {
        preview.innerHTML = `
            <div class="empty-gallery">
                <i class="fas fa-images"></i>
                <p>Пока нет загруженных фотографий</p>
            </div>
        `;
        return;
    }

    preview.innerHTML = uploadedImages.map((image, index) => `
        <div class="gallery-item-preview">
            <img src="${image.data}" alt="${image.name}">
            <button class="delete-btn" onclick="deleteImage(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Удаление изображения
function deleteImage(index) {
    if (confirm('Удалить эту фотографию?')) {
        uploadedImages.splice(index, 1);
        renderGallery();
    }
}

// Сохранение галереи
function saveGallery() {
    saveGalleryToStorage();
    renderSiteGallery(); // Обновляем галерею на сайте
    alert('Галерея успешно сохранена!');
}

// Drag and Drop для галереи
function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('dragover');
        }, false);
    });

    uploadArea.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFileSelect, false);
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    ([...files]).forEach(uploadFile);
}

function uploadFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите только изображения');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('Размер файла не должен превышать 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = {
            name: file.name,
            data: e.target.result,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString()
        };
        
        uploadedImages.push(imageData);
        renderGallery();
    };
    reader.readAsDataURL(file);
}

// Загрузка изображений о нас в админ-панели (асинхронная)
async function loadAboutImagesAdmin() {
    currentAboutImages = await loadAboutImages();
    renderAboutGallery();
}

// Отображение галереи текущих изображений о нас
function renderAboutGallery() {
    const preview = document.getElementById('aboutGalleryPreview');
    const clearAllBtn = document.getElementById('clearAllAboutBtn');
    
    if (currentAboutImages.length > 0) {
        preview.classList.add('has-images');
        preview.innerHTML = `
            <div class="about-gallery-grid">
                ${currentAboutImages.map((image, index) => `
                    <div class="about-gallery-item">
                        <img src="${image.data}" alt="Фото о нас ${index + 1}">
                        <button class="delete-btn" onclick="deleteAboutImage(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        clearAllBtn.style.display = 'inline-flex';
    } else {
        preview.classList.remove('has-images');
        preview.innerHTML = `
            <div class="no-about-images">
                <i class="fas fa-building"></i>
                <p>Фото о нас не загружены</p>
            </div>
        `;
        clearAllBtn.style.display = 'none';
    }
}

// Удаление конкретного изображения о нас
function deleteAboutImage(index) {
    if (confirm('Вы уверены, что хотите удалить это фото?')) {
        currentAboutImages.splice(index, 1);
        localStorage.setItem('gorkiAboutImages', JSON.stringify(currentAboutImages));
        renderAboutGallery();
        applyAboutImages(); // Обновляем фото на сайте
        alert('Фото удалено!');
    }
}

// Удаление всех изображений о нас
function clearAllAboutImages() {
    if (confirm('Вы уверены, что хотите удалить все фото о нас?')) {
        currentAboutImages = [];
        localStorage.setItem('gorkiAboutImages', JSON.stringify(currentAboutImages));
        renderAboutGallery();
        applyAboutImages(); // Обновляем фото на сайте
        alert('Все фото о нас удалены!');
    }
}

// Сохранение изображений о нас (адаптивное для локальной работы)
async function saveAboutImages() {
    if (newAboutImages.length === 0) {
        alert('Выберите фото для сохранения');
        return;
    }
    
    // Проверяем если сайт открыт через file:// протокол, сохраняем только в localStorage
    if (window.location.protocol === 'file:') {
        console.log('Сайт открыт локально, сохраняем только в localStorage');
        
        const existingImages = simpleLoad('gorkiAboutImages');
        const allImages = [...existingImages, ...newAboutImages];
        
        if (simpleSave('gorkiAboutImages', allImages)) {
            currentAboutImages = allImages;
            const addedCount = newAboutImages.length;
            newAboutImages = [];
            
            await applyAboutImages();
            alert(`Добавлено ${addedCount} фото!`);
            clearAboutPreview();
            renderAboutGallery();
        } else {
            alert('Ошибка сохранения');
        }
        return;
    }
    
    // Для веб-сервера пробуем базу данных
    try {
        const existingImages = await loadAboutImages();
        const allImages = [...existingImages, ...newAboutImages];
        
        const dbSuccess = await saveToDatabase('about', allImages);
        
        if (dbSuccess) {
            simpleSave('gorkiAboutImages', allImages);
            
            currentAboutImages = allImages;
            const addedCount = newAboutImages.length;
            newAboutImages = [];
            
            await applyAboutImages();
            alert(`Добавлено ${addedCount} фото в базу данных!`);
            clearAboutPreview();
            renderAboutGallery();
        } else {
            if (simpleSave('gorkiAboutImages', allImages)) {
                currentAboutImages = allImages;
                const addedCount = newAboutImages.length;
                newAboutImages = [];
                
                await applyAboutImages();
                alert(`Добавлено ${addedCount} фото (localStorage)!`);
                clearAboutPreview();
                renderAboutGallery();
            } else {
                alert('Ошибка сохранения');
            }
        }
    } catch (error) {
        console.error('Ошибка при сохранении изображений:', error);
        alert('Ошибка сохранения изображений');
    }
}

// Очистка предпросмотра
function clearAboutPreview() {
    newAboutImages = [];
    document.getElementById('aboutPreviewSection').style.display = 'none';
    document.getElementById('aboutFileInput').value = '';
    document.getElementById('aboutPreviewGrid').innerHTML = '';
}

// Drag and Drop для фото о нас
function setupAboutDragAndDrop() {
    const uploadArea = document.getElementById('aboutUploadArea');
    const fileInput = document.getElementById('aboutFileInput');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('dragover');
        }, false);
    });

    uploadArea.addEventListener('drop', handleAboutDrop, false);
    fileInput.addEventListener('change', handleAboutFileSelect, false);
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
}

function handleAboutDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleAboutFiles(files);
}

function handleAboutFileSelect(e) {
    const files = e.target.files;
    handleAboutFiles(files);
}

function handleAboutFiles(files) {
    if (files.length > 0) {
        Array.from(files).forEach(file => {
            uploadAboutFile(file);
        });
    }
}

function uploadAboutFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите только изображения');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert(`Размер файла ${file.name} не должен превышать 10MB`);
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = {
            name: file.name,
            data: e.target.result,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString()
        };
        
        newAboutImages.push(imageData);
        renderAboutPreview();
    };
    reader.readAsDataURL(file);
}

// Отображение предпросмотра новых фото о нас
function renderAboutPreview() {
    const previewSection = document.getElementById('aboutPreviewSection');
    const previewGrid = document.getElementById('aboutPreviewGrid');
    
    if (newAboutImages.length > 0) {
        previewGrid.innerHTML = newAboutImages.map((image, index) => `
            <div class="about-preview-item">
                <img src="${image.data}" alt="Предпросмотр ${index + 1}">
                <button class="remove-btn" onclick="removeAboutPreviewImage(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        previewSection.style.display = 'block';
    } else {
        previewSection.style.display = 'none';
    }
}

// Удаление изображения из предпросмотра
function removeAboutPreviewImage(index) {
    newAboutImages.splice(index, 1);
    renderAboutPreview();
}

// Инициализация модального окна
function setupAdminModal() {
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('adminModal');
            if (modal.classList.contains('active')) {
                closeAdminModal();
            }
        }
    });
}

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Закрываем мобильное меню после клика
            navMenu.classList.remove('active');
        }
    });
});

// Анимация при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдаем за элементами
document.querySelectorAll('.service-card, .product-card, .advantage-item, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Форма обратной связи
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const message = this.querySelector('textarea').value;
        
        // Простая валидация
        if (!name || !email || !message) {
            showNotification('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }
        
        // Имитация отправки формы
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Цвета в зависимости от типа
    if (type === 'success') {
        notification.style.background = '#10b981';
    } else if (type === 'error') {
        notification.style.background = '#ef4444';
    } else {
        notification.style.background = '#3b82f6';
    }
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Изменение фона навигации при прокрутке
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Параллакс эффект для hero секции
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.3;
    }
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Счетчик статистики
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '') + 
                                 (element.textContent.includes('%') ? '%' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '') + 
                                 (element.textContent.includes('%') ? '%' : '');
        }
    }, 16);
}

// Запуск счетчиков при прокрутке
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const statNumbers = entry.target.querySelectorAll('.stat-item h4');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                animateCounter(stat, number);
            });
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Галерея - модальное окно
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        // Здесь можно добавить логику для открытия модального окна с изображением
        console.log('Gallery item clicked');
    });
});

// Ленивая загрузка изображений (если они будут добавлены)
function lazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    lazyLoad();
    
    // Добавляем плавный переход для всех ссылок
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hostname !== window.location.hostname) {
                // Внешняя ссылка - открываем в новой вкладке
                if (!this.getAttribute('target')) {
                    this.setAttribute('target', '_blank');
                    this.setAttribute('rel', 'noopener noreferrer');
                }
            }
        });
    });
});

// Предотвращение двойного клика на мобильных устройствах
let touchEndTime = 0;
document.addEventListener('touchend', function(e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - touchEndTime;
    if (tapLength < 500 && tapLength > 0) {
        e.preventDefault();
    }
    touchEndTime = currentTime;
});
