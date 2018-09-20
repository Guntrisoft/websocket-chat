const express = require('express')

const app = express()

app.use(express.static('public'))

const port = 3000

app.get('/', (_, res) => {
  res.send(`
    <html>
      <head>
        <title>Web socket chat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          html,
          body,
          #app {
            height: 100%;
          }

          body {
            overflow: hidden;
            padding: 0;
            margin: 0;
          }

          #app {
            display: flex;
            flex-direction: column;
          }

          header {
            flex: 0 0 auto;
            text-align: center;
          }

          #handle {
            margin-bottom: .2em;
          }

          footer {
            flex: 0 0 auto;
            text-align: center;
            height: 45px;
          }

          .text {
            margin-bottom: 0;
          }

          main {
            flex: 1 1 auto;
            background: #eaeaea url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
            overflow: scroll;
          }

          * {
            font-family: Helvetica;
          }

          input[type=text] {
            font-size: 20px;
            border: 1px solid #ccc;
            padding: .2em;
            border-radius: .7em;
          }

          #message {
            width: 90%;
            margin: .2em auto 0;
          }

          .message {
            margin: 1em;
            background: #fff;
            border-radius: .7em;
            padding: 1em;
            width: 75%;
            list-style: none;
            position: relative;
            border: 1px solid #ccc;
            box-shadow: 1px 1px 1px rgba(100,100,100,.2);
          }

          .time {
            position: absolute;
            right: 1em;
            bottom: 1em;
            color: #999;
            font-size: .8em;
          }

          .handle {
            font-weight: bold;
            display: block;
            color: #2470a0;
          }

          #chat-form {
            width: 100%;
          }

          #chat {
            width: 100%;
            padding: 0;
            margin: 1em auto;
          }

          #send {
            position: absolute;
            top: -1000px;
            left: -1000px;
          }
        </style>
      </head>
      <body>
        <form id="chat-form">
          <div id="app">
            <header>
              <p>Users in chat <span id="total-clients"></span></p>
              <label for="handle">Handle</label>
              <input type="text" id="handle" autocomplete="off" />
            </header>
            <main>
              <ul id="chat">
              </ul>
            </main>
            <footer>
              <input type="text" id="message" autocomplete="off" />
              <input type="submit" value="send" id="send">
            </footer>
          </div>
        </form>
        <script>
          window.WEB_SOCKET_URL = '${process.env.WEB_SOCKET_URL}';
        </script>
        <script src="/client.js"></script>
      </body>
    </html>
  `)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))