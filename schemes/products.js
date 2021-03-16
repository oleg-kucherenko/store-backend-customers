const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
    },

    { timestamps: true }
)

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        brand: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        priceInCents: { type: Number, required: true, default: 0 },
        countInStock: { type: Number, required: true, default: 0 },
        image: { type: String, required: true, unique: true },
        reviews: [reviewSchema],
        numReviews: { type: Number, required: true, default: 0 },
        rating: { type: Number, required: true, default: 0 },
    },

    { timestamps: true }
)

const productsODM = mongoose.model('Product', productSchema)

module.exports = {
    productsODM: productsODM
}