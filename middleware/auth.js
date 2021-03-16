// service libraries
const jwt = require("jsonwebtoken")
// config, utils
const { config } = require('../config')
// mongo ODMs
const { usersODM } = require("../schemes/users")

module.exports = {
    checkToken: async function (req, res, next) {
        const header = req.headers.authorization

        if (header && header.startsWith('Bearer')) {
            try {
                const token = header.split(' ')[1]
                const decoded = await jwt.verify(token, config.auth.jwt)
                req.user = await usersODM.findById(decoded.id).select('_id')
                next()
            } catch (error) {
                res.status(401).json({
                    error: 'Invalid token',
                    message: error.message
                })
            }
        } else {
            res.status(401).json({
                error: 'No token'
            })
        }
    }
}