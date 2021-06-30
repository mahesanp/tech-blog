const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require("fs");
const lo = require("lodash");
const nodemailer = require("nodemailer");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    let posts = readData();
    let day = getDate();

    res.render("index", {content: posts.slice(0,4), date: day});
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/contact", function(req, res){
    res.render("contact", {msg:''});
});

app.get("/post", function(req, res){
    res.render("post");
});

app.get("/posts/:postTitle", function(req, res){
    let request = req.params.postTitle
    let data = readData();
    for(let i=0; i<data.length; i++){
        let stored = data[i].title;

        if(request == stored){
            res.render("posttemplate", {post: data[i]});
        }

    }
})


app.get("/update", function(req, res){
    res.render("update");
});

app.get("/older-posts", function(req, res){
    res.render("oldposts", {content: readData()})
})

app.post("/update", function(req, res){
    let posts = readData();

    let post = {
        title: req.body.titleContent,
        post: req.body.postContent,
        detail: req.body.detailedContent,
        detail2: req.body.detailedContent2,
        date: getDate(),
    }
    posts.unshift(post);
    writeData(posts)
    res.redirect("/");
});

app.post("/contact", function(req, res){
    const output = `<p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.Name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

    let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'mahesanp789@gmail.com', // generated ethereal user
        pass: 'mahesan   king'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

// setup email data with unicode symbols
    let mailOptions = {
      from: '"Nodemailer Contact" <mahesanp789@gmail.com>', // sender address
      to: 'mahesan.cs20@bitsathy.ac.in', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', {msg:'Email has been sent'});
    });
})

function readData(){
    let JsonData = fs.readFileSync("data.json");
    return JSON.parse(JsonData);
}

function writeData(post){
    let JsonData = JSON.stringify(post, null, 2);
    fs.writeFileSync("data.json", JsonData);
}

function getDate(post){
    let to = new Date();
    let day = [to.toLocaleDateString('en-IN', {month:'long'}), to.toLocaleDateString('en-IN', {day:'2-digit'}), to.toLocaleDateString('en-IN', {year:'numeric'})];
    clean_day = day[0] + ' ' + day[1] + ', ' + day[2];
    return clean_day;
}

app.listen(3000, '0.0.0.0', function(){
    console.log("server listening on port 3000");
})
