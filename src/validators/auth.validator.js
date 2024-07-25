const authService = require('../services/auth.service')
const userService = require('../services/user.service')

const isUserAuthenticated = async (req, res, next) => {
    const token = req.headers['x-access-token'];
 
    if(!token){
        res.status(401).send({
            message: "Jwt token is not provided"
        })
    }

    const isVerifiedToken = authService.verfiyJwtToken(token);

    if(!isVerifiedToken || isVerifiedToken === "invalid signature"){
        return res.status(401).send({
            message: "Jwt token is invalid"
        })
    }

     try{
        const userInfo = await userService.getUserByEmail({email: isVerifiedToken.email});
        if(!userInfo){
            return res.status(401).send({
                message: "Email is invalid"
            })
        }
        req.user = userInfo;
        next();
    }
     catch(err){
        return res.status(401).send({
            message: "Userdata is invalid"
        })
     }
}

module.exports = {
    isUserAuthenticated
}