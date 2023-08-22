const Blog = require("../models/blogModel");

// exports.test = (req, res, next) => {
//   console.log("listening");
// };

exports.welcome = (req, res, next) => {
  Blog.fetchAll((posts) => {
    res.render("home", { posts: posts });
  });
};

exports.newPost = (req, res, next) => {
  res.render("new-post");
};

exports.addNewBlog = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const blog = new Blog(title, content);

  blog.save();

  res.redirect("/");
};

exports.deletePost = (req, res, next) => {
  const postIdToDelete = req.params.id;

  Blog.delete(postIdToDelete, (success) => {
    if (success) {
      res.redirect("/");
    } else {
      console.log("error");
    }
  });
  res.redirect("/");
};

exports.editPost = (req, res, next) => {
  const postId = req.params.id;

  Blog.findById(postId, (post) => {
    if (!post) {
      console.log("Post not found.");
      res.redirect("/");
      return;
    }

    res.render("edit-post", { blog: post });
  });
};

// exports.editPost = (req, res, next) => {
//   const postId = req.params.id;
//   Blog.findById(postId, (post) => {
//     if (!post) {
//       console.log("Post not found.");
//       res.redirect("/");
//       return;
//     }

//     if (req.method === "POST") {
//       const updatedTitle = req.body.title;
//       const updatedContent = req.body.content;
//       console.log("working");

//       post.title = updatedTitle;
//       post.content = updatedContent;

//       Blog.update(postId, post, (success) => {
//         if (success) {
//           console.log("Post updated successfully.");
//         } else {
//           console.log("Failed to update post.");
//         }
//       });

//       // res.redirect("/");
//     } else {
//       res.render("edit-post", { blog: post });
//     }
//   });
// };


exports.updatePost = (req, res, next) => {
  const postId = req.params.id;
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;

  Blog.findById(postId, (post) => {
    if (!post) {
      console.log("Post not found.");
      res.redirect("/");
      return;
    }

    post.title = updatedTitle;
    post.content = updatedContent;

    Blog.update(postId, post, (success) => {
      if (success) {
        console.log("Post updated successfully.");
      } else {
        console.log("Failed to update post.");
      }
    });

    res.redirect("/");
  });
};