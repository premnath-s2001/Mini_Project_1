const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: null
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  const data = { email: email }

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
    });
  }

  User.findOne(data)
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Email is not found",
        });
      }
      else {
        bcrypt
          .compare(password, user.password)
          .then((doMatch) => {
            if (doMatch) {
              console.log("matched");
              res.redirect('/home');
            }
            else {
              res.status(422).render("auth/login", {
                path: "/login",
                pageTitle: "Login",
                errorMessage: "Please enter a Correct Password",
              });
            }
          })

      }
    })
    .catch((err) => {
      res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Please enter a Correct Email",
      });
    })

};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "signup",
    errorMessage: null
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
    });
  }
  User.findOne({ email: email })
    .then((result) => {
      if (result) {
        console.log("Email Already In Use");
        return res.status(422).render("auth/signup", {
          path: "/signup",
          pageTitle: "Signup",
          errorMessage: "This Email is already in use",
        });
      }
      else {
        if (password == confirmpassword) {
          bcrypt
            .hash(password, 12)
            .then((hashedPassword) => {
              const data = {
                email: email,
                password: hashedPassword
              };

              User.create(data)
                .then((result) => {
                  console.log(result);
                  res.redirect("/login");
                })
                .catch((err) => {
                  console.log(err);
                });
            });
        }
        else {
          return res.status(422).render("auth/signup", {
            path: "/signup",
            pageTitle: "Signup",
            errorMessage: "The passwords should match",
          });
        }

      }
    }).catch((err) => {
      console.log(err);
    });
};

exports.getDetails = (req, res, next) => {
  res.render("auth/user-detail", {
    path: "/user-detail",
    
  });
};

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
  res.render("app/home", {
    path: "/home",
    pageTitle: "Studencer",
  });
};
