const express = require('express')
const router = express.Router()

const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateCampground, isOwner } = require('../middleware')
const campgorundController = require('../controllers/campgrounds')
const { cloudinary, storage } = require('../cloudinary')

const multer = require('multer')
// const upload = multer({ dest: 'uploads' })
const upload = multer({ storage })

router.route('/')
  .get(catchAsync(campgorundController.index))
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgorundController.createCampground))
// .post(upload.array('image'), (req, res) => {
//   try {
//     console.log(req.body, req.files)
//     res.send("Worked")
//   } catch (e) {
//     console.log(e)
//     res.send(e)
//   }
// })

router.get('/new', isLoggedIn, campgorundController.renderNewForm)

router.route('/:id')
  .get(catchAsync(campgorundController.show))
  .put(isLoggedIn, isOwner, upload.array('image'), validateCampground, catchAsync(campgorundController.updateCampground))
  .delete(isLoggedIn, isOwner, catchAsync(campgorundController.deleteCampground))

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(campgorundController.renderEditForm))

module.exports = router