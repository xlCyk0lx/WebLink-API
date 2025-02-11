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
    // Server Info
    document.querySelector('#server-info .stat-content').innerHTML = `
        <p>Name: ${data.name || 'N/A'}</p>
        <p>Version: ${data.version || 'N/A'}</p>
        <p>Status: ${data.online ? 'Online' : 'Offline'}</p>
    `;
    
    // Player Count
    if (data.players) {
        const playerCount = Object.keys(data.players).length;
        document.querySelector('#player-count .stat-content').innerHTML = `
            <p>Online: ${playerCount}</p>
        `;
        
        // Player List
        const playerList = document.getElementById('players');
        playerList.innerHTML = '';
        Object.entries(data.players).forEach(([name, info]) => {
            playerList.innerHTML += `
                <div class="player-card">
                    <h4>${name}</h4>
                    <p>Health: ${info.health || 'N/A'}</p>
                    <p>World: ${info.world || 'N/A'}</p>
                </div>
            `;
        });
    }
    
    // Performance
    if (data.performance) {
        document.querySelector('#performance .stat-content').innerHTML = `
            <p>TPS: ${data.performance.tps || 'N/A'}</p>
            <p>Memory: ${formatMemory(data.performance.memory)}</p>
        `;
    }
}

function formatMemory(memory) {
    if (!memory) return 'N/A';
    return `${Math.round(memory / (1024 * 1024))} MB`;
}

// Start updates when page loads
document.addEventListener('DOMContentLoaded', startRealTimeUpdates);

// Make logout function available globally
window.logout = function() {
    localStorage.removeItem('api_key');
    window.location.href = '/';
};
