const NotFound = require('../errors/notfound.error');
const authService = require('../services/auth.service')

const isUserAuthenticated = async (req, res, next) =>{
    const token = req.headers['x-access-token'];
 
    if(!token){
        res.status(401).send({
            message: "jwt token is not provided"
        })
    }

    const isVerifiedToken = authService.verfiyJwtToken(token);

    if(!isVerifiedToken || isVerifiedToken === "invalid signature"){
        throw new NotFound('Token', token);
    }

     try{
        const userInfo = await userService.getUserByEmail({email:isVerifiedToken.email});
        if(!userInfo){
            throw new NotFound('Email', req.email);
        }
        req.user = userInfo;
        next();
    }
     catch(err){
        throw err;
     } 
}

module.exports = {
    isUserAuthenticated
}