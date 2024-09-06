const { ref } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = mongoose

const imageSchema = new Schema({
  url: String,
  filename: String
})

imageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON: { virtuals: true } }

const campgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  image: [imageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }]
}, opts);



campgroundSchema.virtual('properties.popupText').get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}"> ${this.title}</a></strong>
  <p>${this.description.substring(0, 60)}...</p>`
  // return 'Popup!'
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
  console.log(doc)
  if (doc) {
    // console.log(doc.reviews)
    for (let id of doc.reviews) {
      // console.log(id)
      await Review.findByIdAndDelete(id)
    }
  }
})

const Campground = mongoose.model('Campground', campgroundSchema)
module.exports = Campground