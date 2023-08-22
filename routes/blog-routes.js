const express = require("express");

const router = express.Router();

const blogController = require("../controllers/blogController");

router.get("/", blogController.welcome);

router.get("/new-post", blogController.newPost);
router.post("/new-post", blogController.addNewBlog);
router.get("/delete-post/:id", blogController.deletePost);
router.get("/edit-post/:id", blogController.editPost);
router.post("/edit-post/:id", blogController.updatePost);

module.exports = router;
