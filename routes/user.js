const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const { storeReturnTo } = require('../middleware')
const userController = require('../controllers/users')

// router.get('/register', userController.renderRegisterForm)

// router.post('/register', catchAsync(userController.register))

router.route('/register')
  .get(userController.renderRegisterForm)
  .post(catchAsync(userController.register))

// router.get('/login', (req, res) => {
//   res.render('users/login')
// })

// router.post('/login', storeReturnTo, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.longin);

router.route('/login')
  .get((req, res) => {
    res.render('users/login')
  })
  .post(
    storeReturnTo,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    userController.longin
  )

router.get('/logout', userController.logout)

module.exports = router