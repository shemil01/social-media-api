const mongoose = require('mongoose')

const connectDb = async function(){
    try{
        await mongoose.connect(process.env.mongoDB_atlas)
        .then(()=>{
            console.log("data base connected")
        })
    }catch(error){
        console.log(error)
        process.exit(1)
    }
}
module.exports = connectDb