const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/authMiddleware');
const {map_plant_and_user} = require('../controllers/plantMapController');



router.get('/plant/map',isAuthenticated,map_plant_and_user);


module.exports=router;