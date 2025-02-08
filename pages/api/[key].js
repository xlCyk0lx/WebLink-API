export default async function handler(req, res) {
  const { key } = req.query

  if (req.method === 'GET') {
    // Handle API key requests
    const playerData = await getPlayerData(key)
    if (playerData) {
      res.status(200).json({
        status: 'success',
        data: playerData
      })
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Invalid API key'
      })
    }
  }

  if (req.method === 'POST') {
    // Handle incoming plugin data
    const data = req.body
    await storePlayerData(key, data)
    res.status(200).json({
      status: 'success',
      message: 'Data stored successfully'
    })
  }
}