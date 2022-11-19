const { Schema, model } = require('mongoose');

const User = new Schema({
    // _id: { type: String, unique: true, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isBlock: { type: Boolean, required: true },
    registrationDate: { type: Number, required: true },
    lastLogin: Schema.Types.Mixed,
});

module.exports = model('User', User);
