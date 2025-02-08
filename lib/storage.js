import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

export async function getPlayerData(key) {
  try {
      await client.connect()
      const collection = client.db('weblink').collection('players')
      return await collection.findOne({ apiKey: key })
  } finally {
      await client.close()
  }
}

export async function storePlayerData(key, data) {
  try {
      await client.connect()
      const collection = client.db('weblink').collection('players')
      await collection.updateOne(
          { apiKey: key },
          { $set: data },
          { upsert: true }
      )
  } finally {
      await client.close()
  }
}