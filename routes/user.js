const express = require('express');
const router = express.Router();
const {
    getUsers,
    deleteUsers,
    createUser,
    deleteUser,
    getUser,
    updateUser,
    login,
    forgotPassword,
    resetPassword,
    logout,
    updatePassword
} = require('../controller/userController');
const reqLogger = require('../middlewares/reqLogger')
const {
    userValidator,
    adminValidator
} = require('../middlewares/utils/validators')
const protectedRoute = require('../middlewares/authenticate')


router.route('/')
    .get(reqLogger, getUsers)
    .post(reqLogger, createUser)
    .delete(reqLogger, deleteUsers)

router.route('/login')
    .post(reqLogger, login)

router.route('/forgotpassword') 
    .post(reqLogger, forgotPassword)

router.route('/resetpassword')
    .put(reqLogger, resetPassword)

router.route('/updatepassword')
    .put(reqLogger, updatePassword)

router.route('/logout')
    .get(reqLogger, protectedRoute, logout)

router.route('/:userId')
    .get(reqLogger, getUser)
    .put(reqLogger, updateUser)
    .delete(reqLogger, deleteUser)

    module.exports = router;