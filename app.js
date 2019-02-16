//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://admin-deividas:Test123@cluster0-2iicb.mongodb.net/usersDB", {
  useNewUrlParser: true
});

//Set up mongoDB users schema

const usersSchema = {
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  address: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  zipcode: { type: String, required: true }
};

const User = mongoose.model("User", usersSchema);

//*************** INDEX.EJS *********************
app.route("/")

.get(function(req, res) {
    res.render("index");
});


//*************** LIST ALL USERS ****************
app.route("/users")

.post(function(req, res) {

  User.find({
    $and: [
      { firstname: { $regex: req.body.firstname, $options: 'i' }},
      { lastname: { $regex: req.body.lastname, $options: 'i' }},
      { address: { $regex: req.body.address, $options: 'i' }},
      { username: { $regex: req.body.username, $options: 'i' }},
      { password: { $regex: req.body.username, $options: 'i' }},
      { zipcode: { $regex: req.body.zipcode, $options: 'i' }}
    ]},
      function(err, users) {
        if (!err) {
          res.render("partials/list", { users: users });
        } else {
          res.send(err);
        }
      }
    );
})

.patch(function(req, res) {
  User.findOneAndUpdate(
    { _id: req.body.id },
    { $set: req.body }, //$set will catch all values to update
    { new: true },
    function(err, result) {
      if (!err) {
        res.send(result);
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res) {
  User.deleteOne( { _id: req.body.id }, function(err) {
    if(!err) {
      res.send("Successfully Deleted User");
    } else {
      res.send(err);
    }
  });
});

//****************** ADD NEW USER *****************
app.route("/adduser")

.post(function(req, res) {
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    address: req.body.address,
    username: req.body.username,
    password: req.body.password,
    zipcode: req.body.zipcode
  });
  user.save(function(err, newUser){
    if (!err) {
      res.send(newUser);
    } else {
      res.send(err);
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
  console.log("Server started successfully.");
});
