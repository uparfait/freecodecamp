const express = require("express");
const dns = require("dns");
const app = express();
const port = 3000;
let urlStorage = {};
let siteNames = [];
const chars = "qwertyuioplkjhgfdsazcvbnm".split("");
const { HTML } = require("./html.js");

function Short() {
  const lastArrLen = Math.floor(Math.random() * 6);
  return (
    Math.floor(
      (Number(new Date()) * Math.random()) %
        (Math.random() * 100000 + Math.random() * 100000 + 10)
    ) +
    chars[Math.floor(Math.random() * chars.length)] +
    Array.from({ length: lastArrLen + 1 }, (_) =>
      Math.floor(Math.random() * 9999)
    )[Math.floor(Math.random() * lastArrLen)]
  );
}

function SolveUrlName(url = "www.Available.com") {
  let fc = url.indexOf("://") + 3;
  let sitename = "";

  if (url.includes("://") || url.includes("www.")) {
    url = url + ".";
    if (url.includes("://www.") || url.includes("www.")) {
      fc = url.indexOf("www.") + 4;
    }
    let lc = url.indexOf(".", fc);
    sitename = url.slice(fc, lc);
  } else {
    sitename = url;
  }

  return sitename;
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  if (!url) {
    return res.json({ error: "invalid url" });
  }

  let domain;
  try {
    domain = new URL(url).hostname;
  } catch (err) {
    return res.json({ error: "invalid url" });
  }

  dns.lookup(domain, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }

    let urlStg = Object.entries(urlStorage);
    urlStg = urlStg.filter((urlObj) => urlObj[1] === url);

    if (urlStg.length) {
      return res.json({
        original_url: urlStg[0][1],
        short_url: urlStg[0][0],
        warn: "URL exists!",
      });
    }

    let short = Short();
    let counter = 0;

    while (urlStorage[short]) {
      short = Short();
      if (counter > 100 && urlStorage[short]) {
        short = new Date();
        console.log(`Number of Try Reached!: ${counter}`);
      }
      counter++;
    }

    urlStorage[short] = url;
    siteNames.push([SolveUrlName(url), short]);
    res.json({
      original_url: url,
      short_url: short,
    });
  });
});

app.get("/api/:urlShort?", function (req, res) {
  if (!req.params.urlShort) {
    return res.json({ error: "invalid url" });
  }

  if (!urlStorage[req.params.urlShort]) {
    return res.json({ error: "invalid url" });
  }
  res.redirect(urlStorage[req.params.urlShort]);
});

app.get("*", function (req, res) {
  res.type("text/html").send(HTML(siteNames));
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
