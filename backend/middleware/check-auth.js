const jwt =  require('jsonwebtoken')
module.exports = (req,res,next) => {
    try{
        const token =  req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'write_as_long_as_you_can');
        req.userData = {email: decodedToken.email, userId: decodedToken.userId}
        next();
    }catch(error){
        res.status(401).json({
            message: 'This email id is already in use. Please use different email id.'
        })
    }
}
