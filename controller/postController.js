const Post = require("../model/Post");
const User = require("../model/User");
const Comment = require("../model/Comment");


// create post
exports.createPost = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id

  if (!content) {
    return res.status(400).json({ message: "Type a content" });
  }

  // create and save the new post
  const newPost = new Post({
    author: userId,
    content,
  });
  await newPost.save();
  res.status(201).json({
    message: "Post created successfully",
    post: newPost,
  });
};

// get friend post
exports.getFriendPost = async (req, res) => {
  const userId = req.user.id

  // get the user's friends
  const user = await User.findById(userId).populate("friends");
  const friendIds = user.friends.map((friend) => friend._id);

  // Find posts by friends
  const posts = await Post.find({ author: { $in: friendIds } })
    .populate("author", "username")
    .populate("comments")
    .sort({ createdAt: -1 });

  if (!posts || posts.length === 0) {
    res.status(404).json({ message: "Post not found" });
  }

  res.status(200).json(posts);
};

// get non friend post with friend is commented
exports.getNonFriendWithFriendComment = async (req, res) => {
  const userId = req.user.id

  // Get the user's friends
  const user = await User.findById(userId).populate("friends");

  if (!user) {
    throw new Error("User not found");
  }
  const friendIds = user.friends.map((friend) => friend._id);

  
  // Fetch posts authored by non-friends, where friends have commented
  const posts = await Post.find({
    author: { $nin: friendIds }, 
    comments: { $exists: true, $ne: [] }
  })
    .populate("author", "username") 
    .populate({
      path: "comments",
      match: { author: { $in: friendIds } }, 
      populate: {
        path: "author", 
        select: "username"
      }   
    })
    .sort({ createdAt: -1 }); 
 

  // Filter out posts that have no comments from friends
  const filteredPosts = posts.filter(post => post.comments.length > 0);

  
  if (!filteredPosts || filteredPosts.length === 0) {
    return res.status(404).json({ message: "No posts found" });
  }

  res.status(200).json(filteredPosts);
};

//like post