class WebLinkEmbed {
    constructor(key) {
        this.key = key;
        this.variables = {};
        this.init();
    }

    async init() {
        await this.loadFirebase();
        this.startUpdates();
    }

    async loadFirebase() {
        const firebaseConfig = {
            apiKey: "AIzaSyDQ9k2pPBp7hwWwuHXkdYKiwSIJxY3-evE",
            databaseURL: "https://weblink-api-21e8b-default-rtdb.europe-west1.firebasedatabase.app"
        };

        // Load Firebase if not already loaded
        if (!window.firebase) {
            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js';
            document.head.appendChild(script);
            await new Promise(resolve => script.onload = resolve);

            const dbScript = document.createElement('script');
            dbScript.src = 'https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js';
            document.head.appendChild(dbScript);
            await new Promise(resolve => dbScript.onload = resolve);
        }

        firebase.initializeApp(firebaseConfig);
    }

    startUpdates() {
        const serverRef = firebase.database().ref('servers/' + this.key);
        serverRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                this.updateVariables(data);
                this.updateContent();
            }
        });
    }

    updateVariables(data) {
        this.variables = {
            online: data.server.online_players,
            maxonline: data.server.max_players,
            tps: data.server.tps,
            memory: this.formatMemory(data.server.memory.current),
            motd: data.server.motd,
            version: data.server.version
        };
    }

    updateContent() {
        const elements = document.getElementsByTagName('*');
        for (let element of elements) {
            if (element.childNodes.length > 0) {
                for (let node of element.childNodes) {
                    if (node.nodeType === 3) { // Text node
                        let content = node.nodeValue;
                        let newContent = content;
                        
                        // Replace all variables
                        for (let [key, value] of Object.entries(this.variables)) {
                            newContent = newContent.replace(new RegExp('\\$' + key, 'g'), value);
                        }
                        
                        if (content !== newContent) {
                            node.nodeValue = newContent;
                        }
                    }
                }
            }
        }
    }

    formatMemory(bytes) {
        return Math.round(bytes / (1024 * 1024)) + 'MB';
    }
}
