// Following from our data relations table (relations_data.jpg), we can see the properties of Post data we want it to have.
// We get an _id from Mongo DB, and we need the userId (stringRef) of who posted it, firstName, lastName, location, description (all strings)
// userPicturePatch, because we have the user image, picturePath url, and the likes and comments,
// THe way we store the likes is going to be complicated, as we have and Object, and in this object we're goiing to have a 
// referrence of who liked a post. It's just gonna represent a boolean. Comments will just be an array of strings, 
// we won't make it to complicated by adding features such as liking comments like in Instagram 

import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        // We store the likes in an object (Map, basically a dict) instead of an Array becaus ewe can do contant time search using an Object
        likes: {
            type: Map,
            of: Boolean,
        },
        comments: {
            type: Array,
            default: []
        }
    },
    { timestamps: true }
)

const Post = mongoose.model('Post', postSchema)

export default Post