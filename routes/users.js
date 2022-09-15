const express = require('express')
const router = express.Router()
const users = require('../controllers/users')
const asyncError = require('../ERROR/asyncError')
const passport = require('passport')

router.route('/register')
    .get(users.registerUser)
    .post(asyncError(users.registeringUser))

router.route('/login')
    .get(users.loginUser)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', asyncError(users.logout))

module.exports = router