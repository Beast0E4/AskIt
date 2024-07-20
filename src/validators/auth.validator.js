const NotFound = require('../errors/notfound.error');
const authService = require('../services/auth.service')
const userService = require('../services/user.service')

const isUserAuthenticated = async (req, res, next) => {
    const token = req.headers['x-access-token'];
 
    if(!token){
        console.log("token is", token);
        throw new NotFound('token', token);
    }

    const isVerifiedToken = authService.verfiyJwtToken(token);

    if(!isVerifiedToken || isVerifiedToken === "invalid signature"){
        throw new NotFound('Token', token);
    }

    try {
        const userInfo = await userService.getUserByEmail({ email : isVerifiedToken.email });
        if(!userInfo){
            throw new NotFound('Email', req.email);
        }
        req.user = userInfo;
        next();
    } catch(err) {
        console.log(err);
        throw err;
     } 
}

module.exports = {
    isUserAuthenticated
}