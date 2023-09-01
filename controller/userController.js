const User = require('../models/User');
const crypto = require('crypto');

const getUsers = async (req, res, next) => {
    const filter = {};
    const options = {};

    if (Object.keys(req.query).length) {
        const { username, gender, limit, sortByFirstName } = req.query;

        filter.admin = false;

        if (username) filter.username = true;
        if (gender) filter.gender = true;
        if (limit) options.limit = limit;
        if (sortByFirstName) {
            options.sort = {
                firstName: sortByFirstName === 'asc' ? 1 : -1
            };
        }
    }

    try {
        const users = await User.find({}, '-password', options);
        delete users["password"];
        delete users["admin"];
       
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ success: false, msg: `Error retrieving users: ${err.message}` });
    }
};

const createUser = async (req, res, next) => {
    try {
       
        const user = await User.create(req.body);
        console.log(user);
        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(500).json({ success: false, msg: `Error creating user: ${err.message}` });
    }
};

const deleteUsers = async (req, res, next) => {
    try {
        await User.deleteMany();
        res.status(200).json({ success: true, msg: 'Deleted all users' });
    } catch (err) {
        res.status(500).json({ success: false, msg: `Error deleting users: ${err.message}` });
    }
};

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.UserId);
        if (!user) {
            res.status(404).json({ success: false, msg: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ success: false, msg: `Error retrieving user: ${err.message}` });
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, {
            $set: req.body
        }, { new: true });

        if (!user) {
            res.status(404).json({ success: false, msg: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ success: false, msg: `Error updating user: ${err.message}` });
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);

        if (!user) {
            res.status(404).json({ success: false, msg: 'User not found' });
            return;
        }

        res.status(200).json({ success: true, msg: `Deleted user with id: ${req.params.UserId}` });
    } catch (err) {
        res.status(500).json({ success: false, msg: `Error deleting user: ${err.message}` });
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ success: false, msg: 'Please provide an email and password' });
        return;
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            res.status(401).json({ success: false, msg: 'Invalid credentials' });
            return;
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            res.status(401).json({ success: false, msg: 'Invalid credentials' });
            return;
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, msg: `Error logging in: ${err.message}` });
    }
};

const forgotPassword = async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) {
        res.status(404).json({ success: false, msg: 'User not found' });
        return;
    }

    const resetToken = user.getResetPasswordToken();
    try {
        await user.save({ validateBeforeSave: false });
        res.status(200).json({
            success: true,
            msg: `Password reset email sent to: ${user.email}`,
            resetToken
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500).json({ success: false, msg: 'Failed to save reset password token' });
    }
};

const resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.query.resetToken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        res.status(400).json({ success: false, msg: 'Invalid token' });
        return;
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();
    sendTokenResponse(user, 200, res);
};

const updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')
    const passwordMatches = await user.matchPassword(req.body.password);
    if (!passwordMatches) {
        res.status(400).json({ success: false, msg: 'Password is incorrect' });
        return;
    }

    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
};

const logout = async (req, res, next) => {
    res
        .status(200)
        .cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        })
        .json({ success: true, msg: 'Successfully logged out!' });
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') options.secure = true;

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, token, firstname: user.firstName, lastname: user.lastName, userId: user.id, admin: user.admin });
};

module.exports = {
    getUser,
    deleteUser,
    createUser,
    updateUser,
    getUsers,
    deleteUsers,
    login,
    forgotPassword,
    resetPassword,
    logout,
    updatePassword
};
