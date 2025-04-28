const Dashboard = async(req,res)=>{
    try {
        res.render('dashboard');
    } catch (error) {
        console.error("Error :",error);
        console.error("Error-message:",error.message);
        console.error("Error-stack:",error.stack);
    }
}

module.exports = {Dashboard};