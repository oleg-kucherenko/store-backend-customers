const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    config: {
        server: {
            port: 5000,
        },
        db: {
            uri: process.env.MONGO_URI
        },
        auth: {
            jwt: process.env.JWT_SECRET,
            paypal: process.env.PAYPAL_CLIENT_ID
        }
    }
}
