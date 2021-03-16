// service libraries
const bcrypt = require('bcryptjs')
// mongo ODMs
const { productsODM } = require('../schemes/products')
const { usersODM } = require('../schemes/users')
// utils
const { generateToken } = require('../utils/token')
const { config } = require('../config')

// guest.getProducts, guest.getProductsTop, guest.getProductDetails
// guest.registers
const guest = {
    // Guest gets all products with pagination and keyword
    // GET /api/products?keyword=[keyword]&pageNumber=[pageNumer]
    getProducts: async function (req, res) {
        try {
            const pageSize = 3
            const pageNumber = Number(req.query.pageNumber) || 1
            const keyword = req.query.keyword ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i'
                }
            } : {}

            let products
            if (keyword) {
                products = await productsODM.find(keyword).select('-__v -createdAt -updatedAt')
                    .limit(pageSize)
                    .skip(pageSize * (pageNumber - 1))
            } else {
                products = await productsODM.find({})
            }
            res.json(products)
        } catch (err) {
            res.json({
                message: err.message
            })
        }
    },

    // Guest gets top 4 products (limit = 4)
    // GET /api/products/top
    getProductsTop: async function (req, res) {
        try {
            const products = await productsODM.find({}).select('-__v -createdAt -updatedAt')
                .sort({ rating: -1 }).limit(4)
            res.json(products)

        } catch (error) {
            res.json({
                error: error.message
            })
        }
    },

    // Guest gets product details by product id
    // GET /api/products/[productId]
    getProductDetails: async function (req, res) {
        const productId = req.params.productId
        const product = await productsODM.findById(productId).select('-__v -createdAt -updatedAt')

        if (product) {
            res.json(product)
        } else {
            res.status(404).json({
                error: 'Product not found'
            })
        }
    },

    // Guest registers
    // POST /api/users/
    register: async function (req, res) {
        const { userName, userEmail, userPassword } = req.body

        // find user by email
        const ifUserExists = await usersODM.findOne({ email: userEmail })

        // create new user 
        if (!ifUserExists) {
            const salt = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(userPassword, salt)

            const createdUser = await usersODM.create({
                name: userName,
                email: userEmail,
                password: password
            })

            const token = generateToken({ id: createdUser._id }, config.auth.jwt, { expiresIn: '1d' })

            res.json({
                createdUser: {
                    userName: createdUser.name,
                    userToken: token
                }
            })
        } else {
            res.json({ error: 'User with this email already exists' })
        }
    }
}

module.exports = {
    guest: guest
}
