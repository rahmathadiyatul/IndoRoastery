const mongoose = require('mongoose')
const Roastery = require('../models/roastery')
const cities = require('./cities')
const { namakopi, deskriptor } = require('./dummyroasters')

mongoose.connect('mongodb://localhost:27017/indo-roaster')

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database Connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const dummyDB = async () => {
    await Roastery.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const randomDummies = Math.floor(Math.random() * 514)
        const harga = Math.floor(Math.random() * 10000) + 1000
        const roast = new Roastery({
            kreator: "62ea9bc1a9538cfcab5cbfca",
            lokasi: `${cities[randomDummies].name}`,
            nama: `${sample(namakopi)} ${sample(deskriptor)}`,
            deskripsi: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas aspernatur eos dignissimos? Iure quia quidem corrupti optio facilis, quasi molestiae impedit dolore, officiis esse libero enim id omnis, quaerat aperiam.',
            harga,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[randomDummies].longitude,
                    cities[randomDummies].latitude,
                ]
            },
            gambar: [
                {
                    url: 'https://res.cloudinary.com/dxyxg3egs/image/upload/v1659722372/IndoRoastery/gyyo4ukz3ri3mdfcuamt.jpg',
                    filename: 'IndoRoastery/gyyo4ukz3ri3mdfcuamt',
                },
                {
                    url: 'https://res.cloudinary.com/dxyxg3egs/image/upload/v1659722469/IndoRoastery/ezlo56rjxwyngjxrhjea.jpg',
                    filename: 'IndoRoastery/ezlo56rjxwyngjxrhjea',
                },
                {
                    url: 'https://res.cloudinary.com/dxyxg3egs/image/upload/v1659722469/IndoRoastery/ixsplxcwhcgqty4zgskk.jpg',
                    filename: 'IndoRoastery/ixsplxcwhcgqty4zgskk',
                }

            ]
        })
        await roast.save()
    }
}

dummyDB().then(() => {
    mongoose.connection.close()
})