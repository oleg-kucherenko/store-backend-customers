const assert = require('assert').strict
const { httpRequest } = require('./_util')

const guest = {
    // Guest gets all products
    // GET /api/products/        
    getProductsAll: async function () {
        let result
        const pageSize = 3

        result = await httpRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/products/',
            method: 'GET'
        })

        // response length
        assert.strictEqual(result.length, pageSize)

        // response type
        assert.strictEqual(typeof result, 'object')

        // object properties 
        for (key in result) {
            const obj = result[key]
            const actualProperties = Object.keys(obj)
            const expectedProperties = [
                'price',
                'countInStock',
                'numReviews',
                'rating',
                '_id',
                'name',
                'image',
                'description',
                'brand',
                'category',
                'reviews',
                '__v',
                'createdAt',
                'updatedAt'
            ]
            assert.deepStrictEqual(actualProperties, expectedProperties)
        }

        // object properties value types 
        for (key in result) {
            const obj = result[key]
            assert.strictEqual(typeof obj.price, 'number')
            assert.strictEqual(typeof obj.countInStock, 'number')
            assert.strictEqual(typeof obj.numReviews, 'number')
            assert.strictEqual(typeof obj.rating, 'number')
            assert.strictEqual(typeof obj._id, 'string')
            assert.strictEqual(typeof obj.name, 'string')
            assert.strictEqual(typeof obj.image, 'string')
            assert.strictEqual(typeof obj.description, 'string')
            assert.strictEqual(typeof obj.category, 'string')
            assert.strictEqual(typeof obj.reviews, 'object')
            assert.strictEqual(typeof obj.__v, 'number')
            assert.strictEqual(typeof obj.createdAt, 'string')
            assert.strictEqual(typeof obj.updatedAt, 'string')
        }
    },

    // Guest gets all products with keyword
    // GET /api/products?keyword=[keyword]
    getProductsWithKeyword: async function () {
        let result
        const keyword = 'iphone'
        const reg = new RegExp(keyword, 'i')

        result = await httpRequest({
            hostname: 'localhost',
            port: 5000,
            path: `/api/products?keyword=${keyword}`,
            method: 'GET'
        })

        // result length
        assert.strictEqual(result.length, 1)

        // search
        assert.strictEqual(result[0].name.match(reg).length, 1)
    },

    // Guest gets all products with pageNumber
    // GET /api/products?pageNumber=[pageNumber]
    getProductsWithPagination: async function () {
        const pageNumber = 1

        result = await httpRequest({
            hostname: 'localhost',
            port: 5000,
            path: `/api/products?pageNumber=${pageNumber}`,
            method: 'GET'
        })

        assert.strictEqual(result.length, 3)
    },

    // Guest gets top products 
    // GET /api/products/top
    getProductsTop: async function () {
        const limit = 4

        result = await httpRequest({
            hostname: 'localhost',
            port: 5000,
            path: `/api/products/top`,
            method: 'GET'
        })

        assert.strictEqual(result.length, limit)
    },

    // Guest gets product details by product id
    // GET /api/products/[productId: string]
    getProductDetails: async function () {
        const productId = '6040fbf56d290717883a6c0a'

        const result = await httpRequest({
            hostname: 'localhost',
            port: 5000,
            path: `/api/products/${productId}`,
            method: 'GET'
        })

        assert.strictEqual(typeof result, 'object')
    },

    // Guest registers
    // POST /api/users/   
    registers: async function () {
        const result = await httpRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/users/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            userName: 'Jeremy MacConor Second',
            userEmail: 'jeremy_m_s9@gmail.com',
            userPassword: 'J123'
        })

        const actualProperties = Object.keys(result.createdUser)
        const expectedProperties = ['userName', 'userToken']
        assert.deepStrictEqual(actualProperties, expectedProperties)
    }
}

// guest.getProductsAll()
// guest.getProductsWithKeyword()
// guest.getProductsWithPagination()
// guest.getProductsTop()
// guest.registers()
// guest.getProductDetails()
