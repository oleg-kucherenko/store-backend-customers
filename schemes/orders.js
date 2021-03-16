const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },

    orderItems: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
            qty: { type: Number, required: true },
            priceInCents: { type: Number, required: true },
            costInCents: { type: Number, required: true },
            name: { type: String, required: true },
            image: { type: String, required: true },
        },
    ],

    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },

    paymentMethod: { type: String, required: true },

    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },

    itemsCostInCents: { type: Number, required: true, default: 0 },
    taxPriceInCents: { type: Number, required: true, default: 0 },
    shippingPriceInCents: { type: Number, required: true, default: 0 },
    totalCostInCents: { type: Number, required: true, default: 0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: String },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
},

    { timestamps: true }
)

const ordersODM = mongoose.model('Order', orderSchema)

module.exports = {
    ordersODM: ordersODM
}