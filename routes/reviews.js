const express = require('express')
const router = express.Router({ mergeParams: true })
const reviews = require('../controllers/reviews')
const asyncError = require('../ERROR/asyncError')
const { validateReview, isLoggedIn, isReviewKreator } = require('../middleware.js');

router.post('/', isLoggedIn, validateReview, asyncError(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewKreator, asyncError(reviews.deleteReview))

module.exports = router