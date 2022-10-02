const express = require('express');

const app = express()
const PORT = 1337 || process.env.PORT


app.listen(PORT, () =>
  console.log(`Listening on port: ${PORT}`)
)