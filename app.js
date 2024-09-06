if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoSantizer = require("express-mongo-sanitize")
const helmet = require('helmet')
const MongoStore = require('connect-mongo');

const ExpressError = require('./utils/ExpressErrors')
const campgroundRouter = require('./routes/campground')
const reviewRouter = require('./routes/review')
const userRouter = require('./routes/user')
const User = require('./models/user')


const dbUrl = process.env.DB_URL|| "mongodb://127.0.0.1:27017/yelp-camp";
// const dbUrl = process.env.DB_URL;
// mongoose.connect(dbUrl);

const secret = process.env.SECRET || 'aSecretKey'

mongoose.connect(dbUrl);
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600,
  crypto: {
    secret: secret
  }
})

const app = express()
const port = 3000

app.set('views', path.join(__dirname, 'views'))
// app.set('engine', ejsMate)
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.listen(port, () => {
  console.log('running')
})
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSantizer())
app.use(helmet())

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://cdn.maptiler.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://cdn.maptiler.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
  "https://api.maptiler.com/"
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dx8eansli/",
        "https://images.unsplash.com/",
        "https://api.maptiler.com/"
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

const sessionConfig = {
  name: "session",
  secret: process.env.SECRET || 'aSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash())

//passport authentication config
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// local variables
app.use((req, res, next) => {
  // console.log(req.query)
  app.locals.currentUser = req.user;
  app.locals.success = req.flash('success');
  app.locals.error = req.flash('error');
  next()
})

app.use('/', userRouter)
app.use("/campgrounds", campgroundRouter)
app.use("/campgrounds/:id/reviews", reviewRouter)

app.get('/', (req, res) => {
  res.render('home')
})

app.all("*", (req, res, next) => {
  throw new ExpressError(404, 'Page Not Found')
})

app.use((err, req, res, next) => {
  const { message = "Something went wrong", statusCode = 500 } = err
  res.status(statusCode)
  // res.send(message)
  res.render('campgrounds/error', { err })
})