const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
  const { id } = req.params
  const camp = await Campground.findById(id)
  const review = new Review(req.body.review)
  console.log(req.body.review)
  review.author = req.user._id
  camp.reviews.push(review)
  await review.save()
  await camp.save()
  req.flash("success", 'Successfully created a new review')
  res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteReview = async (req, res) => {
  const { id, reviewID } = req.params
  const camp = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } })
  await Review.findByIdAndDelete(reviewID)
  req.flash("success", 'Successfully deleted a review')
  res.redirect(`/campgrounds/${id}`)
}