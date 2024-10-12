const Comment = require("../model/Comment");
const Post = require("../model/Post");
const jwt = require("jsonwebtoken");

// create comment
exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { token } = req.cookies;
 const valid = jwt.verify(token,process.env.JWT_SECRET)
 const userId = valid.id

  // valid input
  if (!content) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  // Find the post
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // create and save the comment
  const newComment = new Comment({
    post:postId,
    author:userId,
    content
  })

  await newComment.save()

  // Add the comment to the post's comments array
  post.comments.push(newComment._id)
  await post.save()

  res.status(201).json({
    message: 'Comment added successfully',
    comment: newComment
  })
};
         