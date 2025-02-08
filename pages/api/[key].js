import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let cachedClient = null

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient
    }
    cachedClient = new MongoClient(uri)
    await cachedClient.connect()
    return cachedClient
}

export default async function handler(req, res) {
    const { key } = req.query

    try {
        const client = await connectToDatabase()
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
        return res.status(500).json({
            status: 'error',
            message: 'Database connection error'
        })
    }
}