const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const PORT = 3002;
const app = express();

class Server {
  constructor(app) {
    this.app = app;
  }

  Middleware() {
    this.app.use(cors({ origin: '*' }));
    this.app.use(express.json());
    this.app.use(multer({}).single('upfile'));
  }

  Router() {
    this.app.post('/api/fileanalyse', (req, res) => {
      if (!req?.file?.type) return res.json({ error: 'No File!' });
      res.status(200).json({
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
      });
    });

    this.app.get('*', (req, res) => {
      const html = path.resolve('./', 'index.html');
      res.status(200).type('text/html').sendFile(html);
    });
  }

  start(port) {
    this.app.listen(port, () => console.log('---Ready!---'));
    module.exports = this.app;
  }
}

const server = new Server(app);
server.Middleware();
server.Router();
server.start(PORT);
