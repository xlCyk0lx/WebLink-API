const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('../firebase-credentials.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://weblink-api-21e8b-default-rtdb.europe-west1.firebasedatabase.app"
});

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { api_key } = req.body;
        const db = admin.database();
        const ref = db.ref('servers/' + api_key);

        try {
            const snapshot = await ref.once('value');
            if (snapshot.exists()) {
                return res.json({ success: true, data: snapshot.val() });
            } else {
                return res.status(401).json({ error: 'Invalid API key' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Server error' });
        }
    }
};
