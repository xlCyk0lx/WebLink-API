const admin = require('firebase-admin');

module.exports = async (req, res) => {
    const db = admin.database();
    const apiKey = req.headers.authorization;
    
    if (!apiKey) {
        return res.status(401).json({ error: 'No API key provided' });
    }

    const ref = db.ref('servers/' + apiKey);
    const snapshot = await ref.once('value');
    
    if (snapshot.exists()) {
        return res.json(snapshot.val());
    }
    
    return res.status(404).json({ error: 'No data found' });
};
