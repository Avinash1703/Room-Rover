//requiring express.

const express = require("express");

//creating a router for listings routes.

const router = express.Router({mergeParams : true}); //mergeParams is used to access the listing id from app.js, so that the reviews of that particular listing can be manipulated.

//mergeParams - Preserves the req.params values from the parent router. If theparent and the child have conflicting param names, the child's value take precedence.

//requiring wrapAsync function from utils folder to handle the errors on the server side.

const wrapAsync = require("../utils/wrapAsync.js");

//requiring Listing model from lsting.js in the models folder.

const Listing = require("../models/listing.js");

//requiring Review model from review.js in the models folder.

const Review = require("../models/review.js");

//requiring isLoggedIn method to check whether the user is authenticated or not.

const {isLoggedIn} = require("../middleware.js");

//requiring isOwner method to check whether the user is owner for the listing or not.

const {isOwner} = require("../middleware.js");

//requiring isReviewAuhor middleware to check whether the user is author for the review or not.

const {isReviewAuthor} = require("../middleware.js");

//requiring validateReview middleware to check the listing is valid or not.

const {validateReview} =  require("../middleware.js");

//requiring reviewController from the controllers folder to include the callback function.

const reviewController =  require("../controllers/reviews.js");

//-----Reviews-------


//POST Review Route --> "/listings/:id/reviews".

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Review Route --> "/listings/:id/reviews/:review_id"

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

//exporting the reviews router.
module.exports = router;