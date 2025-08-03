# Accessibility Improvements Plan

## Critical Accessibility Issues

### 1. Missing ARIA Labels
- **Issue**: Many buttons and inputs lack descriptive labels
- **Priority**: HIGH
- **Impact**: Screen readers can't identify element purposes

### 2. No Keyboard Navigation
- **Issue**: Dropdown menus and modals not keyboard accessible
- **Priority**: HIGH
- **Impact**: Users with motor disabilities can't navigate

### 3. Color-Only Information
- **Issue**: INR status relies only on color coding
- **Priority**: MEDIUM
- **Impact**: Color-blind users can't distinguish status

### 4. Missing Focus Management
- **Issue**: No focus indicators or trap in modals
- **Priority**: MEDIUM
- **Impact**: Keyboard users lose navigation context

### 5. No Screen Reader Chart Support
- **Issue**: Charts are visual-only, no alternative text
- **Priority**: HIGH
- **Impact**: Blind users can't access chart data

## Implementation Plan

### Phase 1: ARIA Labels and Descriptions
```html
<!-- Enhanced form inputs -->
<label for="inrValue" class="block text-sm font-medium text-gray-700 mb-1">
    ערך INR
    <span class="sr-only">הכנס ערך INR בין 0.8 ל-10</span>
</label>
<input 
    type="number" 
    id="inrValue" 
    aria-describedby="inr-help"
    aria-invalid="false"
    aria-required="true"
    step="0.1" 
    min="0.8" 
    max="10" 
    required 
    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
    placeholder="2.5"
>
<div id="inr-help" class="sr-only">
    ערך INR רגיל נע בין 2.0 ל-3.0 עבור רוב המטופלים
</div>

<!-- Enhanced buttons -->
<button 
    type="submit" 
    aria-describedby="submit-help"
    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
>
    <i data-lucide="plus-circle" class="w-5 h-5" aria-hidden="true"></i>
    הוסף מדידה וחשב המלצה
</button>
<div id="submit-help" class="sr-only">
    לחיצה על כפתור זה תוסיף את המדידה החדשה ותחשב המלצת מינון
</div>
```

### Phase 2: Keyboard Navigation
```javascript
// Enhanced dropdown navigation
function enhanceDropdownAccessibility() {
    const dropdowns = document.querySelectorAll('[role="button"]');
    
    dropdowns.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
            if (e.key === 'Escape') {
                closeAllMenus();
                this.focus();
            }
        });
    });

    // Menu item navigation
    const menuItems = document.querySelectorAll('[role="menuitem"]');
    menuItems.forEach((item, index) => {
        item.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = menuItems[index + 1] || menuItems[0];
                next.focus();
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = menuItems[index - 1] || menuItems[menuItems.length - 1];
                prev.focus();
            }
            if (e.key === 'Escape') {
                closeAllMenus();
                document.querySelector('[aria-expanded="true"]').focus();
            }
        });
    });
}
```

### Phase 3: Screen Reader Chart Support
```javascript
// Chart accessibility
function makeChartAccessible(chartData) {
    const chartDescription = generateChartDescription(chartData);
    const tableData = generateDataTable(chartData);
    
    return `
        <div class="chart-container" role="img" aria-labelledby="chart-title" aria-describedby="chart-desc">
            <h3 id="chart-title">גרף מגמות INR</h3>
            <p id="chart-desc">${chartDescription}</p>
            <canvas id="inrChart"></canvas>
            
            <!-- Data table for screen readers -->
            <div class="sr-only">
                <h4>נתוני הגרף בפורמט טבלה</h4>
                <table>
                    <thead>
                        <tr>
                            <th>תאריך</th>
                            <th>ערך INR</th>
                            <th>מינון</th>
                            <th>סטטוס</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableData}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function generateChartDescription(data) {
    const latest = data[data.length - 1];
    const trend = calculateTrend(data);
    const inRange = data.filter(d => d.inr >= 2.0 && d.inr <= 3.0).length;
    
    return `הגרף מציג ${data.length} מדידות INR. 
            המדידה האחרונה: ${latest.inr} מתאריך ${latest.date}. 
            ${inRange} מדידות מתוך ${data.length} בטווח היעד. 
            המגמה: ${trend}`;
}
```

### Phase 4: Focus Management
```css
/* Enhanced focus indicators */
:focus {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
}

.focus-trap {
    position: relative;
}

.focus-trap::before,
.focus-trap::after {
    content: '';
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
}
```

### Phase 5: Alternative Text and Labels
```html
<!-- Status indicators with text alternatives -->
<div class="status-indicator" role="status" aria-live="polite">
    <span class="status-color bg-green-500" aria-hidden="true"></span>
    <span class="status-text">בטווח היעד</span>
    <span class="sr-only">מצב INR: ערך 2.3 נמצא בטווח היעד של 2.0-3.0</span>
</div>

<!-- Icons with proper labeling -->
<i data-lucide="heart" aria-label="בריאות הלב" class="w-5 h-5"></i>
<i data-lucide="activity" aria-hidden="true" class="w-4 h-4"></i>
```

## Testing Checklist

### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with VoiceOver (Mac)
- [ ] Test with JAWS (Windows)

### Keyboard Navigation Testing
- [ ] Tab through entire interface
- [ ] Test dropdown menus with arrow keys
- [ ] Test Escape key behavior
- [ ] Test Enter/Space activation

### Color Blind Testing
- [ ] Test with Deuteranopia filter
- [ ] Test with Protanopia filter
- [ ] Test with Tritanopia filter
- [ ] Ensure status is clear without color 