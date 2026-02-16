// Detect search queries on Google, Bing, etc.
function detectTechnology() {
    const url = new URL(window.location.href);
    let query = "";

    if (url.hostname.includes("google.com") || url.hostname.includes("bing.com")) {
        query = url.searchParams.get("q");
    } else if (url.hostname.includes("github.com")) {
        // If on GitHub, detection might be based on repo name or description
        const pathParts = url.pathname.split("/").filter(p => p);
        if (pathParts.length >= 2) {
            query = `GitHub project: ${pathParts[0]}/${pathParts[1]}`;
        }
    }

    if (query && query.length > 3) {
        chrome.runtime.sendMessage({ type: "TECH_SEARCH_DETECTED", query: query });
    }
}

// Run on load
detectTechnology();

// Also detect on popstate (for SPA navigations if applicable)
window.addEventListener("popstate", detectTechnology);
