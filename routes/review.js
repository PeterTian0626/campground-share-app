const express = require('express')
const router = express.Router({ mergeParams: true })
const reviewController = require('../controllers/reviews')


const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const Review = require('../models/review')
const { isLoggedIn, validateReview, reviewOwner } = require('../middleware')



router.post("/", isLoggedIn, validateReview, catchAsync(reviewController.createReview))

router.delete('/:reviewID', isLoggedIn, reviewOwner, catchAsync(reviewController.deleteReview))


module.exports = router