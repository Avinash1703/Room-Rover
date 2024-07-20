//requiring listing model from the "models/listing.js".
const Listing = require("./models/listing.js");

//requiring review model from the "models/review.js".
const Review = require("./models/review.js");

//requiring  listingSchema object from schema.js to automatically validate schema on server side (listingSchema is created using JOi).

const {listingSchema} = require("./schema.js");

//requiring  reviewSchema object from schema.js to automatically validate schema on server side (listingSchema is created using JOi).

const {reviewSchema} = require("./schema.js");

//requiring ExpressError class from the util class to send the custom errors based on the errors occurred.

const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //if the user is trying to perform any operation on the website and the user is not logged in then we have to redirect to that operation after logging in to bdo that we have to store he redirect url.
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();
};

//middleware to save the redirectUrl.

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//middleware to check whether the cuurent user and the listing owner is same or not, if same then the user is permitted to edit and delete.

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    //comparing the listing owner id with the current user id to give him the permission to edit and delete. if current user is not the owner he won't be able to edit and delete the listing.
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//middleware to validate listing schema on server side.

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        //extracting the details from the error.
        let errorMessage = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMessage);
    }else{
        next();
    }
};

//middleware to validate review schema on server side.

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        //extracting the details from the error.
        let errorMessage = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMessage);
    }else{
        next();
    }
};

//middleware to check whether the cuurent user and the review author is same or not, if same then the user is permitted to delete the review.

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    //comparing the listing owner id with the current user id to give him the permission to edit. if current user is not the owner he won't be able to edit the listing.
    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};