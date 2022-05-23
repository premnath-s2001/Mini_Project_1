const express = require("express");
// const { check, } = require("express-validator");

const router = express.Router();
const authController = require("../controllers/admin");

router.get('/login', authController.getAdminLogin);

router.get('/add-product', authController.getAddProduct);

router.get('/dashboard', authController.getAdminDashboard);

router.get('/products', authController.getViewProducts);

router.get('/product-detail', authController.getProductDetail);

router.get('/edit-product', authController.getEditProduct);

router.get('/delete-product', authController.getDeleteProduct);

router.get('/new-orders', authController.getNewOrders);

router.get('/all-orders', authController.getAllOrders);

router.get('/settings', authController.getAdminSettings)

module.exports = router;
