const Post = require("../model/User");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

// create post
exports.createPost = async (req, res) => {
  const { content } = req.body;
  const { token } = req.cookies;
  const valid = jwt.verify(token, process.env.JWT_SECRET);
  const userId = valid.id;

  if (!content) {
    return res.status(400).json({ message: "Type a content" });
  }

  // create and save the new post
  const newPost = new Post({
    author: userId,
    content,
  });
   await newPost.save()
   res.status(201).json({
    message:"Post created successfully",
    post:newPost
   })
};

// get friend post  
exports.getFriendPost = async(req,res)=> {
    const { token } = req.cookies;
    const valid = jwt.verify(token, process.env.JWT_SECRET);
    const userId = valid.id;

    // get the user's friends 
    const user = await User.findById(userId).populate('friends')
    const friendIds = user.friends.map(friend => friend._id)

    // Find posts by friends
    const posts = await Post.find({author:{$in:friendIds}})
    .populate('author','username')
    .populate('comments')
    .sort({ createdAt: -1})

    res.status(200).json(posts)
}

// get non friend post with friend is commented
exports.getNonFriendWithFriendComment = async (req,res) => {
    const { token } = req.cookies;
    const valid = jwt.verify(token, process.env.JWT_SECRET);
    const userId = valid.id;

    // Get the user's friends
    const user = await User.findById(userId).populate('friends')
    const friendIds = user.friends.map(friend => friend._id)

    // Find posts where non-friends posts have a comment from the user's friend
    const post = await Post.find({
        author:{$in:friendIds},
        comments:{
            $elemMatch: {author:{$in:friendIds}}
        }
    })
    .populate('author','username')
    .populate('comments')
    .sort({createdAt: -1})
}
