const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user"
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
});

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
   const user=this
    if (!this.isModified("password")) return next();
    const hashedPassword=await bcrypt.hash(user.password, 10);
    user.password=hashedPassword;
    next();
  
   
  });

  userSchema.methods.comparePassword=function (givenPassword){
    return bcrypt.compare(givenPassword, this.password);
  }



const User=mongoose.model("User", userSchema);
module.exports=User;
