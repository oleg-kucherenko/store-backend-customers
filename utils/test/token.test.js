const assert = require('assert').strict
const { generateToken, decodeToken, verifyToken } = require('../token')

const message = { user: 'Test Name' }
const privateKey = '123abc'

const token = generateToken(message, privateKey, { expiresIn: '1d' })
const decodedToken = decodeToken(token)
const verifiedToken = verifyToken(token, privateKey)

assert.strictEqual(decodedToken.user, message.user)
assert.strictEqual(verifiedToken.user, message.user)