import Post from '../models/Post.js'
import User from '../models/User.js'

// CREATE
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body
        const user = await User.findById(userId)
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save()

        const post = await Post.find()
        // grabs all the posts, so the frontend can display all the posts
        // this elucidates how difficult frontend is. You have to consider what the backend is sending you,
        // you have to format that,and make sure when backend send you info you update the frontend accordingly
        // dealing with the APIs, how they're sending it how we grab it and format it and the differenct restrictions placed can make frontend difficult
        res.status(201).json(post)
        // 201 is successful CREATION code
    } catch(err) {
        res.status(409).json({ message: err.message })
        // 409 is creation error
    }
}


// READ
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find()
        res.status(200).json(post)
        // 200 is just a successful request
    } catch(err) {
        res.status(404).json({ message: err.message })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params
        const post = await Post.find({ userId })
        res.status(200).json(post)
        // 200 is just a successful request
    } catch(err) {
        res.status(404).json({ message: err.message })
    }
}

// UPDATE
export const likePost = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body
        const post = await Post.findById(id)
        const isLiked = post.likes.get(userId)

        if (isLiked) {
            post.likes.delete(userId)
        } else {
            post.likes.set(userId, true)
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id, 
            { likes: post.likes },
            { new: true }
        )

        res.status(200).json(updatedPost)
        // passing in the updated Post onject to the frontend
    } catch(err) {
        res.status(404).json({ message: err.message })
    }
}