import express from "express"
import cors from "cors"
import multer from "multer"
import path from "node:path"

const PORT = 3002
const app = express()

class Server {
  constructor(app) {

    this.app = app
  }

  Middeware() {
    this.app.use(cors({ origin: '*' }))
    this.app.use(express.json())
    this.app.use(multer({}).single('upfile'))
  }

   Router() {

    this.app.post('/api/fileanalyse', (req, res) =>{
      if(!req?.file?.type) return res.json({error: 'No File!'})
        res.status(200).json({
            name: req.file.originalname,
            type: req.file.mimetype,

            size: req.file.size
        })
    })

    this.app.get("*", (req, res) =>{
        const html = path.resolve('./', "index.html")
        res.status(200).type('text/html').sendFile(html)
    })

  }

   start(port) {
    this.app.listen(port, _ => console.log("---Ready!---"))
    
  }
}

const server = new Server(app)
server.Middeware()
server.Router()
server.start(PORT)
export default server.app
