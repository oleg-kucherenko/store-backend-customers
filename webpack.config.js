const path = require('path')
const newPath = path.join(__dirname, '/build')

module.exports = {
    target: 'node',
    mode: 'development',
    entry: './app.js',
    output: {
        path: newPath,
        filename: 'backend-shop-bundle.js'
    }
}