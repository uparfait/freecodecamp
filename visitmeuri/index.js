const express = require('express');
const app = express();
const port = 2025;

class Timestamp_service {
  static parse_date(date_param) {
    let date_obj;

    if (!date_param) {
      date_obj = new Date();
    } else if (/^\d+$/.test(date_param)) {
      const timestamp = parseInt(date_param);
      date_obj = new Date(timestamp);
    } else {
      date_obj = new Date(date_param);
    }

    if (isNaN(date_obj.getTime())) {
      return { error: "Invalid Date" };
    }

    return {
      unix: date_obj.getTime(),
      utc: date_obj.toUTCString()
    };
  }
}

app.get('/', (req, res) => {
  res.send(`
    <h1>Timestamp Microservice Project</h1>
    <p>Example Of Usage Or Quick Check ✨✨✨</p>
    <ul>
      <li><a href="/api/2015-12-25">Check for this date 2015-12-25</a></li>
      <li><a href="/api/1451001600000">Also check this 1451001600000</a></li>
    </ul>
    <p>You May See This Output 👍👍</p>
    <pre>{"unix":1451001600000, "utc":"Fri, 25 Dec 2015 00:00:00 GMT"}</pre>
    <p style="color: blue;">By Uwayo Parfait👌</p>
  `);
});

app.get('/api/:date?', (req, res) => {
  const result = Timestamp_service.parse_date(req.params.date);
  res.json(result);
});

app.listen(port, () => {
  console.log(`Timestamp Microservice listening on port ${port}`);
});

module.exports = app;
        
