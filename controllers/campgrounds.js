const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')
const maptilerClient = require('@maptiler/client')

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY

module.exports.index = async (req, res, next) => {
  const camps = await Campground.find({})
  res.render('campgrounds/index', { camps })
}

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new")
}

module.exports.createCampground = async (req, res, next) => {
  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 })
  const camp = new Campground(req.body.campground)
  camp.geometry = geoData.features[0].geometry;
  camp.image = req.files.map((f) => ({ 'url': f.path, 'filename': f.filename }))
  camp.author = req.user._id
  await camp.save()
  req.flash("success", 'Successfully created a new campground')
  res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.show = async (req, res, next) => {
  const { id } = req.params
  const camp = await Campground.findById(id).populate(
    {
      path: 'reviews',
      populate: { path: 'author' }
    }
  ).populate('author')
  if (!camp) {
    req.flash("error", 'Could not find the campground')
    res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { camp })
}

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params
  const camp = await Campground.findById(id)
  if (!camp) {
    req.flash("error", 'Could not find the campground')
    res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { camp })
}

module.exports.updateCampground = async (req, res, next) => {
  console.log(req.body)
  const id = req.params.id
  const camp = await Campground.findByIdAndUpdate(id, req.body.campground)
  imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }))
  camp.image.push(...imgs)
  await camp.save()
  if (req.body.deleteImages) {
    await camp.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    for (let imgName of req.body.deleteImages) {
      cloudinary.uploader.destroy(imgName)
    }
  }
  req.flash("success", 'Successfully updated campground')
  return res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
  const id = req.params.id
  await Campground.findByIdAndDelete(id)
  req.flash("success", 'Successfully created a campground')
  res.redirect('/campgrounds')
}