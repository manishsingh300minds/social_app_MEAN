const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/check-file');
const postController = require('../controllers/posts');

  router.get("/listing",postController.getPosts);

  router.post("/create",checkAuth, extractFile, postController.addPost)

  router.put("/create/:id", checkAuth, extractFile,postController.updatePost)

  router.delete("/listing/:id",checkAuth,postController.deletePost)

module.exports = router;
