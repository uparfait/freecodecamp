
exports.HTML = SiteNames => {
 
    let tr = []

    for(x of SiteNames) {
        tr.push(
            `
            <tr>
              <td>${x[0]}</td>
              <td> <a href="api/${x[1]}">${x[1]}</a></td>
            </tr>

            `
        )
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
    <link href="/public/style.css" rel="stylesheet" type="text/css" />
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
           ${
          tr.join('')
           }
          </tbody>
        </table>      
      </fieldset>
    </section>
    <footer>
      <p>By <a href="#">Parfait Uwayo</a></p>
    </footer>
  </body>
</html>

    `

}