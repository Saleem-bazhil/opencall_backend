import express from 'express';
import { AppDataSource } from "./db/db.js"; 

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Start server only after database connects
AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  })
