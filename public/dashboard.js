let updateInterval;

async function fetchData() {
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) {
        window.location.href = '/';
        return;
    }
    
    try {
        const response = await fetch('/api/data', {
            headers: {
                'Authorization': apiKey
            }
        });
        
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function updateDashboard(data) {
    // Server Info
    document.querySelector('#server-info .stat-content').innerHTML = `
        <p>Name: ${data.server.name}</p>
        <p>Version: ${data.server.version}</p>
        <p>MOTD: ${data.server.motd}</p>
    `;
    
    // Player Count
    document.querySelector('#player-count .stat-content').innerHTML = `
        <p>Online: ${data.server.online_players}/${data.server.max_players}</p>
    `;
    
    // Performance
    document.querySelector('#performance .stat-content').innerHTML = `
        <p>TPS: ${data.performance.tps}</p>
        <p>Memory: ${formatBytes(data.performance.memory.current)}</p>
        <p>Uptime: ${formatUptime(data.performance.uptime)}</p>
    `;
    
    // Player List
    const playerList = document.getElementById('players');
    playerList.innerHTML = '';
    Object.entries(data.players).forEach(([name, info]) => {
        playerList.innerHTML += `
            <div class="player-card">
                <h4>${name}</h4>
                <p>Health: ${info.health}/${info.max_health}</p>
                <p>Location: ${info.location.world} (${Math.round(info.location.x)}, ${Math.round(info.location.y)}, ${Math.round(info.location.z)})</p>
            </div>
        `;
    });
    
    // Activity Log
    const activityLog = document.getElementById('activity-log');
    activityLog.innerHTML = '';
    [...data.history.chat, ...data.history.commands]
        .sort((a, b) => b.time - a.time)
        .slice(0, 10)
        .forEach(activity => {
            activityLog.innerHTML += `
                <div class="activity">
                    <span class="time">${formatTime(activity.time)}</span>
                    <span class="content">${activity.message || activity.command}</span>
                </div>
            `;
        });
}

function formatBytes(bytes) {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
}

function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString();
}

// Start data updates
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    updateInterval = setInterval(fetchData, 5000);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    clearInterval(updateInterval);
});
