const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api/:date?', (req, res) => {
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;