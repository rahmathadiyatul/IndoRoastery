const { roasterySchema, reviewSchema } = require('./schemas.js');
const appError = require('./ERROR/appError')
const Roastery = require('./models/roastery')
const Review = require('./models/review')



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Kamu harus terdaftar terlebih dahulu!')
        return res.redirect('/login')
    } next()
}

module.exports.validateRoastery = (req, res, next) => {
    const { error } = roasterySchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new appError(msg, 400)
    } else { next() }
}

module.exports.isKreator = async (req, res, next) => {
    const { id } = req.params
    const roastery = await Roastery.findById(id)
    if (!roastery.kreator.equals(req.user._id)) {
        req.flash('error', "Roastery tidak ditemukan!")
        return res.redirect(`/roasters/${id}`)
    }
    next()
}

module.exports.isReviewKreator = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.kreator.equals(req.user._id)) {
        req.flash('error', "Roastery tidak ditemukan!")
        return res.redirect(`/roasters/${id}`)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new appError(msg, 400)
    } else { next() }
}