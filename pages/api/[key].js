import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

export default async function handler(req, res) {
    const { key } = req.query

    try {
        await client.connect()
        const database = client.db('weblink')
        const players = database.collection('players')
        
        if (req.method === 'POST') {
            const playerData = req.body
            await players.updateOne(
                { apiKey: key },
                { $set: playerData },
                { upsert: true }
            )
            return res.status(200).json({
                status: 'success',
                message: 'Data stored'
            })
        }

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