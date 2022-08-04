const express = require("express");

const router = express.Router();
const shopController = require("../controllers/shop");

router.get('/', shopController.getHome);

router.get('/products', shopController.getProducts);
router.get('/product-detail/:productId', shopController.getProductDetails);

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);

router.get('/orders', shopController.getOrders);

router.post('/delete-cart-item', shopController.postDeleteCartItem);

module.exports = router;
