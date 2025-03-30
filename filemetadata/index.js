const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const PORT = 3002;
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(multer({}).single('upfile'));

app.post('/api/fileanalyse', (req, res) => {
    if (!req?.file?.type) return res.json({ error: 'No File!' });
    res.status(200).json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
    });
});

app.get('*', (req, res) => {
    const html = path.resolve('./', 'index.html');
    res.status(200).type('text/html').sendFile(html);
});

app.listen(PORT () => console.log('---Ready!---'));
module.exports = app;
