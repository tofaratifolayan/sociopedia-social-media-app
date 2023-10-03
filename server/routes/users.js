import express from 'express'
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from '../controllers/users.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()
// We won't follow CRUD to the tee, in order to quicken the process of this project

// READ
router.get('/:id', verifyToken, getUser)
router.get('/:id/friends', verifyToken, getUserFriends)

// UPDATE: More like Facebook where you add or remove friends, less like Twitter, where you have followers
router.patch('/:id/:friendId', verifyToken, addRemoveFriend)

export default router