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
            online: data.server.online_players,
            maxonline: data.server.max_players,
            tps: data.server.tps,
            memory: formatMemory(data.server.memory.current),
            motd: data.server.motd,
            version: data.server.version
        };
        console.log("Variables ready for replacement:", window.variables);
    }

    function updateContent() {
        requestAnimationFrame(() => {
            document.querySelectorAll('*').forEach(element => {
                element.childNodes.forEach(node => {
                    if (node.nodeType === 3) {
                        let newText = node.nodeValue;
                        for (const [key, value] of Object.entries(window.variables)) {
                            const regex = new RegExp(`\\${key}\\b`, 'g');
                            newText = newText.replace(regex, value);
                        }
                        node.nodeValue = newText;
                    }
                });
            });
        });
    }

    function formatMemory(bytes) {
        return Math.round(bytes / (1024 * 1024)) + 'MB';
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
