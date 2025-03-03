const clientId = "134612599989679311";
const redirectUri = "http://localhost/discord.html"; // Change to your website's URL
const scope = "identify";
const authUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
  redirectUri
)}&response_type=token&scope=${scope}`;

document.getElementById("connectDiscord").addEventListener("click", () => {
  window.location.href = authUrl;
});

// Function to get URL parameters (to extract token)
function getAccessToken() {
  const params = new URLSearchParams(window.location.hash.substring(1));
  return params.get("access_token");
}

// Fetch user data from Discord API
async function fetchDiscordUser(token) {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    console.error("Failed to fetch user data");
    return;
  }

  const data = await response.json();
  displayUserData(data);
}

// Display user info after authentication
function displayUserData(user) {
  document.getElementById("userInfo").style.display = "block";
  document.getElementById(
    "username"
  ).textContent = `${user.username}#${user.discriminator}`;
  document.getElementById(
    "avatar"
  ).src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
}

// Auto-run if returning from Discord OAuth
const token = getAccessToken();
if (token) {
  fetchDiscordUser(token);
}
