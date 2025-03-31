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
      return res.json(req.file)
      if(!req?.file?.type) return res.json({error: 'No File!'})
        res.status(200).json({
            name: req.file.originalname,
            type: req.file.mimetype,

            size: req.file.size
        })
    })

    this.app.get("*", (req, res) =>{
        const html = path.resolve('./', "index.html")
        res.status(200).type('text/html').send(`
        <!-- this is an html file -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Filemetadata</title>
    <style>
      body {
        font-family: sans-serif;
        display: flex;
        position: relative;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100vw;
        background-color: rgb(225, 224, 247);
        padding: 0;
        margin: 0;
      }
      .container {
        position: relative;
        width: 300px;
        height: 150px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        max-width: 100%;
      }
      .uploadable {
        width: 294px;
        border: 3px dashed darkmagenta;
        height: 120px;
        position: relative;
        left: 0px;
        text-align: center;
        max-width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: none;
        color: rgba(54, 49, 59, 0.562);
        font-weight: 600;
        cursor: pointer;
        overflow: auto;
      } #data {
        position: fixed;
        display: none;
      }#submit{
        width: 300px;
        height: 30px;
        max-width: 100%;
        text-align: center;
         border: none;
         background-color: rgba(139, 0, 139, 0.724);
         color: #fff;
         cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="uploadable" onclick="document.querySelector('#data').click()">
        Click to Upload File.
      </div>
      <form action="/api/fileanalyse" method="post" enctype="multipart/form-data">
        <input type="file" name="upfile" id="data" />
        <input type="submit" value="Send File" id="submit" disabled/>
      </form>
    </div>
    <script>
      const fileElement = document.querySelector("#data")
      fileElement.addEventListener('change', event => {
        const fileName = event.target.files[0]?.name
        if(!fileName) return
        document.querySelector('#submit').removeAttribute('disabled')
        document.querySelector('.uploadable').innerText = fileName

      })
    </script>
  </body>
</html>
        
        `)
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
