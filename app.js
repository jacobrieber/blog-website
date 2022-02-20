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

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

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
