const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

const generateAccessToken = (email) => {
    const payload = { email };

    return jwt.sign(payload, secret, { expiresIn: '1h' });
};

class authController {
    async signUp(req, res) {
        try {
            const { username, password, email } = req.body;
            const candidate = await User.findOne({ email });

            if (candidate) {
                return res
                    .status(404)
                    .json({ message: 'User with that name already exists' });
            }

            const hash = crypto.createHash('SHA3-256');

            const hashPassword = hash
                .update(password)
                .digest('hex')
                .toLowerCase();

            const user = new User({
                // _id: uuidv4(),
                username,
                password: hashPassword,
                email,
                isBlock: false,
                registrationDate: Date.now(),
                lastLogin: null,
            });

            await user.save();

            return res.json({ message: 'Registration success' });
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: 'sing up error' });
        }
    }

    async signIn(req, res) {
        try {
            const { password, email } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(404)
                    .json({ message: `user ${email} not found` });
            }

            const hash = crypto.createHash('SHA3-256');
            const hashPassword = hash
                .update(password)
                .digest('hex')
                .toLowerCase();

            const validPassword = hashPassword === user.password;

            if (!validPassword) {
                return res.status(400).json({ message: 'wrong password' });
            }

            const token = generateAccessToken(user.email);

            const visitDate = await User.updateOne(
                { email: email }, // Filter
                { lastLogin: Date.now() } // Update
            );

            return res.json({ token, email });
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: 'sing in in error' });
        }
    }
}

module.exports = new authController();
