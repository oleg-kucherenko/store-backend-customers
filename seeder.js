// mock data
const { users } = require('./mock-data/users')
const { products } = require('./mock-data/products')
// mongo ODMs
const { usersODM } = require('./schemes/users')
const { productsODM } = require('./schemes/products')
const { ordersODM } = require('./schemes/orders')
// config, utils
const { config } = require('./config')
const { connectDB } = require('./utils/connect-db')

async function importData() {
    try {
        await connectDB(config.db.uri)

        await ordersODM.deleteMany()
        await productsODM.deleteMany()
        await usersODM.deleteMany()

        await usersODM.insertMany(users)
        await productsODM.insertMany(products)

        console.log('Data imported.')
        process.exit()
    } catch (err) {
        console.log(err.message)
        process.exit(1)
    }
}

async function removeData() {
    try {
        await ordersODM.deleteMany()
        await productsODM.deleteMany()
        await usersODM.deleteMany()

        console.log('Data removed.')
        process.exit()
    } catch (err) {
        console.log(err.message)
        process.exit(1)
    }
}

if (process.argv[2] === '-r') {
    removeData()
} else {
    importData()
}