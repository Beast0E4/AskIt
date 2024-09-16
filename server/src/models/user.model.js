const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    image:{
        type: String,
        required: [true, 'Image cannot be empty'],
        default: "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
    },
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
        required: [true, 'Profession cannot be empty']
    },
    password: {
        type: String,
        minLength: 5,
        required: true,
        match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,}$/,
    },
    following: {
        type: [String]
    },
    savedQuestions: {
        type: [String]
    },
    voted: {
        type: [String]
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