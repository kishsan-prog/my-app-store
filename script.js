const GITHUB_USER = "kishsan-prog";
const REPO_NAME = "my-app-store";
const JSON_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/main/apps.json`;

let apps = [];

// 1. Fetch data from GitHub
async function loadApps() {
    try {
        const response = await fetch(JSON_URL);
        apps = await response.json();
        render(apps);
    } catch (e) {
        console.log("Using local fallback...");
        // Fallback for testing before you upload to GitHub
        apps = [{ name: "Sample App", category: "Social", icon: "https://via.placeholder.com/60" }];
        render(apps);
    }
}

// 2. Display Apps
function render(data) {
    const grid = document.getElementById('app-grid');
    grid.innerHTML = data.map(app => `
        <div class="app-card">
            <img src="${app.icon}">
            <div>
                <h4 style="margin:0">${app.name}</h4>
                <small style="color:gray">${app.category}</small>
            </div>
            <button class="get-btn">GET</button>
        </div>
    `).join('');
}

// 3. Search functionality
document.getElementById('appSearch').addEventListener('input', (e) => {
    const filtered = apps.filter(a => a.name.toLowerCase().includes(e.target.value.toLowerCase()));
    render(filtered);
});

// Modal toggle
document.getElementById('openModal').onclick = () => document.getElementById('modal').style.display = 'flex';

loadApps();