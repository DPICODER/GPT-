const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/authMiddleware')

router.get('/home',isAuthenticated,(req,res)=>{
    const {userId,username,role} = req.userInfo;

    res.json({
        success:true,
        message:"Welcome for auth based testing",
        user:{
            id:userId,
            name:username,
            role:role
        }
    })
})

module.exports = router;