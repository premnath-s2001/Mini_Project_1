const express = require('express');

const router = express.Router();
const userController = require("../controllers/user");

router.get('/profile', userController.getProfile);
router.post('/profile', userController.postProfile);

module.exports = router;