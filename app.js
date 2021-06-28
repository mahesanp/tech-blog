const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require("fs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
    res.render("index", {});
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/contact", function(req, res){
    res.render("contact");
});

app.get("/post", function(req, res){
    res.render("post");
});

app.get("/update", function(req, res){
    res.render("update");
});

app.post("/update", function(req, res){
    let posts = readData();

    let post = {
        title: req.body.titleContent,
        post: req.body.postContent,
        detail: req.body.detailedContent,
    }
    posts.push(post);
    writeData(posts)
    res.redirect("/");
});

function readData(){
    let JsonData = fs.readFileSync("data.json");
    return JSON.parse(JsonData);
}

function writeData(post){
    let JsonData = JSON.stringify(post, null, 2);
    fs.writeFileSync("data.json", JsonData);
}

app.listen(3000, function(){
    console.log("server listening on port 3000");
})
