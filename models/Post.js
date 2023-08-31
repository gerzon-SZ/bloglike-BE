const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const PostSchema = new Schema ({
    id: {
        type: String,
        required: [true, 'Please add a id!'],
        // maxLength: [10, 'id can not be more than 10 characters']
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    body: {
        type: String,
        required: [true, 'Please add a body']
    },
    userId: {
        type: String,
        required: [true, 'Please add an user id'],
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Post', PostSchema);