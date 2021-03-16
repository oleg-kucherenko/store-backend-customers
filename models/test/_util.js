const http = require('http')

module.exports = {
    httpRequest: function httpRequest(options, postData) {
        return new Promise(function (resolve, reject) {
            const req = http.request(options, function (res) {
                let body = []
                res.on('data', function (chunk) {
                    body.push(chunk)
                })
                res.on('end', function () {
                    body = JSON.parse(body)
                    resolve(body)
                })
            })

            req.on('error', function (err) {
                reject(err)
            })

            if (postData) {
                req.write(JSON.stringify(postData));
            }

            req.end()
        })
    }
}