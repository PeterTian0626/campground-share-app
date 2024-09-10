const mongoose = require('mongoose')
const Campground = require('../campground')
const Locations = require("./cities")
const Images = require("./images")
const { camps } = require("./camps")

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.DB_URL); //Mongo Atlas Url
// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp'); //local

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 100; i++) {
    const idx = (i < Locations.length)? i : i % Locations.length
    const price = 20 + Math.floor(Math.random() * 30)
    // const random = Math.round(Math.random() * 1000)
    const location = `${Locations[i % Locations.length].city}, ${Locations[i % Locations.length].state}`
    const title = camps[i % camps.length].title
    const camp = new Campground({
      title: title,
      location: location,
      geometry: {
        type: 'Point',
        coordinates: [Locations[i % Locations.length].longitude, Locations[i % Locations.length].latitude]
      },
      price: price,
      description: camps[i % camps.length].description,
      image: [Images[i % Images.length]],
      author: '66db6a303768b62873d1272f' //production environment
      // author: "66b38b0dfa50087a4c8e598f" //testing environment
    })
    await camp.save()
    // console.log(camps[i % camps.length])
  }
  console.log("Seeded db")
}

seedDB()
  .then(
    () => mongoose.connection.close
  )