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
})
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
})
async function getGithubRepoCount() {
    try {
        const username = "dinosaur890123";
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
getGithubRepoCount();