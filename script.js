const isHomePage = document.getElementById('home-content') !== null;
const isReposPage = document.getElementById('all-projects-section') !== null;
if (isHomePage) {
    let clicks = 0;
    let clickPower = 1;
    let upgradeCost = 10;
    let autoClickerCount = 0;
    let autoClickerCost = 50;
    const gameTrigger = document.getElementById("game-trigger");
    const clickerGameSection = document.getElementById("clicker-game");
    const clickCountSpan = document.getElementById("click-count");
    const upgradeButton = document.getElementById("upgrade-click-power");
    const upgradeCostSpan = document.getElementById("upgrade-cost");
    const upgradeAutoClickerButton = document.getElementById("upgrade-autoclicker");
    const autoClickerCostSpan = document.getElementById("autoclicker-cost");
    const autoClickerCountSpan = document.getElementById("autoclicker-count");
    const clicksPerSecondSpan = document.getElementById("clicks-per-second");

    gameTrigger.addEventListener("click", function() {
        if (clickerGameSection.classList.contains("hidden")) {
            clickerGameSection.classList.remove("hidden");
        }
        clicks += clickPower;
        clickCountSpan.textContent = Math.floor(clicks);
    });

    upgradeButton.addEventListener('click', function() {
        if (clicks >= upgradeCost) {
            clicks -= upgradeCost;
            clickPower += 1;
            upgradeCost = Math.ceil(upgradeCost * 1.5);
            clickCountSpan.textContent = Math.floor(clicks);
            upgradeCostSpan.textContent = upgradeCost;
        }
    });
    upgradeAutoClickerButton.addEventListener('click', function() {
        if (clicks >= autoClickerCost) {
            clicks -= autoClickerCost;
            autoClickerCount += 1;
            autoClickerCost = Math.ceil(autoClickerCost * 1.7);
            clickCountSpan.textContent = Math.floor(clicks);
            autoClickerCostSpan.textContent = autoClickerCost;
            autoClickerCountSpan.textContent = autoClickerCount;
            clicksPerSecondSpan.textContent = autoClickerCount;
        }
    });
    setInterval(() => {
        if (autoClickerCount > 0) {
            clicks += autoClickerCount;
            clickCountSpan.textContent = Math.floor(clicks);
        }
    }, 1000);
}

const username = "dinosaur890123";
async function getGithubRepoCount() {
    try {
        const apiUrl = `https://api.github.com/users/${username}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const repoCount = data.public_repos;
        const repoCountElement = document.getElementById("repo-count");
        repoCountElement.textContent = `I have ${repoCount} public repositories on GitHub!`;
    } catch (error) {
        console.error("Failed to fetch GitHub data:", error);
        const repoCountElement = document.getElementById("repo-count");
        repoCountElement.textContent = "Couldn't load Github repo count";
    }
}
async function getLatestGithubRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`);
        if (!response.ok) throw new Error('Network response was not ok');
        const repos = await response.json();
        const repoListElement = document.getElementById("repo-list");
        repoListElement.innerHTML = ''; 
        repos.slice(0, 6).forEach(repo => {
            const description = repo.description || 'No description';
            repoListElement.innerHTML += `
                <div class="repo-card">
                    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    <p>${description}</p>
                </div>`;
        });
    } catch (error) {
        console.error("Failed to fetch latest github repos", error);
        document.getElementById("repo-list").innerHTML = '<p>Could not load my projects :(</p>';
    }
}
async function getAllGithubRepos() {
    const allRepoListElement = document.getElementById("all-repo-list");
    allRepoListElement.innerHTML = '<p>Loading all repositories...</p>';
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`);
        if (!response.ok) throw new Error('Network response was not ok');
        const repos = await response.json();
        allRepoListElement.innerHTML = '';
        repos.forEach(repo => {
            const description = repo.description || 'No description';
            allRepoListElement.innerHTML += `
                <div class="repo-card">
                    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    <p>${description}</p>
                </div>`;
        });
    } catch (error) {
        console.error("Failed to fetch all github repos", error);
        allRepoListElement.innerHTML = '<p>Could not load my projects :(</p>';
    }
}
function init() {
    if (isHomePage) {
        getGithubRepoCount();
        getLatestGithubRepos();
    }
    if (isReposPage) {
        getAllGithubRepos();
    }
}
init();