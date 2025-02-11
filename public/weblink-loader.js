(function() {
    const urlParams = new URLSearchParams(document.currentScript.src.split('?')[1]);
    const apiKey = urlParams.get('key');

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    async function init() {
        await loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
        await loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js');
        
        const firebaseConfig = {
            apiKey: "AIzaSyDQ9k2pPBp7hwWwuHXkdYKiwSIJxY3-evE",
            databaseURL: "https://weblink-api-21e8b-default-rtdb.europe-west1.firebasedatabase.app"
        };
        
        firebase.initializeApp(firebaseConfig);
        
        const serverRef = firebase.database().ref('servers/' + apiKey);
        serverRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                updateVariables(data);
                updateContent();
            }
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
    }

    function updateContent() {
        const elements = document.getElementsByTagName('*');
        for (let element of elements) {
            if (element.childNodes.length > 0) {
                for (let node of element.childNodes) {
                    if (node.nodeType === 3) {
                        let content = node.nodeValue;
                        let newContent = content;
                        
                        for (let [key, value] of Object.entries(window.variables)) {
                            newContent = newContent.replace(new RegExp('\\' + key, 'g'), value);
                        }
                        
                        if (content !== newContent) {
                            node.nodeValue = newContent;
                        }
                    }
                }
            }
        }
    }

    function formatMemory(bytes) {
        return Math.round(bytes / (1024 * 1024)) + 'MB';
    }

    init();
})();
