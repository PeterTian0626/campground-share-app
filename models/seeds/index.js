const mongoose = require('mongoose')
const Campground = require('../campground')
const Locations = require("./cities")
const { descriptors, places } = require("./camps")

// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
mongoose.connect("mongodb+srv://petertian626:aGI8AxmQuIXX8SwO@cluster0.pgk7z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

const sample = (arr) => arr[Math.floor(Math.random() * arr.length) + 1]

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 100; i++) {
    const price = 20 + Math.floor(Math.random() * 30)
    const random = Math.round(Math.random() * 1000)
    const location = `${Locations[random].city}, ${Locations[random].state}`
    const title = `${sample(descriptors)} ${sample(places)} (Seed Data)`
    const camp = new Campground({
      title: title,
      location: location,
      geometry: {
        type: 'Point',
        coordinates: [Locations[random].longitude, Locations[random].latitude]
      },
      price: price,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas obcaecati excepturi dicta iure aut perferendis esse repellendus error sequi, soluta, similique fuga odit incidunt! Natus blanditiis vel beatae quisquam expedita!",
      image: [{ url: `https://res.cloudinary.com/dx8eansli/image/upload/v1725390083/YelpCamp/evkku5j3rqgrm9ybsg3g.jpg`, filename: 'seed_filename' }],
      author: '66db6a303768b62873d1272f'
    })
    await camp.save()
  }
  console.log("Seeded db")
}

seedDB()
  .then(
    () => mongoose.connection.close
  )