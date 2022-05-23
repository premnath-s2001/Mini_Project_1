exports.getAdminLogin = (req, res, next) => {
    res.render("admin/login", {
      path: "/login",
      pageTitle: "Login",
      err:0
    });
  };
  
exports.getAdminDashboard = (req, res, next) => {
    res.render("admin/dashboard", {
      path: "/login",
      pageTitle: "Login",
      editing:0
    });
  };

  exports.getAddProduct = (req, res, next) => {
    res.render("admin/addproduct", {
      path: "/login",
      pageTitle: "Login",
      editing:0
    });
  };
  exports.getViewProducts = (req, res, next) => {
    res.render("admin/viewproducts", {
      path: "/login",
      pageTitle: "Login",
      editing:0
    });
  };

  exports.getProductDetail = (req, res, next) => {
    res.render("admin/productdetail", {
      path: "/login",
      pageTitle: "Login",
      editing:0
    });
  };

  exports.getEditProduct = (req, res, next) => {
    res.render("admin/editproduct", {
      path: "/login",
      pageTitle: "Login",
      editing:0
    });
  };

  exports.getDeleteProduct = (req, res, next) => {
    res.render("admin/delproduct", {
      path: "/login",
      pageTitle: "Login",
      editing:0
    });
  };

  exports.getNewOrders = (req, res, next) => {
    res.render("admin/neworders", {
      path: "/login",
      pageTitle: "Login",
      editing:0
    });
  };

  exports.getAllOrders = (req, res, next) => {
    res.render("admin/totalorders", {
      path: "/login",
      pageTitle: "Login",
      editing:0
    });
  };

  exports.getAdminSettings = (req, res, next) => {
    res.render("admin/settings", {
      path: "/login",
      pageTitle: "Login",
      err:0
    });
  };