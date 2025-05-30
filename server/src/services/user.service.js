const User = require("../models/user.model");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Questions = require("../models/ques.model");
const Solutions = require("../models/solution.model");
const cloudinary = require("../config/cloudinary.config");
const mailerMiddleware = require ('../middlewares/mailer')
const OTP = require ('../models/otp.model');
const crypto = require ('crypto');

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
        const user = await User.create(userObj);
        response.user = user;

        await mailerMiddleware.sendWelcomeEmail(data.email);
        return response;
    } catch(err){
        response.error = err.message;
        return response;
    }
}

const verifyUser = async(data) => {
    const response = {};
    try {
        console.log (data);
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
            if(file){
                const publicId = user.image.split('/').slice(-2).join('/').split('.')[0];
                const del = await cloudinary.uploader.destroy(publicId);
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

const getFollower = async(userId) => {
    try {
        console.log (userId);
        const followers = await User.find({ following: userId }).select('_id username');
        return followers;
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

const sendOtp = async(email) => {
    const response = {};
    try {
        const userdata = await User.findOne({
            email
        })
        if(userdata){
            response.error = "Email already in Use";
            return response;
        }
        const otps = await OTP.deleteMany({
            email : email
        })
        const otp = crypto.randomInt(100000, 999999).toString();
        const sent = await mailerMiddleware.sendOtp(email, otp);
        if(!sent){
            response.error = sent;
            msg = "Otp not sent";
            return response;
        }
        const user = await OTP.create({
            email, otp
        });
        response.user = user;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

const verifyOtp = async(email,otp) => {
    const response = {};
    try {
        const userdata = await OTP.findOne({ email });
        if(!email){
            response.error = "email not found";
            return response;
        }
        if(userdata.otp != otp){
            response.error = "Otp not same";
            return response;
        }
        await OTP.deleteMany ({ email })
        response.user = userdata;
        return response
    } catch (error) {
        response.error = error.message;
        return response
    }
}

module.exports = {
    createUser, verifyUser, getUserByEmail, updateUser, getUser, deleteUser, getUsers, toggleFollow, saveQuestion, getVoted, getFollowing, getSaved, getFollower, sendOtp, verifyOtp
}