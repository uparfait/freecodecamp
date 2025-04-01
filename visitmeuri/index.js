const express = require('express');

class TimestampServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.initializeCors();
    this.initializeRoutes();
  }

  initializeCors() {
    this.app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
  }

  initializeRoutes() {
    this.app.get('/api/:date?', (req, res) => {
      let date;
      const dateParam = req.params.date;

      if (!dateParam) {
        date = new Date();
      } else {
        if (/^\d+$/.test(dateParam)) {
          date = new Date(parseInt(dateParam));
        } else {
          date = new Date(dateParam);
        }
      }

      if (isNaN(date.getTime())) {
        return res.json({ error: "Invalid Date" });
      }

      res.json({
        unix: date.getTime(),
        utc: date.toUTCString()
      });
    });

     this.app.get('*', (req, res) => res.redirect('https://timestamp-five.vercel.app/api'))
  }


  start() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

const server = new TimestampServer();
server.start();
module.exports = server.app;
