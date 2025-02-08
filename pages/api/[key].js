import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

export default async function handler(req, res) {
    const { key } = req.query

    try {
        await client.connect()
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

    } finally {
        await client.close()
    }
}