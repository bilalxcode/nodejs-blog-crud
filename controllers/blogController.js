const Blog = require("../models/blogModel");
const mongoose = require("mongoose");
const blogDb = require("../models/blogs");
const userDb = require("../models/userSchema");
const stripe = require("stripe")(
  "sk_test_51Nk18qCVtk9qc81A5lKBuslEdlf1hquSfQmmFAQBhpJOMhF0b6Ahm87touepu5iOCDuKlKvwxWDEEuxT3ra5ceYv00egr52yl4"
);
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
        req.session.userId = user._id;

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

const ITEMS_PER_PAGE = 1;

exports.allBlogs = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  blogDb
    .find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return blogDb
        .find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((blogs) => {
      res.render("allBLogs", {
        posts: blogs,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    });
};

exports.myBlogs = (req, res, next) => {
  const userId = req.session.userId;

  blogDb.find({ userId: userId }).then((blogs) => {
    res.render("myBlogs", { posts: blogs });
  });
};

exports.foodBlogs = (req, res, next) => {
  const categoryFilter = req.params.category;

  let query = {};
  if (categoryFilter === "food") {
    query = { category: "food" };
  } else if (categoryFilter === "tech") {
    query = { category: "tech" };
  } else if (categoryFilter === "travel") {
    query = { category: "travel" };
  }

  console.log(categoryFilter);
  blogDb.find(query).then((blogs) => {
    res.render("filteredBlogs", { posts: blogs, categoryFilter });
  });
};
exports.pro = (req, res, next) => {
  stripe.checkout.sessions
    .create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1Nk1pvCVtk9qc81ACJW68UgU", // Replace with the actual price ID from your Stripe Dashboard
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: req.protocol + "://" + req.get("host") + "/checkout/success",
      cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
    })
    .then((session) => {
      res.render("pro", { sessionId: session.id });
    });
};
exports.success = (req, res, next) => {
  res.render("success");
};

exports.fail = (req, res, next) => {
  res.render("fail");
};

exports.newPost = (req, res, next) => {
  res.render("new-post");
};

const path = require("path");
const session = require("express-session");

exports.addNewBlog = (req, res, next) => {
  console.log("image");

  const title = req.body.title;
  const content = req.body.content;
  const category = req.body.category;
  const image = req.file;
  const userId = req.session.userId;

  const imageURL = "images/" + path.basename(image.path); // Construct the relative path

  const newBlog = new blogDb({
    title: title,
    content: content,
    category: category,
    image: imageURL,
    userId: userId,
  });

  newBlog
    .save()
    .then(() => {
      console.log("New blog added successfully");
      // res.redirect("/home");
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

exports.updatePost = (req, res, next) => {
  const postId = req.params.id;
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;
  const updatedCategory = req.body.category;
  const updatedImage = req.file;
  console.log(updatedImage);

  if (updatedImage) {
    const imageURL = "images/" + path.basename(updatedImage.path); // Construct the relative path

    blogDb
      .findById(postId)
      .then((blog) => {
        blog.title = updatedTitle;
        blog.content = updatedContent;
        blog.category = updatedCategory;
        blog.image = imageURL;
        return blog.save();
      })
      .then(() => {
        console.log("Blog updated successfully with image also updated.");
        res.redirect("/myBlogs");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/home"); // Redirect even if there's an error
      });
  } else {
    // Handle the case where there's no updated image
    // You might want to adjust the logic here based on your requirements
    blogDb
      .findById(postId)
      .then((blog) => {
        blog.title = updatedTitle;
        blog.content = updatedContent;
        blog.category = updatedCategory;
        return blog.save();
      })
      .then(() => {
        console.log("Blog updated successfully without updating image.");
        res.redirect("/myBlogs");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/home"); // Redirect even if there's an error
      });
  }
};
