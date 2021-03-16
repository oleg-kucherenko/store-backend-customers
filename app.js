// service libraries
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// routers
const { usersRouter } = require('./routers/users')
const { productsRouter } = require('./routers/products')
const { ordersRouter } = require('./routers/orders')
// config, utils
const { config } = require('./config')
const { connectDB } = require('./utils/connect-db')

connectDB(config.db.uri)
const app = express()

app.use(bodyParser.json())
// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'http://localhost') // update to match the domain you will make the request from
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
//     next()
// })
app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)
app.use('/api/orders', ordersRouter)
// app.use(express.static('build'))
// app.get('*', function(req, res) {
//     res.sendFile(path.resolve('build', 'index.html'))
// })

app.listen(config.server.port, function () {
    console.log(`Server works on ${config.server.port}`)
})