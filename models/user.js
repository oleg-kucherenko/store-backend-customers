// service libraries
const bcrypt = require('bcryptjs')
// mongo ODMs
const { usersODM } = require('../schemes/users')
const { productsODM } = require('../schemes/products')
const { ordersODM } = require('../schemes/orders')
// config, utils
const { config } = require('../config')
const { generateToken } = require('../utils/token')

const user = {
    // User logins
    // POST /api/users/login
    login: async function (req, res) {
        const { userEmail, userPassword } = req.body

        // check if user exists
        const userExists = await usersODM.findOne({ email: userEmail })
        if (userExists) {
            // check if password matchs
            const passwordMatchs = await bcrypt.compare(userPassword, userExists.password)
            if (passwordMatchs) {
                const token = generateToken({ id: userExists._id }, config.auth.jwt, { expiresIn: '1d' })

                res.json({
                    loggedUser: {
                        userName: userExists.name,
                        userToken: token
                    }
                })
            } else {
                res.status(401).json({
                    error: 'Not authorized: invalid password'
                })
            }
        } else {
            res.status(401).json({
                error: 'Not authorized: invalid email'
            })
        }
    },

    // User gets profile details
    // GET /api/users/profile
    getProfileDetails: async function (req, res) {
        const { user } = req

        if (user._id) {
            try {
                const userProfile = await usersODM.findById(user._id)
                res.json({
                    userProfile: {
                        userName: userProfile.name,
                        userEmail: userProfile.email,
                    }
                })
            } catch (error) {
                res.status(404).json({
                    error: 'Profile not found'
                })
            }
        } else {
            res.status(401).json({
                error: 'Not authorized'
            })
        }
    },

    // User gets order details
    // GET /api/orders/[orderId]
    getOrderDetails: async function (req, res) {
        const { user } = req
        const { orderId } = req.params

        if (user._id) {
            try {
                const order = await ordersODM.findById(orderId).populate("user", "name email _id")

                if ((order.user._id).toString() === (user._id).toString()) {
                    const orderItemsRes = []

                    for (key in order.orderItems) {
                        orderItemsRes.push({
                            productId: order.orderItems[key].productId,
                            productName: order.orderItems[key].name,
                            productQty: order.orderItems[key].qty,
                            productPriceInDollars: order.orderItems[key].priceInCents / 100,
                            productCostInDollars: order.orderItems[key].costInCents / 100,
                            productImage: order.orderItems[key].image
                        })
                    }

                    res.json({
                        order: {
                            user: {
                                userName: order.user.name,
                                userEmail: order.user.email
                            },
                            orderItems: orderItemsRes,
                            shippingAddress: order.shippingAddress,
                            paymentMethod: order.paymentMethod,
                            itemsCostInDollars: order.itemsCostInCents / 100,
                            taxPriceInDollars: order.taxPriceInCents / 100,
                            shippingPriceInDollars: order.shippingPriceInCents / 100,
                            totalCostInDollars: order.totalCostInCents / 100,
                            createdAt: order.createdAt,
                            isPaid: order.isPaid,
                            isDelivered: order.isDelivered

                        }
                    })
                    // end: if (user._id === order.user._id) {...}
                } else {
                    res.status(400).json({
                        error: 'User requested order of another user'
                    })
                }
            } catch (error) {
                res.status(404).json({
                    error: 'Order not found'
                })
            }
            // end: if (user._id) {...}
        } else {
            res.status(401).json({
                error: 'Not authorized'
            })
        }
    },

    // User creates order
    // POST /api/orders/
    createOrder: async function (req, res) {
        const { user } = req
        const { orderItems, shippingAddress, paymentMethod } = req.body.order

        if (user._id) {
            let orderItemsRes = []
            let itemsCostInCents = 0

            for (key in orderItems) {
                const product = await productsODM.findById(orderItems[key].productId)

                if (product && product.countInStock > 0 &&
                    orderItems[key].productQty <= product.countInStock) {

                    const orderItem = {
                        productId: product._id,
                        name: product.name,
                        qty: orderItems[key].productQty,
                        priceInCents: product.priceInCents,
                        costInCents: orderItems[key].productQty * product.priceInCents,
                        image: product.image,
                    }
                    orderItemsRes.push(orderItem)

                    product.countInStock = product.countInStock - orderItems[key].productQty
                    await product.save()

                    itemsCostInCents += orderItem.costInCents
                }
            }

            if (orderItemsRes.length > 0) {
                const taxPriceInCents = Math.round(itemsCostInCents * 5 / 100)
                const shippingPriceInCents = itemsCostInCents < 1500 ? 200 : 0
                const totalCostInCents = itemsCostInCents + taxPriceInCents + shippingPriceInCents

                const order = await ordersODM.create({
                    user: user._id,
                    orderItems: orderItemsRes,
                    shippingAddress: shippingAddress,
                    paymentMethod: paymentMethod,
                    itemsCostInCents: itemsCostInCents,
                    taxPriceInCents: taxPriceInCents,
                    shippingPriceInCents: shippingPriceInCents,
                    totalCostInCents: totalCostInCents
                })

                orderItemsRes = []
                for (key in order.orderItems) {
                    orderItemsRes.push({
                        productId: order.orderItems[key].productId,
                        productName: order.orderItems[key].name,
                        productQty: order.orderItems[key].qty,
                        productPriceInDollars: order.orderItems[key].priceInCents / 100,
                        productCostInDollars: order.orderItems[key].costInCents / 100,
                        productImage: order.orderItems[key].image
                    })
                }

                const userData = await usersODM.findById(user._id).select('name email')

                res.json(createdOrder = {
                    user: {
                        userName: order.user.name,
                        userEmail: order.user.email
                    },
                    orderItems: orderItemsRes,
                    shippingAddress: order.shippingAddress,
                    paymentMethod: order.paymentMethod,
                    itemsCostInDollars: order.itemsCostInCents / 100,
                    taxPriceInDollars: order.taxPriceInCents / 100,
                    shippingPriceInDollars: order.shippingPriceInCents / 100,
                    totalCostInDollars: order.totalCostInCents / 100,
                    createdAt: order.createdAt,
                    isPaid: false,
                    isDelivered: false
                })
                // if (orderItemsRes.length > 0) {...}
            } else {
                res.status(400).json({
                    error: 'Not added to card'
                })
            }
            // if (user._id) {...}
        } else {
            res.status(401).json({
                error: 'Not authorized'
            })
        }
    },

    // User updates profile data
    // PUT /api/users/profile
    updateProfile: async function (req, res) {
        const { user } = req
        const { dataToUpdate } = req.body

        if (user) {
            try {
                const profile = await usersODM.findById(user._id)
                profile.name = dataToUpdate.userName || profile.name
                profile.email = dataToUpdate.userEmail || profile.email
                if (dataToUpdate.userPassword) {
                    const salt = await bcrypt.genSalt(10)
                    const password = await bcrypt.hash(dataToUpdate.userPassword, salt)
                    profile.password = password
                }
                const updatedUser = await profile.save()
                res.json({
                    updatedUser: {
                        userName: updatedUser.name,
                        userEmail: updatedUser.email
                    }
                })
            } catch (error) {
                res.status(404).json({
                    error: 'Profile not found'
                })
            }
        } else {
            res.status(401).json({
                error: 'Not authorized'
            })
        }
    },

    // User deletes profile
    // DELETE /api/users/profile
    deleteProfile: async function (req, res) {
        const { user } = req
        console.log(user)

        if (user) {
            try {
                const deletedProfile = await usersODM.findByIdAndDelete(user._id)
                res.json({
                    deletedProfile: {
                        userEmail: deletedProfile.email
                    }
                })
            } catch (error) {
                res.status(404).json({
                    error: 'Profile not found'
                })
            }
        } else {
            res.status(401).json({
                error: 'Not authorized'
            })
        }
    },


    // User gets all orders
    // GET /api/orders/orderslist
    getAllOrders: async function (req, res) {
        const { user } = req

        if (user._id) {
            try {
                const orders = await ordersODM.find({ user: user._id })

                const ordersList = []

                for (order of orders) {
                    const orderItemsBuff = []

                    for (orderItem of order.orderItems) {
                        orderItemsBuff.push({
                            productId: orderItem.productId,
                            productName: orderItem.name,
                            productQty: orderItem.qty,
                            productPriceInDollars: orderItem.priceInCents / 100,
                            productCostInDollars: orderItem.costInCents / 100,
                            productImage: orderItem.image,
                        })
                    }

                    ordersList.push({
                        orderItems: orderItemsBuff,
                        shippingAddress: order.shippingAddress,
                        paymentMethod: order.paymentMethod,
                        itemsCostInDollars: order.itemsCostInCents / 100,
                        taxPriceInDollars: order.taxPriceInCents / 100,
                        shippingPriceInDollars: order.shippingPriceInCents / 100,
                        totalCostInDollars: order.totalCostInCents / 100,
                        isPaid: order.isPaid,
                        isDelivered: order.isDelivered,
                        createdAt: order.createdAt,
                    })
                }

                const userData = await usersODM.findById(user._id).select('name email')

                res.json({
                    user: {
                        userName: userData.name,
                        userEmail: userData.email
                    },
                    orders: ordersList
                })
            } catch (error) {
                res.status(404).json({
                    error: 'Not found'
                })
            }

        } else {
            res.json(401).json({
                error: 'Not authorized'
            })
        }
    },

    // User pays order
    // PUT /api/orders/:[orderId: string]/pay
    payOrder: async function (req, res) {
        const { user } = req
        const { orderId } = req.params
        const { paymentData } = req.body

        if (user._id) {
            try {
                const order = await ordersODM.findById(orderId)

                if (order && order.user.toString() === user._id.toString() && paymentData.paymentStatus) {
                    order.paymentResult.id = paymentData.paymentId
                    order.paymentResult.status = true
                    order.paymentResult.update_time = paymentData.paymentTime
                    order.paymentResult.email_address = paymentData.payerEmail
                    order.paidAt = paymentData.paymentTime
                    order.isPaid = true

                    const payedOrder = await order.save()

                    res.json({
                        payedOrder: {
                            orderId: payedOrder._id,
                            payerEmail: payedOrder.paymentResult.email_address
                        }
                    })
                } else {
                    res.status(400).json({
                        error: 'No order or user requested order of another user or payment false status'
                    })
                }
            } catch (error) {
                res.status(404).json({
                    error: 'Not found',
                    message: error.message
                })
            }


        } else {
            res.status(401).json({
                error: 'Not authorized'
            })
        }
    }
}

module.exports = {
    user: user
}