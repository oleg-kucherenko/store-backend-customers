const { Router } = require('express')
const { guest } = require('../models/guest')

// router /api/products[/route]
const router = Router()

router.route('/').get(guest.getProducts)
router.route('/top').get(guest.getProductsTop)
router.route('/:productId').get(guest.getProductDetails)

module.exports = {
    productsRouter: router
}