const FriendRequest = require("../model/FriendRequest");
const User = require("../model/User");

//send friend request

const sendRequest = async (req, res) => {
  const { recipientId } = req.body;

  const userId = req.user.id;
  console.log(userId) 

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
const getReceivedRequest = async (req, res) => {
  const userId = req.user.id;
  const requests = await FriendRequest.find({
    recipient: userId,
    status: "pending",
  }).populate("requester", "username email");
  if (requests.length === 0) {
    return res.status(404).send("no request found");
  }
  console.log(requests);
  res.status(200).json(requests);
};

// accept friend request
const acceptRequest = async (req, res) => {
  const { requestId } = req.params;

  const userId = req.user.id;

  const request = await FriendRequest.findById(requestId);

  if (!request || request.status !== "pending") {
    return res.status(404).json({ message: "Friend request not found" });
  }

  // Check if the current user is the recipient of the friend request
  if (request.recipient.toString() !== userId) {
    return res.status(403).json({
      message: "You are not authorized to accept this friend request",
    });
  }

  // add the users both firend
  await User.findByIdAndUpdate(userId, {
    $push: { friends: request.requester },
  });
  await User.findByIdAndUpdate(request.requester, {
    $push: { friends: userId },
  });

  // update status
  request.status = "accepted";
  await request.save();
  res.status(201).json({
    message: "Friend request accepted",
  });
};

// Rject friend request

const rejectRequest = async (req, res) => {
 
  const userId = req.user.id;
  const { requestId } = req.params;

  const request = await FriendRequest.findById(requestId);
  if (!request || request.status !== "pending") {
    return res.status(404).json({
      message: "no request found",
    });
  }

  // Check if the current user is the recipient of the friend request
  if (request.recipient.toString() !== userId) {
    return res.status(403).json({
      message: "You are not authorized to reject this friend request",
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
