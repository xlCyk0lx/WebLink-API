import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-analytics.js";

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
const analytics = getAnalytics(app);
const database = getDatabase(app);

async function checkApiKey() {
    const apiKey = document.getElementById('api-key').value;
    
    try {
        const serverRef = ref(database, 'servers/' + apiKey);
        const snapshot = await get(serverRef);
        
        if (snapshot.exists()) {
            localStorage.setItem('api_key', apiKey);
            window.location.href = '/dashboard.html';
        } else {
            alert('Invalid API key');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error checking API key');
    }
}

async function setupCredentials() {
    const username = document.getElementById('setup-username').value;
    const password = document.getElementById('setup-password').value;
    const apiKey = localStorage.getItem('api_key');
    
    const userRef = ref(database, 'users/' + apiKey);
    try {
        await set(userRef, {
            username: username,
            password: password,
            setupComplete: true
        });
        window.location.href = '/dashboard.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Error setting up credentials');
    }
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const apiKey = localStorage.getItem('api_key');
    
    const userRef = ref(database, 'users/' + apiKey);
    try {
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        
        if (userData && userData.username === username && userData.password === password) {
            window.location.href = '/dashboard.html';
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error during login');
    }
}

function logout() {
    localStorage.removeItem('api_key');
    window.location.href = '/';
}

// Real-time server data updates
function startServerUpdates() {
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) return;

    const serverRef = ref(database, 'servers/' + apiKey);
    onValue(serverRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            updateDashboardData(data);
        }
    });
}

function updateDashboardData(data) {
    // Update server info
    if (document.querySelector('#server-info')) {
        document.querySelector('#server-info .stat-content').innerHTML = `
            <p>Name: ${data.name || 'N/A'}</p>
            <p>Version: ${data.version || 'N/A'}</p>
            <p>Status: ${data.online ? 'Online' : 'Offline'}</p>
        `;
    }

    // Update player count if available
    if (data.players && document.querySelector('#player-count')) {
        document.querySelector('#player-count .stat-content').innerHTML = `
            <p>Online: ${Object.keys(data.players).length}</p>
        `;
    }
}

// Make functions available globally
window.checkApiKey = checkApiKey;
window.setupCredentials = setupCredentials;
window.login = login;
window.logout = logout;
window.startServerUpdates = startServerUpdates;

// Initialize real-time updates if on dashboard
if (window.location.pathname.includes('dashboard')) {
    startServerUpdates();
}
