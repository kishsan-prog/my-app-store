// 1. CONFIGURATION - Matches your GitHub details
const GITHUB_USER = "kishsan-prog"; 
const REPO_NAME = "my-app-store";
const JSON_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/main/apps.json`;

let allApps = []; // Global variable to store apps for searching

// 2. INITIALIZE STORE
async function initStore() {
    const grid = document.getElementById('app-grid');
    grid.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>Loading apps...</p>";

    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error("Could not fetch apps");
        
        allApps = await response.json();
        renderApps(allApps);
    } catch (error) {
        console.error("Error:", error);
        grid.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>Failed to load apps. Make sure apps.json exists!</p>";
    }
}

// 3. RENDER APPS TO THE GRID
function renderApps(appsToDisplay) {
    const grid = document.getElementById('app-grid');
    
    if (appsToDisplay.length === 0) {
        grid.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>No apps found.</p>";
        return;
    }

    grid.innerHTML = appsToDisplay.map(app => `
        <div class="app-card">
            <img src="${app.icon || 'https://via.placeholder.com/60'}" alt="${app.name} icon">
            <div class="app-details">
                <h4 style="margin:0; font-size: 1.1rem;">${app.name}</h4>
                <small style="color: #86868b;">${app.category}</small>
            </div>
            <button class="get-btn" onclick="window.open('${app.link}', '_blank')">GET</button>
        </div>
    `).join('');
}

// 4. SEARCH LOGIC (Scales to 1000+ apps easily)
document.getElementById('appSearch').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    const filteredApps = allApps.filter(app => 
        app.name.toLowerCase().includes(searchTerm) || 
        app.category.toLowerCase().includes(searchTerm)
    );
    
    renderApps(filteredApps);
});

// 5. SUBMIT BUTTON LOGIC
// Instead of a database, we direct users to create a GitHub Issue.
// This allows you to "Approve" apps before they show up.
document.getElementById('openModal').onclick = () => {
    const title = encodeURIComponent("App Submission: [App Name]");
    const body = encodeURIComponent(
        "Please provide the following details:\n\n" +
        "- App Name:\n" +
        "- Category:\n" +
        "- Icon URL (100x100):\n" +
        "- Download/Website Link:"
    );
    
    const githubSubmissionUrl = `https://github.com/${GITHUB_USER}/${REPO_NAME}/issues/new?title=${title}&body=${body}`;
    
    // Open the submission link in a new tab
    window.open(githubSubmissionUrl, '_blank');
};

// Start the app
initStore();
