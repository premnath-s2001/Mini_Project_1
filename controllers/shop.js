exports.getHome = (req, res, next) => {
    res.render("user/home", {
      path: "/login",
      pageTitle: "Login",
      err:0
    });
  };
  
  exports.getProducts= (req, res, next) => {
    res.render("user/viewproducts", {
      path: "/login",
      pageTitle: "Login",
      err:0
    });
  };