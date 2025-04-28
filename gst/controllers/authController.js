require('dotenv').config();
const { data } = require('jquery');
const USER = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function HashPassword(pwd) {
    try {
        const HashedPassword = await bcrypt.hash(pwd, 10);
        return HashedPassword;
    } catch (error) {
        console.error("Error Hashing Password :", error);
    }
}

const RegisterUserView = async (req, res) => {
    try {
        console.log("In Register [GET]");
        res.render('register');
    } catch (error) {
        console.error("Error :", error);
        console.error("Error-Message :", error.message);
        console.error("Error-stack :", error.stack);
        res.status(500).json({
            success: false,
            message: 'Something went wrong please try again later.'
        });
    }
}

const RegisterUserDB = async (req, res) => {
    try {
        const { username, password, email ,user_role } = req.body
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                message: 'Enter all fields Mandatory.'
            });
        }
        const checkExistingUser = await USER.findOne({ where: { username } });
        const checkExistingUserEmail = await USER.findOne({ where: { email } });

        if (checkExistingUser || checkExistingUserEmail) {
            return res.status(400).json({
                success: false,
                message: "User with this username or Email Already exist",
                data: username,
            });
            
        }

        const hashpwd = await HashPassword(password);

        const createNewUser = await USER.create(
            {
                username,
                email,
                role:user_role || "user",
                password: hashpwd
            }
        )
        if (createNewUser) {
            return res.status(201).json({
                success: true,
                message: `User ${username} has Registered Successfully`,
                data: createNewUser
            });
        }

    } catch (error) {
        console.error("Error :", error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong please try again later.'
        })
    }
}

const LoginUserView = async(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.error("Error :",error);
        console.error("Error-Message :",error.message);
        console.error("Error-Stack :",error.stack);
    }
}

const LoginUSerDB = async(req,res)=>{
    const user_data = req.body;
    console.log("Recived User data : ",user_data);
    try {

        const userData = await USER.findOne({
            where:{username : user_data.username}
        }
        );

        if(!userData){
            return res.status(400).json({
                success:false,
                message:`User Not Found`,
            })
        }

        const compareUserPassword = await bcrypt.compare(user_data.password,userData.password);
        console.log("User Password",compareUserPassword);

        if(!compareUserPassword){
            return res.status(400).json({
                success:false,
                message:`Invalid User Credentials Please Check`
            })
        }

        // user access token
        const accesstoken = jwt.sign({
            userId : userData.id,
            username : userData.username,
            role: userData.role,
        },process.env.JWT_SECRET_KEY,{
            expiresIn:'15m',
        });


        res.cookie('accessToken',accesstoken ,{
            httpOnly:true,
            secure:true,
            sameSite:'Strict',
            maxAge:15*60*1000
        });

        res.status(200).json({
            success:true,
            message:`Login Success welcome ${user_data.username}`,
            redirect: `/gst/user/dashboard`
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message || "Internal Server Error !!!",
        })
    }
}


const LogoutUser = async(req,res)=>{
    res.clearCookie('accessToken');
    res.redirect('/gst/user/login');
}

module.exports = { RegisterUserView, RegisterUserDB ,LoginUserView,LoginUSerDB , LogoutUser}