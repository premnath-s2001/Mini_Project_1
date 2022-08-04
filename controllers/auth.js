const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Customer = require('../models/user');

// Signup
exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "signup",
    errorMessage: null
  });
};

exports.postSignup = async function postSignup (req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;
  const errors = validationResult(req);

  // Errors
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
    });
  }

  // Getting User
  var user = await Customer.findOne({ email: email });

  // User Exists
  if (user) {
    console.log("Email is already in use");
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: "Email is already in use",
    });
  }

  // User does not exist
  if (password != confirmpassword) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: "Passwords do not match",
    });
  }
  
  // Create User
  const hashedPassword = await bcrypt.hash(password, 12);
  const customer = new Customer({
    name: username,
    email: email,
    password: hashedPassword,
    mobile1: mobile,
    cart: { items: [],},
  });
  const saveCustomer = await customer.save();
  if(!saveCustomer) {
    return res.status(500).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: "Something went wrong. Try Again!",
    });
  }
  res.redirect("/login");
};

// Login
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: null
  });
};

exports.postLogin = async function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  // Errors
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
    });
  }

  var user = await Customer.findOne({ email: email });

  // User Not Exists
  if (!user) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: "Email is not found",
    });
  }
  
  var pwdMatch = await bcrypt.compare(password, user.password);
  
  // Passwords Matched
  if (pwdMatch) {
    req.session.user = user;
    req.session.isLoggedIn = true;
    console.log("Password matched");
    res.redirect('/');
  }
  
  // Passwords do not match
  else {
    res.status(422).render("auth/login",{
      path: "/login",
      pageTitle: "Login",
      errorMessage: "Invalid password",
    });
  }
};

exports.postLogout = async function (req, res, next) {
  var msg = req.session.destroy();
  if(!msg)
    console.log(msg);
  res.redirect("/");
}

exports.getResetVerify = (req, res, next) => {
  res.render("auth/reset-verify", {
    path: "/reset-password-verify",
    pageTitle: "Reset Password",
  });
};

exports.getResetPassword = (req, res, next) => {
  res.render("auth/resetpassword", {
    path: "/reset-password",
    pageTitle: "Reset Password",
  });
};

exports.getHome = (req, res, next) => {
  res.render("user/home", {
    path: "/home",
    pageTitle: "Home",
  });
};

exports.getDetails = (req, res, next) => {
  res.render("auth/user-detail", {
    path: "/user-details",
    pageTitle: "Details",
  });
};