const jwt = require('jsonwebtoken')

module.exports = {
    generateToken: function (payload, privateKey, expiresIn) {
        return jwt.sign(payload, privateKey, expiresIn)
    },
    decodeToken: function (token) {
        return jwt.decode(token)
    },
    verifyToken: function (token, privateKey) {
        try {
            return jwt.verify(token, privateKey)
        } catch (err) {
            return 'Not verified'
        }

    }
}