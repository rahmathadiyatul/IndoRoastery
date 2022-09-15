const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const RoasterySchema = new Schema({
    nama: String,
    gambar: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        }, coordinates: {
            type: [Number],
            required: true
        }
    },
    harga: Number,
    deskripsi: String,
    lokasi: String,
    kreator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

RoasterySchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Roastery', RoasterySchema)