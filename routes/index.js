const express = require("express");
const router = express.Router();
const passport=require("passport")
const bcryptt = require("bcryptjs");
const User=require("../models/User");
const V=require("../models/vehicles");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const bcrypt = require("bcryptjs/dist/bcrypt");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) =>
  res.render("../index", { layout: "./lay/main",flag:"false" })
);
// Welcome Page
router.get("/chatbot", (req, res) =>
  res.render("../views/chatbot",{ layout: "./lay/main",flag:"true" })
);

router.get("/true", (req, res) =>
  res.render("../index", { layout: "./lay/main",flag:"true",user:req.user })
);
// Dashboard
router.get('/logout',(req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

// Register Page
router.get('/register', (req, res) => 
        {res.render("register", {
          layout: "lay/out"
        })
});

var s;
router.get('/review/:email', (req, res) =>
            {
              s=req.params.email;
              console.log(s);
              res.render("../views/addreview", {
              layout: "lay/out"
            })
        });
router.post('/review', (req, res) =>  {
          // console.log(req.body.review)
          console.log("ss"+s);
          User.find({email:s}).then((u)=>{
                t={rev:req.body.review};
                console.log(u[0].email)
                User.updateOne({email:u[0].email},{$set:t}).then(()=>{
                  req.flash("success_msg","done");
                    res.redirect("/review")
                })
          })
    });
    router.get('/allreview', (req, res) =>  {
      // console.log(req.body.review)
        User.find().then((u)=>{
                res.render("../allreview",{
                   u,
                   layout:"./lay/out"
                })
      })
});

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body,role="customer",carAssigned=0,rev=" ";
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
                  role,
                  carAssigned,
                  rev
              });
              newUser.save();
              res.redirect("/")
          }
      });
  }});


  router.get('/vehicles/add', (req, res) => {
    res.render("../views/vehicles/vehiclesAdd" , {
      layout: "lay/main"
    })
  });

  router.post('/login', async(req, res, next) => {
    const pass = req.body.password;
    const umail = req.body.email;

    const checkMail = await User.findOne({email: umail});

    if( bcryptt.compare(pass , checkMail.password) && (checkMail.role == "customer")){
      passport.authenticate("local", {
        successRedirect: "/true",
        failureRedirect: "/",
        failureFlash: true
    })(req, res, next);
    }else if(bcryptt.compare(pass , checkMail.password) && (checkMail.role == "admin")){
      res.render("../views/vehicles/vehiclesAdd" , {
        layout: "lay/main"
      })
    }else{
      res.status(401).send("Incorrect password and email ")
    }


   
});
router.get('/review',ensureAuthenticated, (req, res) =>{
  console.log("sss");
    res.render("../views/addreview", {
        layout: "lay/out"
    })
  });
  router.post('/confirm', (req, res) => {

    V1=JSON.parse(req.body.Vs);
    q=V1.quantity;
    if(q==0)
    {
      req.flash("error_msg","V E H I C L E  N O T  A V A I L A B L E ");

    s="/vehicles/view/"+req.body.email
    res.redirect(s);
    return;
    }
    q--;
    s={quantity:q}
    V.updateOne({id:V1.id},{$set:s},function(err){
      if(err)
      {
        console.log(err);
      }
    })
    User.findOne({email:req.body.email}).then((user)=>{

      q=user.carAssigned;
      q++;
      s={carAssigned:q}
      User.updateOne({email:user.email},{$set:s},function(err){
        if(err)
        {
          console.log(err);
        }
      })

    })
    req.flash("success_msg","Checked out");
    s="/vehicles/view/"+req.body.email
    res.redirect(s);
});
module.exports = router;
