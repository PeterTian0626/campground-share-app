const ExpressError = require('./utils/ExpressErrors')
const Campground = require('./models/campground')
const { campSchema, reviewSchema } = require('./schemas');
const Review = require('./models/review');

module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", 'you must log in to view this page')
    return res.redirect('/login')
  }
  next();
}

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
}

module.exports.validateCampground = (req, res, next) => {
  const result = campSchema.validate(req.body)
  if (result.error) {
    const msg = result.error.details.map(el => el.message).join(',')
    throw new ExpressError(400, msg)
  }
  else {
    next()
  }
}

module.exports.isOwner = async (req, res, next) => {
  const id = req.params.id
  const camp = await Campground.findById(id)
  if (!camp.author._id.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do this')
    return res.redirect(`/campgrounds/${id}`)
  }
  else {
    next();
  }
}


module.exports.validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body)
  if (result.error) {
    const msg = result.error.details.map(el => el.message).join(',')
    throw new ExpressError(400, msg)
  }
  else {
    next()
  }
}

module.exports.reviewOwner = async (req, res, next) => {
  const { reviewID, id } = req.params
  const review = await Review.findById(reviewID).populate('author')
  const userId = req.user._id
  if (!userId.equals(review.author._id)) {
    req.flash('error', 'You do not have permission to do this')
    return res.redirect(`/campgrounds/${id}`)
  }
  next()
}