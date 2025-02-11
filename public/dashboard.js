import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue, get, set } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDQ9k2pPBp7hwWwuHXkdYKiwSIJxY3-evE",
    authDomain: "weblink-api-21e8b.firebaseapp.com",
    databaseURL: "https://weblink-api-21e8b-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "weblink-api-21e8b",
    storageBucket: "weblink-api-21e8b.firebasestorage.app",
    messagingSenderId: "472066780349",
    appId: "1:472066780349:web:5fecba38082c61a08f1bd4",
    measurementId: "G-WHN7SXVBDV"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function startRealTimeUpdates() {
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) {
        window.location.href = '/';
        return;
    }

    const serverRef = ref(database, 'servers/' + apiKey);
    onValue(serverRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            updateDashboard(data);
            checkAndCreateLink(apiKey);
        }
    });
}

async function checkAndCreateLink(apiKey) {
    console.log("Starting link check for:", apiKey);
    try {
        const linkRef = ref(database, 'links/' + apiKey);
        const snapshot = await get(linkRef);
        console.log("Link data:", snapshot.val());
        
        if (!snapshot.exists()) {
            const uniqueId = generateUniqueId();
            console.log("Creating new link:", uniqueId);
            await set(linkRef, uniqueId);
            displayEmbedCode(uniqueId);
        } else {
            displayEmbedCode(snapshot.val());
        }
    } catch (error) {
        console.log("Link error:", error);
    }
}function generateUniqueId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function updateDashboard(data) {
    // Server Info
    const serverInfo = document.querySelector('#server-info .stat-content');
    serverInfo.innerHTML = `
        <p>Name: ${data.server.name}</p>
        <p>Version: ${data.server.version}</p>
        <p>MOTD: ${data.server.motd}</p>
        <p>API: ${data.server.api_version}</p>
    `;
    
    // Player Count
    const playerCount = document.querySelector('#player-count .stat-content');
    playerCount.innerHTML = `
        <p>Online: ${data.server.online_players}</p>
        <p>Max: ${data.server.max_players}</p>
        <p>Unique Players: ${data.performance.unique_players}</p>
    `;
    
    // Performance Stats
    const performance = document.querySelector('#performance .stat-content');
    performance.innerHTML = `
        <p>TPS: ${data.server.tps}</p>
        <p>Memory: ${formatMemory(data.server.memory.current)}</p>
        <p>Peak Memory: ${formatMemory(data.server.memory.peak)}</p>
        <p>Uptime: ${formatUptime(data.server.uptime)}</p>
    `;
    
    // Player List
    const playerList = document.getElementById('players');
    playerList.innerHTML = '';
    if (data.players) {
        Object.entries(data.players).forEach(([name, info]) => {
            playerList.innerHTML += `
                <div class="player-card">
                    <h4>${name}</h4>
                    <p>Health: ${info.health}/${info.max_health}</p>
                    <p>World: ${info.location.world}</p>
                    <p>Location: ${Math.round(info.location.x)}, ${Math.round(info.location.y)}, ${Math.round(info.location.z)}</p>
                    <p>Gamemode: ${info.gamemode}</p>
                    <p>Food: ${info.food}</p>
                    <p>Playtime: ${formatPlaytime(info.playtime)}</p>
                    <p>Ping: ${info.ping}ms</p>
                    <p>Stats:</p>
                    <ul>
                        <li>Blocks Broken: ${info.stats.blocks_broken}</li>
                        <li>Blocks Placed: ${info.stats.blocks_placed}</li>
                        <li>Deaths: ${info.stats.deaths}</li>
                        <li>Kills: ${info.stats.kills}</li>
                    </ul>
                </div>
            `;
        });
    }

    // Command History
    if (data.history && data.history.commands) {
        const existingHistory = document.querySelector('.command-history');
        if (existingHistory) {
            existingHistory.remove();
        }

        const historyDiv = document.createElement('div');
        historyDiv.className = 'command-history';
        historyDiv.innerHTML = '<h3>Recent Commands</h3>';
        data.history.commands.slice(-5).reverse().forEach(cmd => {
            historyDiv.innerHTML += `
                <div class="command-entry">
                    <span class="time">${formatTimestamp(cmd.time)}</span>
                    <span class="command">${cmd.command}</span>
                </div>
            `;
        });
        document.querySelector('.data-container').appendChild(historyDiv);
    }
}
  function displayEmbedCode(linkId) {
      const embedSection = document.querySelector('#embed-section .stat-content');
    
      // Just the one-line loader script
      const displayCode = `<script src="https://xlcyk0lx.xyz/weblink-loader.js?key=${linkId}"></script>`;

      embedSection.innerHTML = `
          <div class="embed-info">
              <h4>Your Embed Code: <button onclick="copyEmbedCode()" class="copy-btn">Copy Code</button></h4>
              <pre><code id="embed-code">${displayCode}</code></pre>
            
              <h4>Available Variables:</h4>
              <ul class="variables-list">
                  <li><code>$online</code> - Online players</li>
                  <li><code>$maxonline</code> - Max players</li>
                  <li><code>$tps</code> - Server TPS</li>
                  <li><code>$memory</code> - Current RAM usage</li>
                  <li><code>$motd</code> - Server MOTD</li>
                  <li><code>$version</code> - Server version</li>
              </ul>
          </div>
      `;
  }

  window.copyEmbedCode = function() {
      const embedCode = document.getElementById('embed-code').textContent;
      navigator.clipboard.writeText(embedCode);
      const copyBtn = document.querySelector('.copy-btn');
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
          copyBtn.textContent = 'Copy Code';
      }, 2000);
  };
};function formatMemory(bytes) {
    return `${Math.round(bytes / (1024 * 1024))} MB`;
}

function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

function formatPlaytime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

function formatTimestamp(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString();
}

document.addEventListener('DOMContentLoaded', startRealTimeUpdates);

window.logout = function() {
    localStorage.removeItem('api_key');
    window.location.href = '/';
};

