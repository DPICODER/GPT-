const express = require('express');
const router = express.Router();
const {Dashboard} = require('../controllers/dashboardController');
const isAuthenticated = require('../middlewares/authMiddleware')
router.get('/user/dashboard',isAuthenticated,Dashboard);


module.exports=router;