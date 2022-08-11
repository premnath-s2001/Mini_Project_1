const express = require("express");

const router = express.Router();
const shopController = require("../controllers/shop");

router.get('/', shopController.getHome);
router.get('/home',shopController.homeRedirect);

router.get('/products', shopController.getProducts);
router.post('/products/search/', shopController.getQueryProducts);
router.get('/product-detail/:productId', shopController.getProductDetails);

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/delete-cart-item', shopController.postDeleteCartItem);

router.get('/orders', shopController.getOrders);

module.exports = router;