const jwt = require('jsonwebtoken')
const {tryCatch} = require('../utils/tryCatch')
const userSchema = require('../model/User')

const userAuth = tryCatch(async(req,res,next)=> {
    const {token} = req.cookies;
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Unauthorized token is missing"
        })
    }
    const decoded = jwt.verify(token ,process.env.JWT_SECRET) 
    const user = await userSchema.findById(decoded.id)

 if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  req.user = user;
  next();
})

module.exports = userAuth