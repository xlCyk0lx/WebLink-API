import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000
}

let client = null

export default async function handler(req, res) {
    if (!client) {
        client = new MongoClient(uri, options)
        await client.connect()
    }

    try {
        const { key } = req.query
        const database = client.db('weblink')
        const players = database.collection('players')
        
        const playerData = await players.findOne({ apiKey: key })
        if (!playerData) {
            return res.status(404).json({
                status: 'error',
                message: 'Invalid API key'
            })
        }

        return res.status(200).json({
            status: 'success',
            data: playerData
        })

    } catch (error) {
        console.error('Database error:', error)
        return res.status(500).json({
            status: 'error',
            message: 'Database error'
        })
    }
}