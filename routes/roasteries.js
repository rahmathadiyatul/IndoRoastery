const express = require('express')
const router = express.Router()
const roasteries = require('../controllers/roasteries')
const asyncError = require('../ERROR/asyncError')
const { isLoggedIn, isKreator, validateRoastery } = require('../middleware.js');
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(asyncError(roasteries.index))
    .post(isLoggedIn, upload.array('gambar'), validateRoastery, asyncError(roasteries.createRoastery))

router.get('/new', isLoggedIn, roasteries.renderNewForm)

router.route('/:id')
    .get(asyncError(roasteries.showRoastery))
    .put(isLoggedIn, isKreator, upload.array('gambar'), validateRoastery, asyncError(roasteries.updateRoastery))
    .delete(isLoggedIn, isKreator, asyncError(roasteries.deleteRoastery))

router.get('/:id/edit', isLoggedIn, isKreator, asyncError(roasteries.renderEditForm))

module.exports = router