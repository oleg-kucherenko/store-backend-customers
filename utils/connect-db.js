const mongoose = require('mongoose')

module.exports = {
    connectDB: async function (uri) {
        try {
            const conn = await mongoose.connect(uri, {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true,
            })
            console.log(`MongoDB connected: ${conn.connection.host}`)
        } catch (err) {
            throw err
        }
    }
}