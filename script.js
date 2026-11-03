// Initialize Discord SDK
const discordSdk = new window.DiscordSDK({
  clientId: "YOUR_DISCORD_CLIENT_ID" // Replace with your Developer Portal Client ID later
});

async function setupDiscord() {
  await discordSdk.ready();
}
setupDiscord();

let allGames = [];
const listEl = document.getElementById("game-list");
const statusEl = document.getElementById("status");

// Load library index on startup
async function initLibrary() {
  try {
    const res = await fetch("roms/roms.json");
    allGames = await res.json();
    renderList(allGames);
  } catch (err) {
    statusEl.textContent = "Failed to load ROM index. Check roms.json";
  }
}
initLibrary();

function renderList(games) {
  listEl.innerHTML = "";
  games.forEach(game => {
    const li = document.createElement("li");
    li.textContent = game.title;
    li.onclick = () => loadAndBootGame(game);
    listEl.appendChild(li);
  });
}

// Live search filtering
document.getElementById("search").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  renderList(allGames.filter(g => g.title.toLowerCase().includes(query)));
});

// Fetch ROM binary and prepare to run
async function loadAndBootGame(game) {
  statusEl.textContent = `Loading ${game.title}...`;
  try {
    const response = await fetch(game.file);
    const buffer = await response.arrayBuffer();
    const romBytes = new Uint8Array(buffer);

    statusEl.textContent = `Now Playing: ${game.title}`;
  } catch (err) {
    statusEl.textContent = `Error loading ${game.title}`;
  }
}