import {initializeApp} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {getAuth, signInAnonymously} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {getFirestore, collection, addDoc, query, onSnapshot, serverTimestamp, setLogLevel} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
let db, auth;

const tabsContainer = document.querySelector('.tabs');
const newTabButton = document.getElementById('new-tab-button');
const newTabMenu = document.getElementById('new-tab-menu');
const contentPanes = document.querySelectorAll('.content-pane');
function deactivateAllTabs() {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content-pane').forEach(p => p.classList.remove('active'));
}
function switchTab(tabElement) {
    if (!tabElement) return;
    deactivateAllTabs();
    tabElement.classList.add('active');
    const targetId = tabElement.dataset.target;
    const targetPane = document.getElementById(targetId);
    if (targetPane) {
        targetPane.classList.add('active');
    }
}
function createNewTab(targetId, title) {
    const existingTab = document.querySelector(`.tab[data-target="${targetId}"]`);
    if (existingTab) {
        switchTab(existingTab);
        return;
    }
    const newTab = document.createElement('div');
    newTab.className = 'tab';
    newTab.dataset.target = targetId;
    newTab.innerHTML = `${title} <span class="close-tab">x</span>`;
    tabsContainer.insertBefore(newTab, newTabButton);
    switchTab(newTab);
}

tabsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-tab')) {
        e.stopPropagation();
        const tabToClose = e.target.closest('.tab');
        if (tabToClose) {
            tabToClose.remove();
            const targetId = tabToClose.dataset.target;
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.remove('active');
            }
            const homeTab = document.querySelector('.tab[data-target="home-content"]');
            switchTab(homeTab);
        }
    }
    else if (e.target.closest('.tab')) {
        switchTab(e.target.closest('.tab'));
    }
});
newTabButton.addEventListener('click', (e) => {
    e.stopPropagation();
    newTabMenu.classList.toggle('hidden');
    newTabMenu.style.left = `${newTabButton.offsetLeft}px`;
});
newTabMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-item')) {
        const targetId = e.target.dataset.target;
        const title = e.target.dataset.title;
        createNewTab(targetId, title);
        newTabMenu.classList.add('hidden');
    }
});
window.addEventListener('click', () => {
    if (!newTabMenu.classList.contains('hidden')) {
        newTabMenu.classList.add('hidden');
    }
})
let reposLoaded = false;
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
            clicks += (autoClickerCount * getPrestigeBoost());
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
    updateEasterEggDisplay();
    enableTooltips();
}
if (newTabMenu) {
    newTabMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('menu-item')) {
            const targetId = e.target.dataset.target;
            const title = e.target.dataset.title;
            if (targetId === 'repos-content' && !reposLoaded) {
                getAllGithubRepos();
                enableRepoSearch();
                reposLoaded = true;
            }
            if (targetId === 'guestbook-content' && !guestbookLoaded) {
                initGuestbook();
                guestbookLoaded = true;
            }
            createNewTab(targetId, title);
            newTabMenu.classList.add('hidden');
        }
    })
}
function initGuestbook() {
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookEntries = document.getElementById('guestbook-entries');
    if (guestbookForm) {
        guestbookForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('guest-name');
            const messageInput = document.getElementById('guest-message');
            const submitButton = guestbookForm.querySelector('button[type="submit"]');
            const name = nameInput.value.trim();
            const message = messageInput.value.trim();
            if (name && message) {
                submitButton.disabled = true;
                submitButton.textContent = 'Posting...';
                try {
                    const guestbookCol = collection(db, 'guestbook');
                    await addDoc(guestbookCol, {
                        name: name,
                        message: message,
                        createdAt: serverTimestamp()
                    });
                    nameInput.value = '';
                    messageInput.value = '';
                } catch (error) {
                    console.error("Error adding document: ", error);
                    alert("Error saving message. Try again pls.");
                } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Sign Guestbook';
                }
            }
        });
    }
    if (guestbookEntries) {
        const guestbookCol = collection(db, 'guestbook');
        const q = query(guestbookCol); 
        onSnapshot(q, (snapshot) => {
            guestbookEntries.innerHTML = '';
            let entries = [];
            snapshot.docs.forEach(doc => {
                entries.push(doc.data());
            });
            entries.sort((a,b) => {
                const aTime = a.createdAt?.seconds || 0;
                const bTime = b.createdAt?.seconds || 0;
                return bTime - aTime;
            });
            if (entries.length === 0) {
                guestbookEntries.innerHTML = '<p>No entries yet. Be the first!</p>';
                return;
            }
            entries.forEach(entry => {
                const entryEl = document.createElement('div');
                entryEl.className = 'guestbook-entry';
                const entryHeader = document.createElement('h4');
                entryHeader.textContent = entry.name;
                if (entry.createdAt) {
                    const date = new Date(entry.createdAt.seconds * 1000);
                    const dateSpan = document.createElement('span');
                    dateSpan.className = 'entry-date';
                    dateSpan.textContent = date.toLocaleString();
                    entryHeader.appendChild(dateSpan);
                }
                const entryMsg = document.createElement('p');
                entryMsg.textContent = entry.message;
                entryEl.appendChild(entryHeader);
                entryEl.appendChild(entryMsg);
                guestbookEntries.appendChild(entryEl);
            });
        }, (error) => {
            console.error("Error fetching guestbook", error);
            guestbookEntries.innerHTML = '<p>Could not load guestbook entries.</p>';
        });
    }
}
(async () => {
    try {
        const firebaseConfig = {
        apiKey: "AIzaSyD2oElbev2pExyoThX6b0xRyuiWeWhmdKs",
        authDomain: "dinosaur890123-personal-site.firebaseapp.com",
        projectId: "dinosaur890123-personal-site",
        storageBucket: "dinosaur890123-personal-site.firebasestorage.app",
        messagingSenderId: "318702901263",
        appId: "1:318702901263:web:8c63a8d18d29eddb266b7a"
    };
    if (firebaseConfig.apiKey === "AIzaSyD2oElbev2pExyoThX6b0xRyuiWeWhmdKs") {
        const contentArea = document.getElementById('browser-content-area');
        if (contentArea) {
            contentArea.innerHTML = `
            <div>
                <h2>Config error<h2>
                <p>Firebase project keys missing</p>
            </div>
            `;
        }
        return;
    }
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    setLogLevel('Debug');
    await signInAnonymously(auth);
    console.log('Firebase auth completed. User UID:', auth.currentUser?.uid);
    init();
    } catch (error) {
        console.error("Firebase failed", error);
        const contentArea = document.getElementById('browser-content-area');
        if (contentArea) {
            contentArea.innerHTML = `
            <div>
                <h2>Connection error</h2>
            </div>
            `
        }
    }
})();