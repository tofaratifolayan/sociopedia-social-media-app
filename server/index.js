import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import userRoutes from  './routes/users.js'
import postRoutes from './routes/posts.js'
import { register } from './controllers/auth.js'
import { createPost } from './controllers/posts.js'
import { verifyToken } from './middleware/auth.js'
import User from './models/User.js'
import Post from './models/Post.js'
import { users, posts } from './data/index.js'

// CONFIGURATIONS: includes middleware configurations and package configurations.
// middleware is something that runs in between different requests

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
// the following sets the storage of the images locally. 
// IRL we would want to store the images on cloud storage
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

// File storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

// ROUTES WITH FILES 

// authentication (logging users in)
app.post('/auth/register', upload.single('picture'), register)
// upload.single('picture') uploads your picture locally to the public/assets folder. It's a middleware because its in between and occurs before our
// actual logic, register.

// route needs to be done here because we upload pictures in posts
// upload.single('picture') grabs the picture from the http call and uploads it
app.post('/posts', verifyToken, upload.single('picture'), createPost)


// ROUTES - these routes can have their own separate files because they don't have any files.
app.use('/auth', authRoutes)
// authorization (making sure logged in users can perform certain tasks that logged out ones cannot)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)

// MONGOOSE SETUP (MONGO DB)
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port ${PORT}`))
    // ADD DATA ONE TIME, use it only when you need to
    // User.insertMany(users)
    // Post.insertMany(posts)
}).catch((error) => console.log(`${error} did not connect`))

