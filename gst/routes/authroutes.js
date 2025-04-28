const express = require('express');
const router = express.Router();
const {RegisterUserView,LoginUserView,RegisterUserDB,LoginUSerDB,LogoutUser} = require('../controllers/authController')
const isAuthenticated = require('../middlewares/authMiddleware');
const IsAdmin = require('../middlewares/admin_middleware');
//Register Routes
router.get('/user/register',isAuthenticated,IsAdmin,RegisterUserView);
router.post('/user/register',isAuthenticated,IsAdmin,RegisterUserDB);


//Login Routes
router.get('/user/login',LoginUserView);
router.post('/user/login',LoginUSerDB);


//logout Routes

router.get('/user/logout',LogoutUser)
module.exports=router;