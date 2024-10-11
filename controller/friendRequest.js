const { request } = require("express");
const FriendRequest = require("../model/FriendRequest");
const User = require("../model/User");
const jwt = require('jsonwebtoken')

//send friend request

const sendRequest = async(req, res) => {
  const { recipientId } = req.body;
  const { token } = req.cookies
  const valid = await jwt.verify(token, process.env.JWT_SECRET);
  const userId = valid.id;
 
  // check if the recipient exist

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return res.status(404).json({
      success: false,
      message: "Recipient not found",
    });
  }

  // check if they already friends

  const isAlreadyFriend = await User.findOne({
    _id: userId,
    friends: recipientId,
  });
  if (isAlreadyFriend) {
    return res.status(400).json({
      message: "Already Friends",
    });
  }

  // check if there is alredy a pending friend request

  const existingRequest = await FriendRequest.findOne({
    requester: userId,
    recipient: recipientId,
    status: "pending",
  });
  if (existingRequest) {
    return res.status(400).json({
      message: "Friend request already sent",
    });
  }

  // create and save new friend request

  const friendRequest = new FriendRequest({
    requester: userId,
    recipient: recipientId,
  });
  await friendRequest.save();
  res.status(201).json({ message: "Friend request sent successfully" });
};

// get received friend request
const getReceivedRequest = async(req, res) => {
  const { token } = req.cookies
  const valid = await jwt.verify(token, process.env.JWT_SECRET);
  const userId = valid.id;
  const requests = await FriendRequest.find({
    recipient: userId,
    status: "pending",
  })
  .populate("requester", "username email");
  if(requests.length === 0){
    return res.status(404).send('no request found')
  }
  console.log(requests)
  res.status(200).json(requests)
};

// accept friend request
const acceptRequest = async(req, res) => {
  const { requestId } = req.params;

  const request = await FriendRequest.findById(requestId);

  if (!request || request.status !== "pending") {
    return res.status(404).json({ message: "Friend request not found" });
  }

  // add the users both firend
  await User.findByIdAndUpdate(req.userId, {
    $push: { friends: request.requester },
  });
  await User.findByIdAndUpdate(request.requester, {
    $push: { friends: req.userId },
  });

  // update status
  request.status = "accepted";
  await request.save();
  res.status(201).json({
    message: "Friend request accepted",
  });
};

// Rject friend request

const rejectRequest = async(req, res) => {
  const { requestId } = req.params;

  const request = await FriendRequest.findById(requestId);
  if (!request || request.status !== "pending") {
    return res.status(404).json({
      message: "no request found",
    });
  }

  // update the status of friend request to rejected
  request.status = "rejected";
  await request.save();

  res.status(200).json({ message: "Friend request rejected" });
};



module.exports = {
  sendRequest,
  getReceivedRequest,
  acceptRequest,
  rejectRequest,
};