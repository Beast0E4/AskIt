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
        const check = await User.find({email: data.email});
        if(check?.email){
            response.error = "User present"
            return response;
        }
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'profile_images',
        });
        const userObj = {
            image: result.secure_url,
            name: data.name,
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
                    profession: userData.profession,
                    image: userData.image,
                    following: userData.following,
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
        const ques = await Questions.find({userId: data.id});
        ques.forEach(async (quest) => await Solutions.deleteMany({questionId: quest._id}));
        await Questions.deleteMany({userId: data.id});
        await Solutions.deleteMany({userId: data.id});
        return response;
    } catch (error) {
        throw error;
    }
}

const followUser = async (userId, myId) => {
    try {
        const user = await User.findById(userId);
        if(!user) return;
        let me = await User.findById(myId);
        if(!me) return;
        await User.updateOne({ _id: myId }, {$push: { following: userId }});
        me = await User.findById(myId);
        return me.following; 
    } catch (error) {
        throw error;
    }
}

const unFollowUser = async (userId, myId) => {
    try {
        const user = await User.findById(userId);
        if(!user) return;
        let me = await User.findById(myId);
        if(!me) return;
        await User.updateOne({ _id: myId }, {$pull: { following: userId }})
        me = await User.findById(myId);
        console.log(me.following);
        return me.following; 
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser, verifyUser, getUserByEmail, updateUser, getUser, deleteUser, getUsers, followUser, unFollowUser
}