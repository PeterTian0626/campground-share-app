const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {
  res.render('users/register')
}

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body
    const user = await User.register(new User({ username: username, email: email }), password)
    req.login(user, (err) => {
      if (err) { return next(err) }
      req.flash('Welcome')
      res.redirect('/campgrounds')
    })
  } catch (e) {
    req.flash('error', e.message)
    res.redirect('/register')
  }
}

module.exports.longin = function (req, res) {
  req.flash('success', "Welcome back!")
  const redirectUrl = res.locals.returnTo || '/campgrounds';
  res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Goodbye!')
    res.redirect('/campgrounds')
  })
}