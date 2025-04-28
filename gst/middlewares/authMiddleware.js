require('dotenv').config();
const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
    console.log("Auth middleware Triggered");

    const token = req.cookies.accessToken;

    if (!token) {
        if(req.accepts('html')){
            return res.status(401).render('error/unauthorized', {
                title: 'Unauthorized',
                message: "Access denied. Please login first."
            });
        }else{
            return res.status(401).json({
                success:false,
                title: 'Unauthorized',
                message: "Access denied. Please login first."
            });
        }
    }

    try {
        const decodedTokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decodedTokenData);

        req.userInfo = decodedTokenData;
        next();

    } catch (error) {
        if(req.accepts('html')){
            return res.status(403).render('error/unauthorized',{
                title:'Unauthorized',
                message:'Invalid or expired token. Please login again..'
            })
        }else{
            return res.status(403).json({
                success:false,
                title: 'Unauthorized',
                message: "Invalid or expired token. Please login again."
            });
        }
    }
}

module.exports = isAuthenticated;
