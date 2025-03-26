const express = require('express');

class WhoAmIServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.initializeMiddleware();
    this.initializeRoutes();
  }

  initializeMiddleware() {
    
    this.app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });

    
    this.app.use((req, res, next) => {
      const ipaddress = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;
      const language = req.headers['accept-language'];
      const software = req.headers['user-agent'];
      
      req.whoamiData = {
        ipaddress: this.parseIpAddress(ipaddress),
        language: language,
        software: software
      };
      
      next();
    });
  }

 
  parseIpAddress(ip) {
    if (Array.isArray(ip)) {
      return ip[0].trim();
    }
    if (typeof ip === 'string' && ip.includes(',')) {
      return ip.split(',')[0].trim();
    }
    return ip.trim();
  }

  initializeRoutes() {
    this.app.get('/api/whoami', (req, res) => {
      res.json(req.whoamiData);
    });

    
    this.app.get('/', (req, res) => {
      res.send('WhoAmI API Service - Visit <a href="/api/whoami"> visit whoami</a>');
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`WhoAmI API server running on port ${this.port}`);
    });
  }
}

const server = new WhoAmIServer();
server.start();