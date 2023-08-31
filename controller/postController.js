
const Post = require('../models/Post');
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(posts)
    }
    catch (err) {
        throw new Error(`Error retrieving posts: ${err.message}`);
    }
}
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(post)
    }
    catch (err) {
        throw new Error(`Error retrieving post: ${err.message}`);
    }
}
const createPost = async (req, res) => {
    try {
        console.log(req.body, "creating post");
        const post = await Post.create(req.body);
        res
        .status(201)
        .setHeader('Content-Type', 'application/json')
        .json(post)
    }
    catch (err) {
        throw new Error(`Error creating post: ${err.message}`);
    }
}
const updatePost = async (req, res) => {
    try {
        // delete by mongddbid
        const post = await Post.findByIdAndUpdate(req.params.postId, {
            $set: req.body
        }, { new: true}); 
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(post)
        // Post.deleteOne({id:req.params.postId}, (err, result) => {
        //     if (err) {
        //         console.error(err);
        //         res.status(500).send('Error deleting post');
        //     } else if (result.deletedCount === 0) {
        //         res.status(404).send('No matching post found');
        //     } else {
        //         res.status(204).send({}); // Successful deletion, no content response
        //     }
        // });
    }
    catch (err) {
        throw new Error(`Error updating post: ${err.message}`);
    }
}
const deletePost = async (req, res) => {
    try {
        console.log(req.params.postId, "deleting post");
        await Post.findByIdAndDelete(req.params.postId);
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json( { success: true, msg: `delete post with id of ${req.params.postId}`})
    }
    catch (err) {
        throw new Error(`Error deleting post: ${err.message}`);
    }
}

module.exports = {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
}
