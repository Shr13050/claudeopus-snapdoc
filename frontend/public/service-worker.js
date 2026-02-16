// ========================================
// SNAPDOC AUTO-DETECTION SERVICE WORKER
// ========================================

console.log('🚀 SnapDoc Service Worker Active');

// Configure side panel behavior
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

// ========================================
// TECH DOMAIN DETECTION
// ========================================

const TECH_DOMAINS = [
    // Documentation Sites
    'docs.', 'documentation.', 'dev.', 'developer.',

    // Popular Tech Sites
    'github.com', 'gitlab.com', 'bitbucket.org',
    'stackoverflow.com', 'stackexchange.com',
    'npmjs.com', 'pypi.org', 'packagist.org',
    'reactjs.org', 'react.dev', 'vuejs.org', 'angular.io',
    'nodejs.org', 'python.org', 'ruby-lang.org',
    'rust-lang.org', 'golang.org', 'kotlinlang.org',

    // Cloud & DevOps
    'aws.amazon.com', 'cloud.google.com', 'azure.microsoft.com',
    'vercel.com', 'netlify.com', 'heroku.com',
    'docker.com', 'kubernetes.io',

    // Frameworks & Tools
    'nextjs.org', 'nuxt.com', 'svelte.dev',
    'tailwindcss.com', 'getbootstrap.com',
    'mongodb.com', 'postgresql.org', 'redis.io',
    'graphql.org', 'apollographql.com',

    // Learning Platforms
    'freecodecamp.org', 'codecademy.com',
    'udemy.com', 'coursera.org', 'edx.org',

    // Tech Blogs
    'medium.com', 'dev.to', 'hashnode.com',
    'css-tricks.com', 'smashingmagazine.com'
];

const TECH_KEYWORDS = [
    'api', 'sdk', 'cli', 'framework', 'library',
    'tutorial', 'guide', 'documentation', 'docs',
    'install', 'setup', 'getting-started',
    'typescript', 'javascript', 'python', 'java', 'rust', 'go',
    'react', 'vue', 'angular', 'svelte', 'node',
    'docker', 'kubernetes', 'aws', 'cloud',
    'database', 'mongodb', 'postgres', 'redis',
    'authentication', 'oauth', 'jwt', 'graphql'
];

function isTechRelated(url, title = '') {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        const pathname = urlObj.pathname.toLowerCase();
        const titleLower = title.toLowerCase();

        // Skip search engines and social media
        const skipDomains = ['google.com', 'bing.com', 'facebook.com',
                             'twitter.com', 'instagram.com', 'linkedin.com',
                             'amazon.com', 'ebay.com', 'youtube.com'];

        if (skipDomains.some(domain => hostname.includes(domain))) {
            return false;
        }

        // Check if domain matches tech sites
        if (TECH_DOMAINS.some(domain => hostname.includes(domain))) {
            return true;
        }

        // Check URL path for tech keywords
        if (TECH_KEYWORDS.some(keyword => pathname.includes(keyword))) {
            return true;
        }

        // Check page title for tech keywords
        if (TECH_KEYWORDS.some(keyword => titleLower.includes(keyword))) {
            return true;
        }

        return false;
    } catch (error) {
        console.error('URL parsing error:', error);
        return false;
    }
}

// ========================================
// AUTO-OPEN LOGIC
// ========================================

let lastAnalyzedUrl = null;
let lastAnalyzedTime = 0;
const COOLDOWN_MS = 5000; // 5 seconds cooldown between auto-opens

async function handleTechDetection(tabId, url, title) {
    const now = Date.now();

    // Prevent duplicate analysis
    if (url === lastAnalyzedUrl && (now - lastAnalyzedTime) < COOLDOWN_MS) {
        return;
    }

    if (isTechRelated(url, title)) {
        console.log('🎯 Tech domain detected:', url);

        lastAnalyzedUrl = url;
        lastAnalyzedTime = now;

        try {
            // Extract domain name for analysis
            const urlObj = new URL(url);
            const domain = urlObj.hostname.replace('www.', '');

            // Open side panel automatically
            await chrome.sidePanel.open({ tabId });

            // Wait a bit for panel to open, then send message
            setTimeout(() => {
                chrome.runtime.sendMessage({
                    type: 'AUTO_TECH_DETECTED',
                    data: {
                        url,
                        domain,
                        title
                    }
                });
            }, 500);

            console.log('✅ Side panel opened and analysis triggered');
        } catch (error) {
            console.error('Error opening side panel:', error);
        }
    }
}

// ========================================
// TAB LISTENERS
// ========================================

// Listen for tab updates (page load, URL change)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        handleTechDetection(tabId, tab.url, tab.title || '');
    }
});

// Listen for tab activation (switching tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        if (tab.url && tab.status === 'complete') {
            handleTechDetection(activeInfo.tabId, tab.url, tab.title || '');
        }
    } catch (error) {
        console.error('Error getting active tab:', error);
    }
});

console.log('✨ SnapDoc auto-detection enabled');
