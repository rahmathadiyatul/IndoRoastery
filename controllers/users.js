const User = require('../models/user')
const storeSession = require('store2')

module.exports.registerUser = (req, res) => {
    res.render('users/register')
}

module.exports.registeringUser = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'Selamat Datang di Indo Roastery!')
            res.redirect('/roasters')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.loginUser = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!')
    const returnTo = storeSession.get('A') || '/roasters'
    res.redirect(returnTo)
    // req.flash('success', 'welcome back!');
    // const redirectUrl = req.session.returnTo;
    // delete req.session.returnTo;
    // res.redirect(redirectUrl);
}

module.exports.logout = async (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'Sampai jumpa!')
        return res.redirect('/');
    })
}