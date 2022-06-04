const Customer = require('../models/user');

exports.getProfile = async function (req, res, next) {
    if(req.session.user) {
        const user = await Customer.findById(req.session.user._id).select('-password');
        if (user) {
            pageTitle = user.name + "|SK Pazhamudhir Nilayam";
            return res.render("user/profile", {
              path: "/profile",
              pageTitle: pageTitle,
              user: user,
            });
        }
    }
    res.render("user/profile", {
        path: "/profile",
        pageTitle: "Guest|SK Pazhamudhir Nilayam",
        user: false,
    });
  };

  exports.postProfile = async function (req, res, next) {
      if (req.session.user) {
          const user = await Customer.findById(req.session.user._id).select('-password');
          if (user) {
              const mobile1 = req.body.mobile1;
              const mobile2 = req.body.mobile2;
              const address = req.body.address;
              const pincode = req.body.pincode;

              user.mobile1 = mobile1;
              user.mobile2 = mobile2;
              user.address = address;
              user.pincode = pincode;
              await user.save();
              
              pageTitle = user.name + "|SK Pazhamudhir Nilayam";
              
              return res.render("user/profile", {
                  path: "/profile",
                  pageTitle: pageTitle,
                  user: user,
              });
            }
      }
      res.redirect("/login");
  }