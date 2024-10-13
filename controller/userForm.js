const User = require("../model/User");
const Post = require("../model/Post");
const cloudinary = require("cloudinary").v2;

// view  user profail
exports.viewProfail = async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Find the user's posts
  const posts = await Post.find({ author: userId })
    .populate("author", "username")
    .sort({ createdAt: -1 });

  res.status(200).json({
    userProfile: {
      username: user.username,
      email: user.email,
      bio:user.bio,
      profailPicture:user.profailPicture,
      friends: user.friends,

    },
    userPosts: posts,
  });
};

//  Edit profail and upload profail image and bio setting
exports.editProfail = async (req, res) => {
  const userId = req.user.id;
  const { email, username, bio,  } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      username,
      email,
      bio: bio || undefined,   
      profailPicture: req.cloudinaryImageUrl,
    },
    { new: true }
  );
  res.status(201).json({
    message: "profail updated",
    updatedUser,
  });
};
