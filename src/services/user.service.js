const { compareSync } = require("bcrypt");
const User = require("../models/user.model");
const bcrypt = require('bcrypt')
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
    const response = {};
    try {
        console.log("Data is", data);
        const userData = await User.findOne({email: data.email});
        if(userData === null){
            response.error = "Invalid Email";
        } else {
            const result = bcrypt.compareSync(data.password, userData.password);
            if(result){
                response.success = true;
                response.userData = {
                    _id: userData._id,
                    email: userData.email,
                    name: userData.name,
                    createdAt:userData.createdAt,
                    updatedAt:userData.updatedAt,
                };
            } else {
                response.error = "Invalid Password";
            }
        }
        return response;
    } catch (error) {
        console.log("Error: ", err);
        response.error = err.message;
        return response;
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
        const userInfo = await User.findById(data.id);
        return userInfo;
    }
    catch(err){
        console.log(err);
        return err.message;
    }
}

const getUsers = async () => { 
    try{
        const userInfo = await User.find();
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
        console.log(data);
        const details = await User.findById(data.id);
        const response = await User.deleteOne({_id: data.id});
        const ques = await Questions.find({userId: data.id});
        ques.forEach(async (quest) => await Solutions.deleteMany({questionId: quest._id}));
        await Questions.deleteMany({userId: data.id});
        await Solutions.deleteMany({userId: data.id});
        return response;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser, verifyUser, getUserByEmail, updateUser, getUser, deleteUser, getUsers
}