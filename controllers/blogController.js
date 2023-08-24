const Blog = require("../models/blogModel");

const blogDb = require("../models/blogs");
const userDb = require("../models/userSchema");

exports.isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/");
  }
  next();
};

exports.firstPage = (req, res, next) => {
  res.render("firstPage");
  // req.session.isLoggedIn = true;
};

exports.login = (req, res, next) => {
  res.render("login", { errorMessage: req.flash("error") });

  // res.render("login");
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  userDb
    .findOne({ email: email, password: password })
    .then((user) => {
      if (!user) {
        console.log("email is " + email);
        console.log("Failed to login");
        req.flash("error", "Invalid Email or Password");
        return res.redirect("/login");
      } else {
        req.session.isLoggedIn = true;
        console.log("Session created");

        return res.redirect("/home");
      }
    })
    .catch((error) => {
      // Handle any errors that occur during the database query
      console.error("Error while checking user:", error);
      return res.status(500).send("Internal Server Error");
    });
};

exports.signup = (req, res, next) => {
  res.render("signup", { errorMessage: req.flash("error") });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const newUser = new userDb({
    email: email,
    password: password,
  });

  userDb
    .findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash("error", "Email already taken");
        return res.render("signup", { errorMessage: req.flash("error") });
      } else {
        newUser
          .save()
          .then(() => {
            console.log("New User added successfully");
            res.redirect("/login");
          })
          .catch((error) => {
            console.error("Error adding new User:", error);
            res.redirect("/signup");
          });
      }
    })
    .catch((error) => {
      console.error("Error checking user:", error);
      res.redirect("/signup");
    });
};

exports.logout = (req, res, next) => {
  console.log("logout working");
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      console.log("Session destroyed");
    }
    res.redirect("/"); // Redirect the user to a different page after logout
  });
  // res.render("home");
};

exports.welcome = (req, res, next) => {
  blogDb.find().then((blogs) => {
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
      res.redirect("/home");
    })
    .catch((error) => {
      console.error("Error adding new blog:", error);
      // Handle the error as needed
      res.redirect("/home");
    });

  res.redirect("/home");
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
  res.redirect("/home");
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
      res.redirect("/home");
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
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/home"); // Redirect even if there's an error
    });
};
