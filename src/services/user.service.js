const { compareSync } = require("bcrypt");
const User = require("../models/user.model");
const NotFound = require("../errors/notfound.error");
const jwt = require('jsonwebtoken');
const Questions = require("../models/ques.model");
const Solutions = require("../models/solution.model");
require('dotenv').config();

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

const getUserByEmail = async (data) => { 
    try{
        let userInfo = await User.findOne({email: data.email});
        return userInfo;
    }
    catch(err){
        console.log(err);
        return err.message;
    }
}

const getUser = async (data) => { 
    try{
        console.log(data);
        let userInfo = await User.findById(data.id);
        return userInfo;
    }
    catch(err){
        console.log(err);
        return err.message;
    }
}

const updateUser =  async (data) =>{
    try{
        var result = {}; 
        console.log(data);       
        if(data.email){
            const user = User.findOne({email : data.email});
            await User.findOneAndUpdate({email: data.email}, {
                name: data.name,
                email: data.email,
            });
            await user.then((response) =>{
                result = {
                    token : jwt.sign({email: response.email}, process.env.JWT_SECRET_KEY),
                    email : response.email,
                    name: response.name,
                }
            });
        }
        else{
            result = {
                error: "required fields are not provided to update the user information",
            }
        }
        return result;
    } catch(err) {
        console.log(err);
        return err.message;
    }
}

const deleteUser = async (data) => {
    try {
        const details = await User.findById(data.id);
        const response = await User.deleteOne({_id: data.id});
        await Questions.deleteMany({email: details.email});
        await Solutions.deleteMany({email: details.email});
        return response;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser, verifyUser, getUserByEmail, updateUser, getUser, deleteUser
}