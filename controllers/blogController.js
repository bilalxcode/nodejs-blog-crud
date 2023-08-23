const Blog = require("../models/blogModel");

const blogDb = require("../models/blogs");

exports.welcome = (req, res, next) => {
  // Blog.fetchAll((posts) => {
  //   res.render("home", { posts: posts });
  // });

  blogDb.find().then((blogs) => {
    console.log(blogs);
    res.render("home", { posts: blogs });
  });
};

exports.newPost = (req, res, next) => {
  res.render("new-post");
};

exports.addNewBlog = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const blog1 = new Blog(title, content);

  blog1.save();

  const newBlog = new blogDb({
    title: title,
    content: content,
  });

  // Save the new blog entry to the database
  newBlog
    .save()
    .then(() => {
      console.log("New blog added successfully");
      res.redirect("/");
    })
    .catch((error) => {
      console.error("Error adding new blog:", error);
      // Handle the error as needed
      res.redirect("/");
    });

  res.redirect("/");
};

exports.deletePost = (req, res, next) => {
  const postIdToDelete = req.params.id;

  blogDb
    .findByIdAndRemove(postIdToDelete)
    .then(() => {
      console.log("Blog Deleted");
    })
    .then((post) => {
      console.log("product updated");
      res.render("home", { posts: post });
    });
  res.redirect("/");
};

exports.editPost = (req, res, next) => {
  const postId = req.params.id;

  // Assuming you want to find a single post by its ID
  blogDb
    .findById(postId)
    .then((blog) => {
      if (!blog) {
        console.log("Post not found.");
        return res.redirect("/");
      }

      res.render("edit-post", { blog: blog });
    })
    .catch((error) => {
      console.error("Error fetching post:", error);
      res.redirect("/");
    });
};

// exports.updatePost = (req, res, next) => {
//   const postId = req.params.id;
//   const updatedTitle = req.body.title;
//   const updatedContent = req.body.content;

//   blogDb
//     .findById(postId)
//     .then((blog) => {
//       blog.title = updatedTitle;
//       blog.content = updatedContent;
//       return blog.save();
//       res.redirect("/");
//     })
//     // .then((post) => {
//     //   console.log("product updated");
//     //   res.render("home", { posts: post });
//     // })
//     .catch((err) => {
//       console.log(err);
//     });
// };

exports.updatePost = (req, res, next) => {
  const postId = req.params.id;
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;

  blogDb
    .findById(postId)
    .then((blog) => {
      blog.title = updatedTitle;
      blog.content = updatedContent;
      return blog.save();
    })
    .then(() => {
      console.log("Blog updated successfully.");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/"); // Redirect even if there's an error
    });
};
