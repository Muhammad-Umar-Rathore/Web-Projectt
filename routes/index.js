const express = require("express");
const router = express.Router();
const passport=require("passport")

const User=require("../models/User");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) =>
  res.render("../index", { layout: "./lay/main",flag:"false" })
);


router.get("/true", (req, res) =>
  res.render("../index", { layout: "./lay/main",flag:"true",user:req.user })
);
router.get("/review",ensureAuthenticated, (req, res) =>
  res.render("../index", { layout: "./lay/main",flag:"true",user:req.user })
);
// Dashboard
router.get('/logout',(req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render("register", {
  layout: "lay/out"
}));


// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body,role="customer";
  let errors = [];

  if (!name || !email || !password || !password2||!role) {
      errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
      errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {req.flash("error_msg", errors[0].msg);
  res.redirect("/register");
  } else {
      User.findOne({ email: email }).then(user => {
          if (user) {
              errors.push({ msg: "Email already exists" });              
              req.flash("error_msg", errors[0].msg);
              res.redirect("/register");
          } else {
              const newUser = new User({
                  name,
                  email,
                  password,
                  role
              });
              newUser.save();
              res.redirect("/")
          }
      });
  }});

  router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/true",
        failureRedirect: "/",
        failureFlash: true
    })(req, res, next);
});



router.get('/login', (req, res) =>
    res.render("login", {
        layout: "lay/out"
    }));
module.exports = router;
