import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let client = null

export default async function handler(req, res) {
    const { key } = req.query

    try {
        // Quick response for testing
        return res.status(200).json({
            status: 'success',
            message: 'API is working',
            key: key
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        })
    }
}