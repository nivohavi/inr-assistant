# Performance Improvements Plan

## Critical Performance Issues

### 1. Large Monolithic HTML File
- **Issue**: 235KB single HTML file (4,401 lines)
- **Impact**: Slow initial load, poor caching
- **Priority**: HIGH

### 2. No Code Splitting
- **Issue**: All JavaScript loaded at once
- **Impact**: Long parsing time, unnecessary bundle size
- **Priority**: HIGH

### 3. No Resource Optimization
- **Issue**: Large logo PNG (700KB), no compression
- **Impact**: Slow image loading, bandwidth waste
- **Priority**: MEDIUM

### 4. No Caching Strategy
- **Issue**: No service worker or cache headers
- **Impact**: Repeated downloads on every visit
- **Priority**: HIGH

### 5. Synchronous Script Loading
- **Issue**: All scripts block page rendering
- **Impact**: Poor perceived performance
- **Priority**: MEDIUM

## Implementation Plan

### Phase 1: File Structure Optimization
```
inr-assistant/
├── index.html (slim, structure only)
├── css/
│   ├── main.css (extracted styles)
│   └── mobile.css (mobile-specific styles)
├── js/
│   ├── app.js (core functionality)
│   ├── medical-algorithms.js (dosing calculations)
│   ├── charts.js (chart functionality)
│   ├── auth.js (authentication)
│   └── utils.js (utility functions)
├── assets/
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── favicon.ico
│   └── images/
│       └── logo-optimized.webp (compressed logo)
└── sw.js (service worker)
```

### Phase 2: Lazy Loading Implementation
```javascript
// Dynamic imports for heavy features
async function loadChartModule() {
    if (!window.chartLoaded) {
        const { Chart } = await import('https://unpkg.com/chart.js');
        const chartModule = await import('./js/charts.js');
        window.chartLoaded = true;
        return chartModule;
    }
}

// Load chart only when needed
function showTrendAnalysis() {
    loadChartModule().then(() => {
        renderInrChart();
    });
}

// Intersection Observer for lazy loading
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadChartModule();
            chartObserver.unobserve(entry.target);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const chartContainer = document.getElementById('chart-container');
    if (chartContainer) {
        chartObserver.observe(chartContainer);
    }
});
```

### Phase 3: Service Worker for Caching
```javascript
// sw.js
const CACHE_NAME = 'inr-assistant-v1.2.0';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/login.html',
    '/admin.html',
    '/css/main.css',
    '/css/mobile.css',
    '/js/app.js',
    '/js/auth.js',
    '/js/utils.js',
    '/assets/images/logo-optimized.webp',
    '/assets/icons/icon-192.png'
];

const EXTERNAL_ASSETS = [
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap',
    'https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.6.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/8.6.1/firebase-firestore.js'
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([...STATIC_ASSETS, ...EXTERNAL_ASSETS]);
        })
    );
});

// Fetch event with network-first strategy for dynamic content
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('firebaseapp.com') || 
        event.request.url.includes('googleapis.com')) {
        // Network first for Firebase API calls
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(JSON.stringify({error: 'Offline'}), {
                    headers: {'Content-Type': 'application/json'}
                });
            })
        );
    } else {
        // Cache first for static assets
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});
```

### Phase 4: Image Optimization
```bash
# Convert PNG to WebP (90% smaller)
npx imagemin INR_Logo_v1.png --out-dir=assets/images --plugin=webp

# Generate different sizes
npx imagemin INR_Logo_v1.png --out-dir=assets/icons --plugin=imagemin-pngquant
```

```html
<!-- Responsive images with WebP support -->
<picture>
    <source srcset="assets/images/logo-small.webp" media="(max-width: 640px)" type="image/webp">
    <source srcset="assets/images/logo-medium.webp" media="(max-width: 1024px)" type="image/webp">
    <source srcset="assets/images/logo-large.webp" type="image/webp">
    <img src="assets/images/logo-fallback.png" alt="INR Assistant Logo" class="h-12 w-12" loading="lazy">
</picture>
```

### Phase 5: Critical CSS Inlining
```html
<!-- Critical CSS inlined in head -->
<style>
/* Critical above-the-fold styles */
body{font-family:'Heebo',sans-serif;margin:0;padding:0}
.header{background:#fff;box-shadow:0 2px 4px rgba(0,0,0,.1)}
.loading{display:flex;justify-content:center;align-items:center;height:100vh}
</style>

<!-- Non-critical CSS loaded asynchronously -->
<link rel="preload" href="css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="css/main.css"></noscript>
```

### Phase 6: Bundle Optimization
```javascript
// Tree-shaking for Chart.js
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
```

### Phase 7: Database Query Optimization
```javascript
// Firestore query optimization
async function loadUserData(userId) {
    const batch = [];
    
    // Use Promise.all for parallel queries
    const [patientInfo, inrData] = await Promise.all([
        db.collection('users').doc(userId).get(),
        db.collection('inrData').doc(userId)
          .collection('measurements')
          .orderBy('date', 'desc')
          .limit(50) // Limit recent data
          .get()
    ]);
    
    return { patientInfo: patientInfo.data(), inrData: inrData.docs.map(doc => doc.data()) };
}

// Implement pagination for large datasets
async function loadMoreData(lastDoc) {
    const query = db.collection('inrData')
        .doc(currentUser.uid)
        .collection('measurements')
        .orderBy('date', 'desc')
        .startAfter(lastDoc)
        .limit(20);
        
    const snapshot = await query.get();
    return snapshot.docs;
}
```

## Performance Metrics Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms  
- **CLS (Cumulative Layout Shift)**: < 0.1

### Additional Metrics
- **FCP (First Contentful Paint)**: < 1.8s
- **TTI (Time to Interactive)**: < 3.5s
- **Total Bundle Size**: < 200KB (gzipped)
- **Image Optimization**: > 80% size reduction

## Monitoring Setup
```javascript
// Performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
                firebase.analytics().logEvent('performance_lcp', {
                    value: Math.round(entry.startTime)
                });
            }
        });
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
}
``` 