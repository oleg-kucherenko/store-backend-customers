const assert = require('assert').strict
const { httpRequest } = require('./_util')

const user = {
    // User logins
    // POST /api/users/login
    login: async function () {
        const result = await httpRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/users/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            userEmail: 'john@example.com',
            userPassword: '123456'
        })

        console.log(result)
        assert.strictEqual(typeof result, 'object')
    },

    // User gets profile details
    // GET /api/users/profile
    getProfileDetails: async function () {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNGNjMjFiZDYxZjA3MWIwYzJmZWI0ZiIsImlhdCI6MTYxNTY0MzI3OSwiZXhwIjoxNjE1NzI5Njc5fQ.ydt7lOHkATVBQU1dkocXTxrtuKWS2Mvo5WLDYLD89Bs'

        const result = await httpRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/users/profile',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        console.log(result)
        assert.strictEqual(typeof result, 'object')
    },

    // User gets order details
    // GET /api/orders/[orderId]
    getOrderDetails: async function () {
        const orderId = '604cc788a8de8e06d85f62a0'
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNGNjNmQzN2M1NzkxMDEzNGNlYWUxMyIsImlhdCI6MTYxNTY0OTk1NSwiZXhwIjoxNjE1NzM2MzU1fQ.rci7i1_EEczrg3Zd8s9bYKzeT8-vpwB6m1fE6xEDXl8'
        const result = await httpRequest({
            hostname: 'localhost',
            port: 5000,
            path: `/api/orders/${orderId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        console.log(result)
        assert.strictEqual(typeof result, 'object')
    },

    // User creates order
    // POST /api/orders/
    createOrder: async function () {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNGNjNmQzN2M1NzkxMDEzNGNlYWUxMyIsImlhdCI6MTYxNTY0NDQ4MiwiZXhwIjoxNjE1NzMwODgyfQ.hHJ122IoW9sY6nLTMqwlq6oKESe5uBywRaKTUkOmGPs'

        const result = await httpRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/orders/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }, {
            order: {
                orderItems: [
                    {
                        productId: '604cc6d37c57910134ceae15',
                        productQty: 2,
                    },
                    {
                        productId: '604cc6d37c57910134ceae16',
                        productQty: 4
                    }
                ],
                shippingAddress: {
                    address: 'Street 1',
                    city: 'Odessa',
                    postalCode: '65000',
                    country: 'Ukraine',
                },
                paymentMethod: 'PayPal'
            }
        })

        console.log(result)
        assert.strictEqual(typeof result, 'object')
    },

    // User updates profile data
    // PUT /api/users/profile
    updateProfile: async function () {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDBmYmY1NmQyOTA3MTc4ODNhNmMwMiIsImlhdCI6MTYxNTI5NDQ0MCwiZXhwIjoxNjE1MzgwODQwfQ.fawuvvj-Mg0AwYXloxJGoFG2EDsFCnKUXR4gwOroQlA'

        const result = await httpRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/users/profile',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }, {
            dataToUpdate: {
                userName: 'Admin',
                userEmail: 'admin@example.com',
                userPassword: '123456'
            }
        })

        assert.strictEqual(typeof result, 'object')
    },

    // User deletes profile
    // DELETE /api/users/profile
    deleteProfile: async function () {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDBmYmY1NmQyOTA3MTc4ODNhNmMwMiIsImlhdCI6MTYxNTI5NDQ0MCwiZXhwIjoxNjE1MzgwODQwfQ.fawuvvj-Mg0AwYXloxJGoFG2EDsFCnKUXR4gwOroQlA'

        const result = await httpRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/users/profile',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        assert.strictEqual(typeof result, 'object')
    },

    // User gets all orders
    // GET /api/orders/orderslist
    getAllOrders: async function (req, res) {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNGNjNmQzN2M1NzkxMDEzNGNlYWUxMyIsImlhdCI6MTYxNTcwNzA4NywiZXhwIjoxNjE1NzkzNDg3fQ.txpc3lS94kQRWIC2SESvbrO25Mt9qrm0EJILr2heAoM'

        const result = await httpRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/orders/orderslist',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        console.log(result)
        console.log(result.orders[0])
        assert.strictEqual(typeof result, 'object')
    },

    // User pays order
    // PUT /api/orders/:[orderId: string]/pay
    payOrder: async function (req, res) {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNGNjNmQzN2M1NzkxMDEzNGNlYWUxMyIsImlhdCI6MTYxNTcwNzA4NywiZXhwIjoxNjE1NzkzNDg3fQ.txpc3lS94kQRWIC2SESvbrO25Mt9qrm0EJILr2heAoM'
        const orderId = '604cc788a8de8e06d85f62a0'

        const result = await httpRequest({
            hostname: 'localhost',
            port: 5000,
            path: `/api/orders/${orderId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        }, {
            paymentData: {
                paymentId: '123paymentId',
                paymentStatus: true,
                paymentTime: '2020-01-01T11:11:11.190Z',
                payerEmail: 'john@example.com'
            }
        })

        console.log(result)
        assert.strictEqual(typeof result, 'object')
    }
}

// user.login()
// user.getProfileDetails()
// user.updateProfile()
// user.deleteProfile()
// user.createOrder()
// user.getOrderDetails()
// user.getAllOrders()
// user.payOrder()