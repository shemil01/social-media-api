const express = require("express");
const postController = require("../controller/postController");
const commentController = require("../controller/commentController");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const { tryCatch } = require("../utils/tryCatch");
const {uploadImage} = require('../middleware/upload')

// post creation
router.post("/add-post", userAuth,uploadImage, tryCatch(postController.createPost));

// add comment to post
router.post(
  "/add-comment/:postId",
  userAuth,
  tryCatch(commentController.addComment)
);

// friends  feed
router.get("/friends/feed", userAuth, tryCatch(postController.getFriendPost));

//non-friend feed your friend commented
router.get(
  "/friends/commented-feed",
  userAuth,
  tryCatch(postController.getNonFriendWithFriendComment)
);
// like a post
router.put("/posts/like/:postId", userAuth, tryCatch(postController.addLike));
router.put(
  "/posts/unlike/:postId",
  userAuth,
  tryCatch(postController.removeLike)
);
router.get("/posts/liked", userAuth, tryCatch(postController.getLikedPost));

module.exports = router;
