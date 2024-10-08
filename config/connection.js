const mongoose=require("mongoose");

const connectionDB=()=>{
   mongoose.connect(process.env.DB_URI,{
    serverSelectionTimeoutMS: 5000
   }).then(()=>{
        console.log("database connected successfully ")
    }).catch((err)=>{
        console.log("error in db connection", err)
    })
}

module.exports=connectionDB;