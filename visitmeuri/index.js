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

app.get('/api/:date?', (req, res) => {
  const date_param = req.params.date;
  const result = Timestamp_service.parse_date(date_param);
  res.json(result);
});

app.listen(port, () => {
  console.log(`Timestamp Microservice listening on port ${port}`);
});

module.exports = app;