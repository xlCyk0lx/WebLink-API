import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let client = null

export default async function handler(req, res) {
    const { key } = req.query

    return res.status(200).json({
        status: 'success',
        message: 'API is working',
        key: key,
        timestamp: new Date().toISOString()
    })
}}