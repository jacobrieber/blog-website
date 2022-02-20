//Setting up dependencies & platform
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Synching to external mongoose database
mongoose.connect("mongodb+srv://admin-jacob:Yanch6171997@cluster0.ecjji.mongodb.net/blogPostDB");


//setting up schema & initial posts
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

let postLog = [];

const homeStartingContent = "Welcome to my personal journal website! Feel free to look around, read my deep secret thoughts, silently judge, or whatever you'd like!";
const aboutContent = "I'm so sorry - I'll write this out eventually, but I'm procrastinating on this";
const contactContent = "I'm so sorry - I'll write this out eventually, but I'm procrastinating on this";

//Setting up page routing
app.get("/", function(req, res) {

  Post.find({}, function(err, foundPosts) {

    if (!err) {
      res.render("home", {
        homePageContent: homeStartingContent,
        postLog: foundPosts,
      });
    } else {
      console.log("There was an error loading post list")
    };
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactPageContent: contactContent
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutPageContent: aboutContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.get("/posts/:postID", function(req, res) {
  const postID = req.params.postID

  Post.findOne({
    _id: postID
  }, function(err, foundPost) {
    if (!err) {
      if (!foundPost) {
        res.redirect("/");
      } else {
        res.render("post", {
          id: foundPost._id,
          title: foundPost.title,
          content: foundPost.content
        });
      }
    }
  });

});

app.post("/delete", function(req, res){
  const postID = req.body.checkBox;

  Post.deleteOne({_id: postID}, function (err){
    if (!err) {
      console.log("Post is removed");
    }
  });

  res.redirect("/");
});

app.post("/compose", function(req, res) {
  //Create new post
  const post = new Post({
    title: _.capitalize(req.body.postTitle),
    content: req.body.postBody
  });

  //Store & add to the array
  post.save();
  postLog.push(post);

  res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3500;
}

app.listen(port, function() {
  console.log("Server has started");
});
