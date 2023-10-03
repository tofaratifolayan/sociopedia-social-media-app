import express from 'express'
import { getFeedPosts, getUserPosts, likePost } from '../controllers/posts.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// READ
router.get('/', verifyToken, getFeedPosts)
// you get all the feeds in this project to keep it simple, normally we would implement some machine learning/AI here to curate your feed
router.get('/:userId/posts', verifyToken, getUserPosts)

// UPDATE
router.patch('/:id/like', verifyToken, likePost)
// for liking and unliking


export default router