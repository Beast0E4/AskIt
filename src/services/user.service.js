const { compareSync } = require("bcrypt");
const User = require("../models/user.model");
const { NOT_FOUND } = require("http-status-codes");
const NotFound = require("../errors/notfound.error");

const createUser = async(data) => {
    try{
        const userObj = {
            name: data.name,
            email: data.email,
            password: data.password,
        }
        const response = await User.create(userObj);
        return response;
    } catch(err){
        throw err;
    }
}

const verifyUser = async(data) => {
    try {
        const details = await User.findOne({email: data.email});
        if(details){
            if(compareSync(data.password, details.password)){
                console.log(details); return details;
            }
        }
        throw new NotFound('User', data.email);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser, verifyUser
}