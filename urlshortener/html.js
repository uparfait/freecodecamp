exports.HTML = (SiteNames) => {
  let tr = [];

  for (x of SiteNames) {
    tr.push(
      `
            <tr>
              <td>${x[0]}</td>
              <td> <a href="api/shorturl/${x[1]}">${x[1]}</a></td>
            </tr>

            `
    );
  }

  return `
    <!DOCTYPE html>

<html>
  <head>
    <title>URL Shortener Microservice </title>
    <link
      rel="icon"
      type="image/png"
      href="https://cdn.freecodecamp.org/universal/favicons/favicon-16x16.png"
    />
    <style>
    body {
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #222;
  background-color: #fff;
  text-align: center;
  line-height: 1.4em;
}

main {
  padding: 0;
  margin-top: 40px;
}

h3 {
  margin-top: 30px;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}


.user-stories li {
  margin-bottom: 1em;
}

a {
  color: #2574a9;
}

form {
  margin: 10px auto;
  padding: 20px;
  max-width: 600px;
}

label {
  margin-right: 10px;
}

input {
  padding: 5px;
}

input[type='text'] {
  width: 220px;
  text-align: center;
}

    </style>
  </head>

  <body>
    <h1>URL Shortener Microservice</h1>
    <main>
      <section>
        <form action="api/shorturl" method="POST">
          <fieldset>
            <legend>URL Shortener</legend>
            <label for="url_input">URL:</label>
            <input id="url_input" type="text" name="url" placeholder="https://www.example.com" />
            <input type="submit" value="POST URL" />
          </fieldset>
        </form>
      </section>
    </main>
    <section>
      <fieldset class="url-lists">
        <h3>Available URLS</h3>
        <table align="center">
          <thead>
            <th>Site name</th>
            <th>Link</th>
          </thead>
          <tbody>
           ${tr.join("")}
          </tbody>
        </table>      
      </fieldset>
    </section>
    <footer>
      <p>By <a href="#">Parfait Uwayo</a></p>
    </footer>
  </body>
</html>

    `;
};
