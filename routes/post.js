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
    .get(reqLogger,protectedRoute,  getPosts)
    .post(reqLogger, protectedRoute, createPost)

router.route('/:id')
    .get(reqLogger, protectedRoute, getPost)
    .put(reqLogger, protectedRoute, updatePost)
    .delete(reqLogger, protectedRoute, deletePost)

module.exports = router
