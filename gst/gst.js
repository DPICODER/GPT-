require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3001;
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//Middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use('/bootstrap/css',express.static(path.join(__dirname,'node_modules','bootstrap','dist','css')))
app.use('/bootstrap/js',express.static(path.join(__dirname,'node_modules','bootstrap','dist','js')))
app.use('/jquery',express.static(path.join(__dirname,'node_modules','jquery','dist')))
app.use('/popper',express.static(path.join(__dirname,'node_modules','popper.js','dist')))
app.use('/datatables', express.static(path.join(__dirname, 'node_modules', 'datatables', 'media')));



// Define Routes under here start with /gst
app.use('/gst',require('./routes/authroutes'));
app.use('/gst',require('./routes/dashboardRoutes'));
app.use('/gst',require('./routes/home-routes'));
app.use('/gst',require('./routes/plantMapRoutes'));
app.use('/api',require('./routes/plantRoutes'));

app.get('/',(req,res)=>{
    console.log("in Initail Root");
    res.redirect('/gst/user/login');
})

app.listen(port,()=>{
    console.log(`Server is live and running @ http://127.0.0.1:${port}`);
})