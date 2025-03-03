const clientId = "1346125999896793118"; // Your Discord Client ID
const redirectUri = "https://rbxlunarhub.github.io/washception/LunareeWebsite"; // Your redirect URI
const clientSecret = "YOUR_CLIENT_SECRET"; // Don't expose this in client-side JS; use a backend in production
const authUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
  redirectUri
)}&scope=identify`;

document.getElementById("connectDiscord").addEventListener("click", () => {
  window.location.href = authUrl;
});

// Function to get the authorization code from URL
function getAuthCode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}

// Exchange code for access token
async function getAccessToken(code) {
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    console.error("Failed to get access token");
    return null;
  }

  return response.json();
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

// Handle OAuth2 flow
window.onload = async () => {
  const code = getAuthCode();
  if (code) {
    const tokenData = await getAccessToken(code);
    if (tokenData && tokenData.access_token) {
      fetchDiscordUser(tokenData.access_token);
    }
  }
};
