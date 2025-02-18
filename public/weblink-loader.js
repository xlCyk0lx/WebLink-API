(function() {
    const urlParams = new URLSearchParams(document.currentScript.src.split('?')[1]);
    const apiKey = urlParams.get('key');
    console.log("Loading data for API key:", apiKey);

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    function updateVariables(data) {
        window.variables = {
            // Server Info
            name: data.server.name,
            version: data.server.version,
            motd: data.server.motd,
            api_version: data.server.api_version,
            difficulty: formatDifficulty(data.server.difficulty),
            port: data.server.port,
            whitelist: data.server.whitelist ? 'Enabled' : 'Disabled',
            
            // Performance
            tps: data.performance.tps,
            uptime: formatUptime(data.performance.uptime),
            unique_players: data.performance.unique_players,
            peak_players: data.performance.peak_players,
            total_playtime: formatUptime(data.performance.total_playtime),
            
            // Memory
            memory: formatMemory(data.server.memory.current),
            peak_memory: formatMemory(data.server.memory.peak),
            
            // World Info
            world_name: data.worlds.world.name,
            world_difficulty: formatDifficulty(data.worlds.world.difficulty),
            world_entities: data.worlds.world.entity_count,
            world_chunks: data.worlds.world.loaded_chunks,
            world_players: data.worlds.world.player_count,
            world_seed: data.worlds.world.seed,
            world_time: formatGameTime(data.worlds.world.time),
            
            online: data.server.online_players,
            maxonline: data.server.max_players
        };
    }
    function updateContent() {
        const content = document.body.innerHTML;
        const updatedContent = content.replace(/\$(\w+)/g, (match, variable) => {
            return window.variables[variable] ?? match;
        });
        document.body.innerHTML = updatedContent;
    }

    function formatDifficulty(level) {
        const difficulties = {
            0: "Peaceful",
            1: "Easy",
            2: "Normal",
            3: "Hard"
        };
        return difficulties[level] || level;
    }

    function formatGameTime(ticks) {
        // Convert ticks to Minecraft time
        const hour = Math.floor((ticks % 24000) / 1000);
        const minutes = Math.floor(((ticks % 1000) / 1000) * 60);
    
        // Format to 12-hour time with AM/PM
        const period = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    function formatMemory(bytes) {
        if (bytes >= 1073741824) {
            return (bytes / 1073741824).toFixed(2) + ' GB';
        } else {
            return (bytes / 1048576).toFixed(0) + ' MB';
        }
    }
    function formatUptime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }

    async function init() {
        console.log("Starting initialization...");
        await loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
        await loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js');
        
        window.firebaseConfig = {
            apiKey: "AIzaSyDQ9k2pPBp7hwWwuHXkdYKiwSIJxY3-evE",
            databaseURL: "https://weblink-api-21e8b-default-rtdb.europe-west1.firebasedatabase.app"
        };
        
        window.firebase.initializeApp(window.firebaseConfig);
        console.log("Firebase initialized");
        
        const serverRef = window.firebase.database().ref('servers/' + apiKey);
        serverRef.on('value', (snapshot) => {
            const data = snapshot.val();
            console.log("Received server data:", data);
            if (data) {
                updateVariables(data);
                updateContent();
            }
        });
    }

    init();
})();
