const Products = require('../models/product');
const Customer = require('../models/user');
const Order = require('../models/order');

exports.getHome = (req, res, next) => {
    res.render("user/home", {
      path: "/",
    });
};

exports.homeRedirect = (req, res, next) => {
    res.redirect("/");
};
  
exports.getProducts= async function(req, res, next) {
  const products = await Products.find();
  res.render("user/viewproducts", {
    path: "/products",
    pageTitle: "Products",
    products: products.length>0?products:null
  });
};

exports.getQueryProducts = async function(req, res, next) {
  const searchQuery = req.body.search;
  const productsSameAsName = await Products.find({name: {$regex: searchQuery, $options: 'i'}});
  const productsSameAsCategory = await Products.find({category: {$regex: searchQuery, $options: 'i'}});
  const products = productsSameAsName.concat(productsSameAsCategory);
  res.render("user/viewproducts", {
    path: "/products",
    pageTitle: "Products",
    products: products.length>0?products:null
  });
};

exports.getProductDetails = async function(req, res, next) {
  const product = await Products.findById(req.params.productId);
  res.render("user/product-details", {
    path: "/products",
    pageTitle: "Product Details",
    product: product
  });
}

exports.getCart = async function(req, res, next) {
  const user = await req.user.populate('cart.items.productId');
  if(!user) {
    return new Error('No cart found');
  }
  const cart = user.cart;
  const orderedProducts = user.cart.items;
  let totalPrice = Number.parseFloat("0");
  for(var i=0; i< orderedProducts.length; i++) {
    var product = await Products.findById(orderedProducts[i].productId._id);
    totalPrice += orderedProducts[i].quantity * product.price;
  }
  res.render("user/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
    cartItems: cart.items,
    totalPrice: totalPrice,
    user: req.session.user,
  });
}

exports.postCart = async function (req, res,next) {
  const prodId = req.body.productId;
  const pQuantity = Number.parseFloat(req.body.pQuantity);
  const product = await Products.findById(prodId);
  if(!product) {
    return new Error("Product not found");
  }
  
  const cart = await req.user.addToCart(product, pQuantity);
  if(!cart) {
    return new Error("Cart not found");
  }
  res.redirect("/products");
}

exports.postDeleteCartItem = async function(req, res, next) {
  const prodId = req.body.productId;
  const product = await Products.findById(prodId);
  if(!product) {
    return new Error("Product not found");
  }
  const cart = await req.user.removeFromCart(prodId);
  if(!cart) {
    return new Error("Cart not found");
  }
  res.redirect("/cart");
}

exports.getOrders = async function(req, res, next) {
  const orders = await Order.find({'user.userId': req.session.user._id}).sort({"status":-1,"date":-1});
  var products = [];
  for(let order of orders) {
    var orderedProducts = [];
    for(let product of order.products) {
      var item = await Products.findById(product.productId);
      orderedProducts.push(item);
    }
    products.push(orderedProducts);
  }
  res.render("user/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
    orders: orders.length>0?orders:[],
    products: products,
  });
}

exports.getCreateOrder = async function(req, res, next) {
  const user = await Customer.findById(req.session.user._id).select('-password');
  const orderedProducts = user.cart.items;
  const orderedUser = {email: user.email, userId: user._id};
  
  let totalPrice = Number.parseFloat("0");
  for(var i=0; i<orderedProducts.length; i++) {
    var product = await Products.findById(orderedProducts[i].productId._id);
    totalPrice += orderedProducts[i].quantity * product.price;
  }
  
  const order = new Order({
    user: orderedUser,
    products: orderedProducts,
    totalPrice: totalPrice,
  });
  
  const orderMsg = await order.save();
  if(!orderMsg) {
    return new Error("Order not saved");
  }
  
  user.cart.items = [];
  await user.save();
  res.redirect("/orders");
};