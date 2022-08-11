const Products = require('../models/product');

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
  var totalPrice = 0;
  for(var i=0; i<cart.items.length; i++) {
    totalPrice += cart.items[i].quantity * cart.items[i].productId.price;
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
  res.render("user/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
    orders: []
  });
}
