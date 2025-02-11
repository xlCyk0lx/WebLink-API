import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";

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

// Initialize Firebase
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
        }
    });
}

function updateDashboard(data) {
    console.log('Received data:', data); // Debug log

    // Server Info
    const serverInfo = document.querySelector('#server-info .stat-content');
    serverInfo.innerHTML = `
        <p>Name: ${data.name || 'N/A'}</p>
        <p>Version: ${data.version || 'N/A'}</p>
        <p>MOTD: ${data.motd || 'N/A'}</p>
    `;
    
    // Player Count
    const playerCount = document.querySelector('#player-count .stat-content');
    if (data.players) {
        const onlinePlayers = Object.keys(data.players).length;
        playerCount.innerHTML = `
            <p>Online: ${onlinePlayers}</p>
            <p>Max: ${data.maxPlayers || 'N/A'}</p>
        `;
        
        // Update Player List
        const playerList = document.getElementById('players');
        playerList.innerHTML = '';
        Object.entries(data.players).forEach(([name, info]) => {
            playerList.innerHTML += `
                <div class="player-card">
                    <h4>${name}</h4>
                    <p>Health: ${info.health || 'N/A'}</p>
                    <p>World: ${info.world || 'N/A'}</p>
                    <p>Location: ${Math.round(info.x || 0)}, ${Math.round(info.y || 0)}, ${Math.round(info.z || 0)}</p>
                </div>
            `;
        });
    }
    
    // Performance Stats
    const performance = document.querySelector('#performance .stat-content');
    if (data.performance) {
        performance.innerHTML = `
            <p>TPS: ${data.performance.tps || 'N/A'}</p>
            <p>Memory: ${formatMemory(data.performance.memory || 0)}</p>
            <p>CPU: ${data.performance.cpu || 'N/A'}%</p>
        `;
    }
}

function formatMemory(bytes) {
    return `${Math.round(bytes / (1024 * 1024))} MB`;
}

// Initialize dashboard updates
document.addEventListener('DOMContentLoaded', startRealTimeUpdates);

// Global logout function
window.logout = function() {
    localStorage.removeItem('api_key');
    window.location.href = '/';
};
