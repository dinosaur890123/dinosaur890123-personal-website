const messageButton = document.getElementById("messageButton");
const messageText = document.getElementById("messageText");
messageButton.addEventListener('click', function() {
    messageText.textContent = "you clicked the button!";
});
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