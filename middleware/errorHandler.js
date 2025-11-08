const errorHandler = (err, req, res, next) => {
  console.error("Error:", err)

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Validation error", details: err.message })
  }

  if (err.name === "MongoServerError" && err.code === 11000) {
    return res.status(400).json({ message: "Duplicate field value entered" })
  }

  res.status(500).json({ message: "Internal server error", error: err.message })
}

module.exports = errorHandler
