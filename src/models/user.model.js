const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name cannot be empty']
    },
    email: {
        type: String,
        required: [true, 'Email cannot be empty']
    },
    profession: {
        type: String,
        required: [true, 'profession cannot be empty']
    },
    password: {
        type: String,
        minLength: 5,
        required: true,
        match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,}$/,
    },
    createdAt:{
        type: Date,
        immutable: true,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default:Date.now,
    },
});

userSchema.pre('save', function(next) {
    const hashedPassword = bcrypt.hashSync(this.password, 11);
    this.password = hashedPassword;
    next();
});

const User = mongoose.model('Users', userSchema);

module.exports = User;