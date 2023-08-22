const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "posts.json"
);

module.exports = class Blog {
  constructor(t, c) {
    this.title = t;
    this.content = c;
  }

  save() {
    fs.readFile(p, (err, fileContent) => {
      let posts = [];

      if (!err) {
        posts = JSON.parse(fileContent);
      }

      this.id = Math.random().toString();
      posts.push(this);

      fs.writeFile(p, JSON.stringify(posts), (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
  }

  static fetchAll(callback) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        callback([]);
      } else {
        const posts = JSON.parse(fileContent);
        callback(posts);
      }
    });
  }

  static findById(id, callback) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        callback(null);
      } else {
        const posts = JSON.parse(fileContent);
        const post = posts.find((post) => post.id === id);
        callback(post);
      }
    });
  }

  static update(id, updatedPost, callback) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        callback(false);
      } else {
        const posts = JSON.parse(fileContent);
        const postIndex = posts.findIndex((post) => post.id === id);

        if (postIndex !== -1) {
          posts[postIndex] = updatedPost;
          fs.writeFile(p, JSON.stringify(posts), (err) => {
            if (err) {
              callback(false);
            } else {
              callback(true);
            }
          });
        } else {
          callback(false);
        }
      }
    });
  }

  static delete(id, callback) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        callback(false);
      } else {
        const posts = JSON.parse(fileContent);
        const updatedPosts = posts.filter((post) => post.id !== id);

        fs.writeFile(p, JSON.stringify(updatedPosts), (err) => {
          if (err) {
            callback(false);
          } else {
            callback(true);
          }
        });
      }
    });
  }
};
