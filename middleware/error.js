export default function errorHandler(err, req, res, next) {
  res.status(500).json({
    status: 'error',
    message: 'Server error'
  })
}
