const isAdminUser = (req,res,next)=>{
    console.log("User data :",req.userInfo);
    
    if(req.userInfo.role !== 'admin'){
        if(req.accepts('html')){

            return res.status(403).render('error/unauthorized',{
                title:'Access Denied Admin ONLY',
                message:'You dont have permission to view this page.'
            })
        }else{

            return res.status(403).json({
                success:false,
                message:"Access Denied !! Admin only"
            })
        }
    }

    next()
}

module.exports = isAdminUser;