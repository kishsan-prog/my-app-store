// 1. CONFIGURATION
const GITHUB_USER = "kishsan-prog"; 
const REPO_NAME = "my-app-store";
const JSON_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/main/apps.json`;

let allApps = []; // Memory storage for searching 1000+ apps
let deferredPrompt; // For the PWA install prompt

// 2. INITIALIZE THE STORE
async function initStore() {
    const grid = document.getElementById('app-grid');
    grid.innerHTML = "<p style='text-align:center; grid-column: 1/-1; padding: 50px;'>Loading Store...</p>";

    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error("Data not found");
        
        allApps = await response.json();
        renderApps(allApps);
    } catch (error) {
        console.error("Error:", error);
        grid.innerHTML = `
            <div style="text-align:center; grid-column: 1/-1; padding: 50px;">
                <p>Unable to load apps.</p>
                <small>Make sure apps.json is uploaded to your GitHub repo.</small>
            </div>`;
    }
}

// 3. RENDER APPS TO THE GRID
function renderApps(appsToDisplay) {
    const grid = document.getElementById('app-grid');
    
    if (appsToDisplay.length === 0) {
        grid.innerHTML = "<p style='text-align:center; grid-column: 1/-1; color: gray;'>No apps match your search.</p>";
        return;
    }

    grid.innerHTML = appsToDisplay.map(app => `
        <div class="app-card">
            <img src="${app.icon || 'https://via.placeholder.com/62'}" alt="${app.name}">
            <div class="app-details">
                <h4>${app.name}</h4>
                <small>${app.category}</small>
            </div>
            <button class="get-btn" onclick="window.open('${app.link}', '_blank')">GET</button>
        </div>
    `).join('');
}

// 4. SEARCH FUNCTIONALITY
document.getElementById('appSearch').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allApps.filter(app => 
        app.name.toLowerCase().includes(searchTerm) || 
        app.category.toLowerCase().includes(searchTerm)
    );
    renderApps(filtered);
});

// 5. PWA INSTALL LOGIC (Chrome Mobile)
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome from showing its own prompt automatically
    e.preventDefault();
    deferredPrompt = e;
    // Show the install button now that we know the app is installable
    document.getElementById('installBtn').style.display = 'block';
});

document.getElementById('installBtn').onclick = async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response: ${outcome}`);
        deferredPrompt = null;
    } else {
        alert("To install: Tap the Menu (⋮) or Share button and select 'Add to Home Screen'");
    }
};

// 6. SUBMIT BUTTON REDIRECT
document.getElementById('openModal').onclick = () => {
    const title = encodeURIComponent("App Submission: [App Name]");
    const body = encodeURIComponent(
        "Please fill in the details below:\n\n" +
        "App Name: \n" +
        "Category: \n" +
        "Icon URL: \n" +
        "Link: "
    );
    window.open(`https://github.com/${GITHUB_USER}/${REPO_NAME}/issues/new?title=${title}&body=${body}`, '_blank');
};

// Start the engine
initStore();
