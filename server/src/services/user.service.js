const User = require("../models/user.model");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Questions = require("../models/ques.model");
const Solutions = require("../models/solution.model");
const cloudinary = require("../config/cloudinary.config");
require('dotenv').config();

const createUser = async(data, file) => {
    const response = {};
    try{
        const symb = "@";
        const check = await User.find({email: data.email});
        const recheck = await User.find({username: symb.concat(data.username)});
        if(check?.email){
            response.error = "User present"
            return response;
        }
        let result;
        if(file?.path) {
            result = await cloudinary.uploader.upload(file.path, {
                folder: 'profile_images',
            });
        }
        const userObj = {
            image: result?.secure_url,
            name: data.name,
            username: symb.concat(data.username),
            email: data.email,
            profession: data.profession,
            password: data.password,
        }
        response.user = await User.create(userObj);
        return response.user;
    } catch(err){
        throw err;
    }
}

const verifyUser = async(data) => {
    const response = {};
    try {
        const userData = await User.findOne({email: data.email});
        if(userData === null){
            response.error = "Invalid Email";
        } else {
            let result = 1;
            if(data.password) result = bcrypt.compareSync(data.password, userData.password);
            if(result){
                response.success = true;
                response.userData = {
                    _id: userData._id,
                    email: userData.email,
                    name: userData.name,
                    username: userData.username,
                    profession: userData.profession,
                    image: userData.image,
                    createdAt:userData.createdAt,
                    updatedAt:userData.updatedAt,
                };
            } else {
                response.error = "Invalid Password";
            }
        }
        return response;
    } catch (error) {
        response.error = error;
        return error;
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

const updateUser =  async (data, file) =>{
    try{
        var result = {};      
        if(data.email){
            const user = await User.findOne({email : data.email});
            console.log(data, file);
            if(file){
                const publicId = user.image.split('/').slice(-2).join('/').split('.')[0];
                const del = await cloudinary.uploader.destroy(publicId);
                console.log(del);
                const url = await cloudinary.uploader.upload(file.path, {
                    folder: 'profile_images',
                });
                await User.findOneAndUpdate({email: data.email}, {
                    image: url.secure_url,
                    updatedAt: Date.now()
                });
            }
            if(data.profession || data.name) {
                if(data.profession){
                    await User.findOneAndUpdate({email: data.email}, {
                        profession: data.profession,
                        updatedAt: Date.now()
                    });
                }
                if(data.name){
                    await User.findOneAndUpdate({email: data.email}, {
                        name: data.name,
                        updatedAt: Date.now()
                    });
                }
            }
            await User.findOne({email : data.email}).then((response) => {
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
        console.log('Error is: ', err);
        return err.message;
    }
}

const deleteUser = async (data) => {
    try {
        const details = await User.findById(data.id);
        const publicId = details.image.split('/').slice(-2).join('/').split('.')[0];
        const result = await cloudinary.uploader.destroy(publicId);
        const response = await User.deleteOne({_id: data.id});
        return response;
    } catch (error) {
        throw error;
    }
}

const toggleFollow = async (userId, myId) => {
    try {
        const user = await User.findById(userId);
        if(!user) return;
        let me = await User.findById(myId);
        if(!me) return;
        if(!me.following.includes(userId)) await User.updateOne({ _id: myId }, {$push: { following: userId }});
        else await User.updateOne({ _id: myId }, {$pull: { following: userId }})
        me = await User.findById(myId);
        return me.following;
    } catch (error) {
        throw error;
    }
}

const saveQuestion = async(userId, questionId) => {
    try {
        let res;
        const user = await User.findById(userId);
        if(user.savedQuestions?.includes(questionId)) res = User.findByIdAndUpdate(userId, {$pull: {savedQuestions: questionId}});
        else res = User.findByIdAndUpdate(userId, {$push: {savedQuestions: questionId}});
        return res;
    } catch (error) {
        throw error;
    }
}

const getVoted = async(userId) => {
    try {
        const user = await User.findById(userId.toString());
        return user?.voted;
    } catch (error) {
        throw error;
    }
}

const getFollowing = async(userId) => {
    try {
        const user = await User.findById(userId);
        return user.following;
    } catch (error) {
        throw error;
    }
}

const getSaved = async(id) => {
    try {
        const user = await User.findById(id);
        return user.savedQuestions;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser, verifyUser, getUserByEmail, updateUser, getUser, deleteUser, getUsers, toggleFollow, saveQuestion, getVoted, getFollowing, getSaved
}