import { getPlayerData, storePlayerData } from '../../lib/storage'

export default async function handler(req, res) {
  try {
      const { key } = req.query

      if (req.method === 'GET') {
          const data = await getPlayerData(key)
          if (!data) {
              return res.status(404).json({
                  status: 'error',
                  message: 'API key not found'
              })
          }
          return res.status(200).json({
              status: 'success',
              data: data
          })
      }

      if (req.method === 'POST') {
          await storePlayerData(key, req.body)
          return res.status(200).json({
              status: 'success',
              message: 'Data updated successfully'
          })
      }

  } catch (error) {
      console.error('API Error:', error)
      return res.status(500).json({
          status: 'error',
          message: 'Server error'
      })
  }
}