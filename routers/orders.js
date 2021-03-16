const { Router } = require('express')
const { user } = require('../models/user')
const { checkToken } = require('../middleware/auth')

// router /api/orders[/route]
const router = Router()

router.route('/orderslist').get(checkToken, user.getAllOrders)
router.route('/:orderId').get(checkToken, user.getOrderDetails)
router.route('/:orderId').put(checkToken, user.payOrder)
router.route('/').post(checkToken, user.createOrder)

module.exports = {
    ordersRouter: router
}