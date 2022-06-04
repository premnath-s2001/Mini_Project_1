const express = require("express");
const { check, } = require("express-validator");

const router = express.Router();
const authController = require("../controllers/auth");

router.get('/a', authController.getLogin);

router.get("/login", authController.getLogin);

router.post('/login', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    check('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
], authController.postLogin);

router.get("/signup", authController.getSignup);

router.post('/signup', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    check('password')
        .isLength({ min: 5 }, { max: 32 })
        .withMessage("Password must be atleast 5 chars long and should not exceed 32 chars")
        .matches(/\d/)
        .withMessage("Password Must Contain A Number")
], authController.postSignup);

router.get("/user-details", authController.getDetails);

router.get("/home", authController.getHome);

router.get('/reset-password-verify', authController.getResetVerify);

router.get('/reset-password', authController.getResetPassword);

module.exports = router;
