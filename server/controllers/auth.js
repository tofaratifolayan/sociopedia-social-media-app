import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// REGISTER USER

// This is essentially like an API call from frontend to backend, to database. We make it async to call mongo database
// req(uest) comes from front end and res(ult) comes from backend.
export const register = async (req, res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body

        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000) 
        })

        const savedUser = await newUser.save()
        // status code 201, something has been created
        res.status(201).json(savedUser)
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
}

// remember to make the viewedProfile and impressions change dynamically
// check network tap inspect element to see all API calls

// LOGGING IN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        // if improper email, returns error
        if (!user) return res.status(400).json({ msg: 'User does not exist.' })
        // uses same salt to compare if passwords are the same
        const isMatch = await bcrypt.compare(password, user.password)
        // if the password given isn't the same as the password in the database, return error
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        // make sure password isn't passed to frontend
        delete user.password
        res.status(200).json({ token, user })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Authentication in Firebase is much better as this is a basic setup and Firebase is much more secure.
// This is a basic set up to help understand how authentication works. When you attempt to log in
// a token is created and you can use that token to sign in
// We've just built the login endpoint!

// Now we have to do authorisation, which means logged in users can hit certain endpoints that non loged in cannot