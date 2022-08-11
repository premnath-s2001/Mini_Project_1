const Product = require('../models/product');
const Order = require('../models/order');
const Customer = require('../models/user');

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

exports.getQueryProducts = async function(req, res, next) {
  const searchQuery = req.body.search;
  const productsSameAsName = await Product.find({name: {$regex: searchQuery, $options: 'i'}});
  const productsSameAsCategory = await Product.find({category: {$regex: searchQuery, $options: 'i'}});
  const products = productsSameAsName.concat(productsSameAsCategory);
  res.render("admin/viewproducts", {
    path: "/products",
    pageTitle: "Products",
    products: products.length>0?products:null
  });
};

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

exports.postDeliver = async function(req, res, next) {
  const orderId = req.body.orderId;
  const order = await Order.findById(orderId);
  if(!order) {
    return next(new Error('Order not found'));
  }
  order.status = "delivered";
  await order.save();
  res.redirect('/admin/new-orders');
};

exports.getNewOrders = async function(req, res, next) {
  const orders = await Order.find({status: "pending"});
  var products = [];
  var users = [];
  for(let order of orders) {
    var orderedProducts = [];
    var orderedUsers = await Customer.findById(order.user.userId);
    for(let product of order.products) {
      var item = await Product.findById(product.productId);
      orderedProducts.push(item);
    }
    products.push(orderedProducts);
    users.push(orderedUsers);
  }
  
  res.render("admin/neworders", {
    path: "/admin/orders",
    pageTitle: "Recent Orders",
    orders: orders.length>0?orders:[],
    products: products,
    users: users,
  });
};

exports.getAllOrders = async function(req, res, next) {
  const orders = await Order.find({status: "delivered"});
  var products = [];
  var users = [];
  for(let order of orders) {
    var orderedProducts = [];
    var orderedUsers = await Customer.findById(order.user.userId);
    for(let product of order.products) {
      var item = await Product.findById(product.productId);
      orderedProducts.push(item);
    }
    products.push(orderedProducts);
    users.push(orderedUsers);
  }
  res.render("admin/totalorders", {
    path: "/admin/all-orders",
    pageTitle: "Delivered Orders",
    orders: orders.length>0?orders:[],
    products: products,
    users: users,
  });
};


  exports.getAdminSettings = (req, res, next) => {
    res.render("admin/settings", {
      path: "/login",
      pageTitle: "Settings",
      err:0
    });
  };