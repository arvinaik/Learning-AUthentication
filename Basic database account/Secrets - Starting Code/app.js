require("dotenv").config(); 
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });
const loginSchema = new mongoose.Schema({ email: String, password: String });

const secret = process.env.SECRET_ENC;
loginSchema.plugin(encrypt,{secret: secret, encryptedFields: ["password"]});

const userAccount = new mongoose.model("user login", loginSchema);

express.static("public");
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  const new_user = new userAccount({
    email: username,
    password: password,
  });
  new_user.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  userAccount.findOne({ email: username }, function (err, accountFound) {
    if (err) {
      console.log(err);
    } else {
      if (accountFound == null) {
        res.render("errorLogin");
      }

      if (accountFound) {
        if (accountFound.password === password) {
          res.render("secrets");
        } else {
          res.render("errorLogin");
        }
      }
    }
  });
});

app.listen(2500, function () {
  console.log("Server Up");
});
