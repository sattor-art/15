# Инструкция по развертыванию Bergkau Website

## 📋 Быстрый старт

### Локальное тестирование
1. Скачайте все файлы из репозитория
2. Откройте `index.html` в браузере
3. Или запустите локальный сервер:
   ```bash
   python -m http.server 8000
   ```

### Загрузка на хостинг

#### 1. Обычный веб-хостинг
- Загрузите все файлы в корневую папку сайта
- Убедитесь, что `index.html` в корне
- Готово!

#### 2. GitHub Pages
1. Создайте репозиторий на GitHub
2. Загрузите файлы:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/bergkau-website.git
   git push -u origin main
   ```
3. В настройках репозитория включите GitHub Pages
4. Выберите источник: Deploy from a branch → main

#### 3. Netlify
1. Перетащите папку с сайтом на netlify.com
2. Или подключите GitHub репозиторий
3. Автоматически развернется

#### 4. Vercel
1. Установите Vercel CLI: `npm i -g vercel`
2. В папке с сайтом: `vercel`
3. Следуйте инструкциям

### 🔧 Настройки сервера

#### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^.*$ /index.html [L]

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript text/javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
</IfModule>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/website;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript text/javascript;

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|svg)$ {
        expires 1M;
        add_header Cache-Control "public, immutable";
    }

    # Fallback to index.html
    try_files $uri $uri/ /index.html;
}
```

### 🚀 Оптимизация производительности

#### Сжатие изображений
```bash
# Установите imagemin-cli
npm install -g imagemin-cli imagemin-mozjpeg imagemin-pngquant

# Оптимизируйте изображения
imagemin images/**/*.jpg --out-dir=images-optimized --plugin=mozjpeg
imagemin images/**/*.png --out-dir=images-optimized --plugin=pngquant
```

#### Минификация CSS/JS
```bash
# Установите минификаторы
npm install -g clean-css-cli uglify-js

# Минифицируйте CSS
cleancss -o styles/main.min.css styles/main.css

# Минифицируйте JavaScript
uglifyjs scripts/main.js scripts/translations.js -o scripts/bundle.min.js
```

### 🔒 Безопасность

#### Заголовки безопасности
```
Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data:;
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### 📊 Мониторинг

#### Google Analytics
Добавьте в `<head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Yandex.Metrica
```html
<!-- Yandex.Metrica -->
<script type="text/javascript">
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(COUNTER_ID, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
   });
</script>
```

### 🌍 SEO оптимизация

#### robots.txt
```
User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
```

#### sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>2024-09-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### 💼 Обслуживание

#### Регулярные задачи
- Обновляйте контент в `scripts/translations.js`
- Заменяйте изображения в папке `images/`
- Проверяйте работоспособность форм
- Мониторьте скорость загрузки

#### Резервное копирование
Регулярно создавайте резервные копии:
```bash
tar -czf bergkau-backup-$(date +%Y%m%d).tar.gz static-site/
```

---

## 🆘 Поддержка

При возникновении проблем:
1. Проверьте консоль браузера (F12)
2. Убедитесь, что все файлы загружены
3. Проверьте настройки сервера
4. Обратитесь к документации хостинг-провайдера

**Удачного развертывания! 🚀**