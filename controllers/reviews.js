const Roastery = require('../models/roastery')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const roastery = await Roastery.findById(req.params.id)
    const review = new Review(req.body.review)
    review.kreator = req.user._id
    roastery.reviews.push(review)
    await review.save()
    await roastery.save()
    req.flash('success', "Berhasil menambahkan review!")
    res.redirect(`/roasters/${roastery._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Roastery.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', "Berhasil menghapus review!")
    res.redirect(`/roasters/${id}`)
}

module.exports.logout = async (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'Sampai jumpa!')
        return res.redirect('/roasters');
    })
}