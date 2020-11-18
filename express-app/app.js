require('./config/config')()

require('./db').connect.then(console.log).catch(console.log)


const
    express = require('express'),
    app = express(),
    port = process.env.Port,
    host = process.env.Host,
    controller = require('./controllers/controller');

app.use('/', express.json())

app.route('/products/:id([0-9a-z]{24})')
    .get(controller.get)
    .put(controller.put)
    .delete(controller.delete)

app.route('/products')
    .get(controller.getAll)
    .post(controller.post)

app.get('/', (req, res) => res.end('CRUD app'))

app.listen(port, host, () => console.log(`Start server at http://${host}:${port} . . .\n`))
