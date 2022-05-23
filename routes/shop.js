const express = require("express");
// const { check, } = require("express-validator");

const router = express.Router();
const shopController = require("../controllers/shop");

router.get('/', shopController.getHome);

router.get('/products', shopController.getProducts);

router.get('/profile', shopController.getProfile);

module.exports = router;
