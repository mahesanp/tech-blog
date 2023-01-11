require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require("fs");
const lo = require("lodash");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true});

const postSchema = new mongoose.Schema({
  title: String,
  post: String,
  detail: String,
  detail2: String,
  date: String
});

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){
    console.log("The request IP is " + req.ip);
    // console.log(getApi());
    Post.find(function(err, result) {
      if(err) console.log(err);
      else {
        let day = getDate();
        // console.log(post);
        result.reverse();
        res.render("index", {content: result, date: day});
      }
    })
    // let posts = readData();

});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/contact", function(req, res){
    res.render("contact", {msg:''});
});

app.get("/post", function(req, res){
  Post.find(function(err, result) {
    if(err) console.log(err);
    else {
      console.log(result[0].title);
      res.redirect("/posts/" + result[0].title);
    }
  })

});

app.get("/posts/:postTitle", function(req, res){
  Post.find(function(err, data) {
    if(err) console.log(err);
    else {
      let request = req.params.postTitle
      for(let i=0; i<data.length; i++){
          let stored = data[i].title;
          console.log(stored);
          if(request == stored){
              res.render("posttemplate", {post: data[i]});
          }
      }
    }
  })

});


app.get("/update", function(req, res){
    res.render("login");
});

app.post("/login", function(req,res){
    console.log(req.body.password);
    if(req.body.password == "qwerty"){
        res.render("update");
    } else{
        res.render("wrongpassword");
    }
});

app.get("/older-posts", function(req, res){
  Post.find(function(err, result) {
    if(err) console.log(err);
    else {
      res.render("oldposts", {content: result});

    }
  })
})

app.post("/update", function(req, res){
  Post.find(function(err, posts) {
    if(err) console.log(err);
    else {
      let post = new Post({
          title: req.body.titleContent,
          post: req.body.postContent,
          detail: req.body.detailedContent,
          detail2: req.body.detailedContent2,
          detail3: req.body.detailedContent3,
          date: getDate(),
      });
      post.save();
      res.redirect("/");
    }
  })


});

app.post("/contact", function(req, res){
    const output = `<h2>You have a new contact request</h2>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.Name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

    var api_key = getApi();
    var domain = 'sandboxf2473e62392e47bdae2c6fd2fd5e8840.mailgun.org';
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

    var data = {
      from: 'mahesanp789@gmail.com',
      to: 'mahesan.cs20@bitsathy.ac.in',
      subject: 'New Contact Details',
      html: output,
    };

    mailgun.messages().send(data, function (error, body) {
        if (error){
            console.log(error);
        }
      console.log(body);
      res.render("contact", {msg: "Email has been sent"});
    });
});

app.get("/delete", function(req, res) {
  Post.find(function(err, result) {
    if(err) console.log(err);
    else {
      let day = getDate();

      result.reverse();
      res.render("deletePosts", {content: result, date: day});
    }
  })
});

app.post("/delete", function(req, res) {
  console.log(req.body.id);
  Post.deleteOne({title:req.body.id}, function(err) {
    if(err) console.log(err);
    else console.log("Successfully Deleted");
  });
  res.redirect("/");

})


function getDate(post){
    let to = new Date();
    let day = [to.toLocaleDateString('en-IN', {month:'long'}), to.toLocaleDateString('en-IN', {day:'2-digit'}), to.toLocaleDateString('en-IN', {year:'numeric'})];
    clean_day = day[0] + ' ' + day[1] + ', ' + day[2];
    return clean_day;
}

function getApi(){
  let api = fs.readFileSync("../api.txt");
  return api.toString().slice(0, -1);
}
app.listen(process.env.PORT || 8000, '0.0.0.0', function(){
    console.log("server listening on port 8000");
})
