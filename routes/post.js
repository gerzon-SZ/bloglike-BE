const express = require('express')
const router = express.Router()
const reqLogger = require('../middlewares/reqLogger')
const protectedRoute = require('../middlewares/authenticate')
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost } = require('../controller/postController')
router.route('/')
    .get(reqLogger,  getPosts)
    .post(reqLogger, createPost)

router.route('/:postId')
    .get(reqLogger, protectedRoute, getPost)
    .put(reqLogger, protectedRoute, updatePost)
    .delete(reqLogger, protectedRoute, deletePost)

module.exports = router
