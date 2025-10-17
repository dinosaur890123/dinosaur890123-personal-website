const isHomePage = document.getElementById('home-content') !== null;
const isReposPage = document.getElementById('all-projects-section') !== null;
if (isHomePage) {
    let clicks = 0;
    let clickPower = 1;
    let upgradeCost = 10;
    let autoClickerCount = 0;
    let autoClickerCost = 50;
    let prestigeLevel = 0;
    let prestigeCost = 1000000;
    const gameTrigger = document.getElementById("game-trigger");
    const clickerGameSection = document.getElementById("clicker-game");
    const clickCountSpan = document.getElementById("click-count");
    const upgradeButton = document.getElementById("upgrade-click-power");
    const upgradeCostSpan = document.getElementById("upgrade-cost");
    const upgradeAutoClickerButton = document.getElementById("upgrade-autoclicker");
    const autoClickerCostSpan = document.getElementById("autoclicker-cost");
    const autoClickerCountSpan = document.getElementById("autoclicker-count");
    const clicksPerSecondSpan = document.getElementById("clicks-per-second");
    const prestigeButton = document.getElementById('prestige-button');
    const prestigeLevelSpan = document.getElementById('prestige-level');
    const prestigeBoostSpan = document.getElementById('prestige-boost');
    const prestigeCostSpan = document.getElementById('prestige-cost');
    const STORAGE_KEY = 'clickerGameState';
    function saveProgress() {
        const gameState = {
            clicks,
            clickPower,
            upgradeCost,
            autoClickerCount,
            autoClickerCost,
            prestigeLevel,
            prestigeCost
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
    function loadProgress() {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            const gameState = JSON.parse(savedState);
            clicks = gameState.clicks || 0;
            clickPower = gameState.clickPower || 1;
            upgradeCost = gameState.upgradeCost || 10;
            autoClickerCount = gameState.autoClickerCount || 0;
            autoClickerCost = gameState.autoClickerCost || 50;
            prestigeLevel = gameState.prestigeLevel || 0;
            prestigeCost = gameState.prestigeCost || 1000000;
        }
        updateUI();
    }
    function getPrestigeBoost() {
        return 1 + prestigeLevel * 0.5;
    }
    function updateUI() {
        clickCountSpan.textContent = Math.floor(clicks);
        upgradeCostSpan.textContent = upgradeCost;
        autoClickerCostSpan.textContent = autoClickerCost;
        autoClickerCountSpan.textContent = autoClickerCount;
        const cps = autoClickerCount * getPrestigeBoost();
        clicksPerSecondSpan.textContent = cps.toFixed(1);
        prestigeLevelSpan.textContent = prestigeLevel;
        prestigeBoostSpan.textContent = prestigeLevel * 50;
        prestigeCostSpan.textContent = prestigeCost.toLocaleString();
    }
    loadProgress();
    gameTrigger.addEventListener("click", function() {
        markEasterEggAsFound('clickerGame');
        if (clickerGameSection.classList.contains("hidden")) {
            clickerGameSection.classList.remove("hidden");
        }
        clicks += clickPower;
        updateUI();
        saveProgress();
    });

    upgradeButton.addEventListener('click', function() {
        if (clicks >= upgradeCost) {
            clicks -= upgradeCost;
            clickPower += 1;
            upgradeCost = Math.ceil(upgradeCost * 1.3);
            updateUI();
            saveProgress();
        }
    });
    upgradeAutoClickerButton.addEventListener('click', function() {
        if (clicks >= autoClickerCost) {
            clicks -= autoClickerCost;
            autoClickerCount += 1;
            autoClickerCost = Math.ceil(autoClickerCost * 1.4);
            updateUI();
            saveProgress();
        }
    });
    prestigeButton.addEventListener('click', function() {
        if (clicks >= prestigeCost) {
            prestigeLevel++;
            prestigeCost = Math.ceil(prestigeCost * 5);
            clicks = 0;
            clickPower = 1;
            upgradeCost = 10;
            autoClickerCount = 0;
            autoClickerCost = 50;
            updateUI();
            saveProgress();
        }
    })
    setInterval(() => {
        if (autoClickerCount > 0) {
            clicks += autoClickerCount;
            clickCountSpan.textContent = Math.floor(clicks);
            updateUI();
            saveProgress();
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
            const language = repo.language ? `<p class="repo-language">${repo.language}</p>` : '';
            repoListElement.innerHTML += `
                <div class="repo-card">
                    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    <p>${description}</p>
                    ${language}
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
function enableRepoSearch() {
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            const repoCards = document.querySelectorAll('#all-repo-list .repo-card');
            repoCards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                if (cardText.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}
const totalEasterEggs = 2;
function updateEasterEggDisplay() {
    const tracker = document.getElementById('easter-egg-tracker');
    if (!tracker) return;
    let foundEggs = JSON.parse(localStorage.getItem('foundEasterEggs')) || {};
    let foundCount = Object.keys(foundEggs).filter(key => foundEggs[key]).length;
    tracker.textContent = `Easter Eggs Found: ${foundCount} / ${totalEasterEggs}`;
}
function markEasterEggAsFound(eggName) {
    let foundEggs = JSON.parse(localStorage.getItem('foundEasterEggs')) || {};
    if (!foundEggs[eggName]) {
        foundEggs[eggName] = true;
        localStorage.setItem('foundEasterEggs', JSON.stringify(foundEggs));
        updateEasterEggDisplay();
    }
}
function annoyingNavigation() { // it doesn't bother you that much right?
    const nav = document.querySelector('nav');
    if (nav) {
        const homeLink = nav.querySelector('a[href="index.html"]');
        const reposLink = nav.querySelector('a[href="repos.html"]');
        if (homeLink && reposLink) {
            nav.addEventListener('mouseenter', () => {
                nav.insertBefore(reposLink, homeLink);
            });
            nav.addEventListener('mouseleave', () => {
                nav.insertBefore(homeLink, reposLink);
            });
        }
    }
}
function enableTooltips() {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    document.querySelectorAll('.tool-item').forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const tooltipText = item.getAttribute('data-tooltip');
            if (tooltipText) {
                tooltip.textContent = tooltipText;
                tooltip.style.opacity = '1';
            }
        });
        item.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
        item.addEventListener('mousemove', (e) => {
            tooltip.style.left = `${e.clientX + 15}px`;
            tooltip.style.top = `${e.clientY + 15}px`;
        })
    });
}
function init() {
    if (isHomePage) {
        getGithubRepoCount();
        getLatestGithubRepos();
    }
    if (isReposPage) {
        getAllGithubRepos();
        enableRepoSearch();
        markEasterEggAsFound('annoyingNavigation');
    }
    annoyingNavigation();
    updateEasterEggDisplay();
    enableTooltips();
}
init();