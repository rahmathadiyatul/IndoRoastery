const Roastery = require('../models/roastery')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require('../cloudinary')

module.exports.index = async (req, res,) => {
    const roasteries = await Roastery.find({})
    res.render('roasters/index', { roasteries })
}

module.exports.renderNewForm = (req, res) => {
    res.render('roasters/new')
}

module.exports.createRoastery = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.roastery.lokasi,
        limit: 1
    }).send()
    const roastery = new Roastery(req.body.roastery)
    roastery.geometry = geoData.body.features[0].geometry
    roastery.gambar = req.files.map(f => ({ url: f.path, filename: f.filename }))
    roastery.kreator = req.user._id
    await roastery.save()
    req.flash('success', 'Berhasil menambahkan roastery')
    res.redirect(`/roasters/${roastery._id}`)
}

module.exports.showRoastery = async (req, res) => {
    const roastery = await Roastery.findById(req.params.id).populate(
        {
            path: 'reviews',
            populate: {
                path: 'kreator'
            }
        }).populate('kreator')
    if (!roastery) {
        req.flash('error', "Roastery tidak ditemukan!")
        return res.redirect('/roasters')
    }
    res.render('roasters/show', { roastery })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const roastery = await Roastery.findById(id)
    if (!roastery) {
        req.flash('error', "Roastery tidak ditemukan!")
        return res.redirect('/roasters')
    }
    res.render('roasters/edit', { roastery })
}

module.exports.updateRoastery = async (req, res) => {
    const { id } = req.params
    const roastery = await Roastery.findByIdAndUpdate(id, { ...req.body.roastery })
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    roastery.gambar.push(...images)
    await roastery.save()
    if (req.body.hapusGambar) {
        for (let filename of req.body.hapusGambar) {
            await cloudinary.uploader.destroy(filename)
        }
        await roastery.updateOne({ $pull: { gambar: { filename: { $in: req.body.hapusGambar } } } })
    }
    req.flash('success', 'Berhasil memperbarui roastery')
    res.redirect(`/roasters/${roastery._id}`)
}

module.exports.deleteRoastery = async (req, res) => {
    const { id } = req.params
    await Roastery.findByIdAndDelete(id)
    req.flash('success', 'Berhasil menghapus roastery')
    res.redirect('/roasters')
}