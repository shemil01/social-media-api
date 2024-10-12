const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    author:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    content:{type:String,required:true},
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post',postSchema)