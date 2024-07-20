//requiring express.

const express = require("express");

//creating a router for user routes.

const router = express.Router(); 

//requiring User model from models/user.js folder.

const User = require("../models/user.js");

//requiring wrapAsync from utils folder to handle errors.

const wrapAsync =  require("../utils/wrapAsync.js");

//requiring passport to authenticate users.

const passport = require("passport");

//requiring saveREdirectUrl middleware from middleware.js

const { saveRedirectUrl } = require("../middleware.js");

//requiring userController from the users.js in the controllers folder.

const userController =  require("../controllers/users.js");

//router.route for signup--> this combines both the get and post requests of "/signup" route.

router
    .route("/signup")
    //router for GET "/signup" --> renders form to signup the user.
    .get(userController.renderSignupForm)
    //router for POST "/signup" --> handles the signup of the user.
    .post(wrapAsync(userController.signup));

//router.route for login --> this combines both the get and post requests of "/login" route.

router
    .route("/login")
    //router for GET "/login" --> renders form to login the user.
    .get(userController.renderLoginForm)
    //router for POST "/login" --> handles the login of the user.
    //passport.authenticate() -  middleware to check whether the user is registered in the website or not.
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(userController.login));

//logout user -  GET "/logout"

router.get("/logout",userController.logout);

//exporting the users router.
module.exports = router;