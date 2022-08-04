const Product = require('../models/product');

exports.getAdminLogin = (req, res, next) => {
  res.render("admin/login", {
    path: "/login",
    pageTitle: "Login",
    err:0
  });
};
  
exports.getAdminDashboard = (req, res, next) => {
  res.render("admin/dashboard", {
    path: "/admin/dashboard",
    pageTitle: "Admin Dashboard",
    editing:0
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/addproduct", {
    path: "/login",
    pageTitle: "Add Product",
    addNew: true,
  });
};

exports.postAddProduct = async function (req, res, next) {
  const purl = req.body.purl;
  const pname = req.body.pname;
  const pprice = Number.parseFloat(req.body.pprice);
  const pquantity = Number.parseFloat(req.body.pquantity);
  const pcategory = req.body.pcategory;
  const pdescription = req.body.pdescription;
  const product = new Product({
    url: purl,
    name: pname,
    price: pprice,
    category: pcategory,
    quantity: pquantity,
    description: pdescription,
  });
  await product.save();
  res.redirect('/admin/products');
}

exports.getViewProducts = async function(req, res, next) {
  const products = await Product.find();
  res.render("admin/viewproducts", {
    path: "/admin/products",
    pageTitle: "Products",
    products: products.length>0?products:null,
  });
};

exports.getProductDetail = async function(req, res, next) {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  res.render("admin/productdetail", {
    path: "/login",
    pageTitle: "Product Detail",
    product: product,
  });
};

exports.getEditProduct = async function(req, res, next) {
    const products = await Product.find();
    res.render("admin/editproduct", {
      path: "/login",
      pageTitle: "Edit Product",
      products: products.length===0?null:products,
    });
 };

exports.editProduct = async function(req, res, next) {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(!product) {
      return next(new Error("Product not found"));
    }
    return res.render("admin/addproduct", {
      path: "/login",
      pageTitle: "Edit Product",
      addNew: false,
      product: product,
    });
};

exports.postEditProduct = async function(req, res, next) {
  const purl = req.body.purl;
  const pname = req.body.pname;
  const pprice = Number.parseFloat(req.body.pprice);
  const pquantity = Number.parseFloat(req.body.pquantity);
  const pcategory = req.body.pcategory;
  const pdescription = req.body.pdescription;
  const pid = req.body.pid;
  const product = await Product.findById(pid);
  if(!product) {
    return next(new Error("Product not found"));
  }
  product.url = purl;
  product.name = pname;
  product.price = pprice;
  product.quantity = pquantity;
  product.category = pcategory;
  product.description = pdescription;
  
  await product.save();
  res.redirect('/admin/products');
}

exports.getDeleteProduct = async function(req, res, next) {
    const products = await Product.find();
    res.render("admin/delproduct", {
      path: "/login",
      pageTitle: "Delete Products",
      products: products,
    });
};

exports.postdeleteProduct = async function(req, res, next) {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(!product) {
      return next(new Error('Product not found'));
    }
    const delmsg = await Product.deleteOne({_id: productId});
    if(delmsg.deletedCount === 0) {
      return next(new Error('Product not deleted'));
    }
    res.redirect('/admin/delete-product');
}

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