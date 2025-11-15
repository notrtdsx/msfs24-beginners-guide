// ========================================
// Theme Toggle Functionality
// ========================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// ========================================
// Scroll Progress Bar
// ========================================
const progressBar = document.getElementById('progressBar');

window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    progressBar.style.width = scrollPercent + '%';
});

// ========================================
// Smooth Scrolling for Navigation Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// Active TOC Link Highlighting
// ========================================
const sections = document.querySelectorAll('.section');
const tocLinks = document.querySelectorAll('#tocList a');

function highlightTOC() {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    tocLinks.forEach(link => {
        link.style.fontWeight = '400';
        link.style.color = 'var(--text-secondary)';
        
        if (link.getAttribute('href') === '#' + currentSection) {
            link.style.fontWeight = '600';
            link.style.color = 'var(--accent-primary)';
        }
    });
}

window.addEventListener('scroll', highlightTOC);

// ========================================
// Accordion Functionality
// ========================================
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        const isActive = accordionItem.classList.contains('active');
        
        // Close all accordion items
        document.querySelectorAll('.accordion-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            accordionItem.classList.add('active');
        }
    });
});

// ========================================
// Checklist Persistence
// ========================================
const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');

// Load saved checklist state
checkboxes.forEach((checkbox, index) => {
    const savedState = localStorage.getItem(`checklist-${index}`);
    if (savedState === 'true') {
        checkbox.checked = true;
    }
    
    checkbox.addEventListener('change', () => {
        localStorage.setItem(`checklist-${index}`, checkbox.checked);
        updateChecklistProgress();
    });
});

function updateChecklistProgress() {
    const total = checkboxes.length;
    const checked = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
    const percentage = Math.round((checked / total) * 100);
    
    console.log(`Checklist progress: ${checked}/${total} (${percentage}%)`);
}

// ========================================
// Lazy Loading Images (if any added later)
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// Keyboard Navigation
// ========================================
document.addEventListener('keydown', (e) => {
    // Press 'T' to toggle theme
    if (e.key === 't' || e.key === 'T') {
        if (!e.target.matches('input, textarea')) {
            themeToggle.click();
        }
    }
    
    // Press '?' to show keyboard shortcuts (optional feature)
    if (e.key === '?') {
        if (!e.target.matches('input, textarea')) {
            showKeyboardShortcuts();
        }
    }
});

function showKeyboardShortcuts() {
    const shortcuts = {
        'T': 'Toggle dark/light theme',
        '?': 'Show keyboard shortcuts',
        'Esc': 'Close modals'
    };
    
    console.log('Keyboard Shortcuts:', shortcuts);
    // Could display a modal here in future enhancement
}

// ========================================
// Print Optimization
// ========================================
window.addEventListener('beforeprint', () => {
    // Expand all accordion items for printing
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.add('active');
    });
});

window.addEventListener('afterprint', () => {
    // Collapse accordion items after printing
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
    });
});

// ========================================
// Performance Monitoring
// ========================================
window.addEventListener('load', () => {
    // Log page load performance
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    }
});

// ========================================
// Back to Top Button (Optional Enhancement)
// ========================================
function createBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--accent-primary);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-md);
        z-index: 999;
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

createBackToTopButton();

// ========================================
// Section Animations on Scroll
// ========================================
// Removed overly smooth animations to feel more natural

// ========================================
// Copy Code Functionality (if code blocks added)
// ========================================
document.querySelectorAll('code').forEach(codeBlock => {
    // Only add copy button to multi-line code blocks
    if (codeBlock.textContent.split('\n').length > 1) {
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.className = 'copy-button';
        copyButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            padding: 5px 10px;
            background: var(--accent-primary);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
        `;
        
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        codeBlock.parentNode.insertBefore(wrapper, codeBlock);
        wrapper.appendChild(codeBlock);
        wrapper.appendChild(copyButton);
        
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codeBlock.textContent);
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    }
});

// ========================================
// Search Functionality (Basic)
// ========================================
function initSearch() {
    const searchButton = document.createElement('button');
    searchButton.innerHTML = '🔍';
    searchButton.className = 'search-button';
    searchButton.setAttribute('aria-label', 'Search');
    searchButton.style.cssText = `
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: 8px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 1.25rem;
        margin-left: 10px;
        transition: all 0.15s ease;
    `;
    
    const navContainer = document.querySelector('.nav-container');
    const logoContainer = document.querySelector('.logo');
    navContainer.insertBefore(searchButton, navContainer.querySelector('.theme-toggle'));
    
    searchButton.addEventListener('click', () => {
        const searchTerm = prompt('Search the guide:');
        if (searchTerm) {
            performSearch(searchTerm);
        }
    });
}

function performSearch(term) {
    const content = document.querySelector('.content');
    const text = content.textContent.toLowerCase();
    const searchTerm = term.toLowerCase();
    
    if (text.includes(searchTerm)) {
        // Find and scroll to first occurrence
        const walker = document.createTreeWalker(
            content,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.toLowerCase().includes(searchTerm)) {
                const element = node.parentElement;
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Highlight the match temporarily
                const originalBg = element.style.background;
                element.style.background = 'rgba(255, 193, 7, 0.3)';
                element.style.transition = 'background 0.5s ease';
                
                setTimeout(() => {
                    element.style.background = originalBg;
                }, 3000);
                
                break;
            }
        }
    } else {
        alert(`No results found for "${term}"`);
    }
}

initSearch();

// ========================================
// Initialize on Load
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('MSFS 2024 Beginner Guide loaded successfully!');
    console.log('Press "T" to toggle theme');
    console.log('Press "?" to see keyboard shortcuts');
    
    // Initial TOC highlight
    highlightTOC();
    
    // Initial checklist progress
    updateChecklistProgress();
});
