const { Constants } = require("../models/Constants");
const { plantUser } = require("../models/plant_user_map");
const date = new Date();
console.log("Date :",date);

const map_plant_and_user = async(req,res)=>{
    console.log("in map get");
    const {plant_id} = req.query;
    try {
        // const tempUser = {
        //     plant_id:1001,
        //     plant_name:'google',
        //     user_id:3,
        //     user_name:'sai',
        //     assigned_on: date.split('T')[0],
        // }


        const plantData = await Constants.findAll({attributes:['c_value_1','c_value_2']});
        if(!plantData){
            return res.status(400).json({
                success:false,
                message:"Error : No Plant data found "
            })
        }   
        var plant_user_data;
        if(plant_id){
            console.log("Plant ID :",plant_id);
            const stripped_plant_id = plant_id.split(" ")[0];
            plant_user_data = await plantUser.findAll({
                where:{
                    plant_id:stripped_plant_id
                }
            })
        }    
        var currentValue = plant_id;
        res.render('plant_map',{plantData,plant_user_data:plant_user_data||null,currentValue});
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message||"Internal Server Error Please try again later"
        })
    }
}

module.exports = {map_plant_and_user};