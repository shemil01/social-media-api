const mongoose =  require('mongoose')

const friendRequestSchema = new mongoose.Schema({
    requester: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    recipient: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    status: {type: String,enum:['pending','accepted','rejected'],default:'pending'}
})

module.exports = mongoose.model('FriendRequest',friendRequestSchema)