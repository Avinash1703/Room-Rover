//requiring Review model from review.js in the models folder.

const Review = require("../models/review.js");

//requiring Listing model from the listing.js in the models folder.

const Listing = require("../models/listing.js");

//CREATE REVIEW CALLBACK FUNCTIONS. 
//callback function to post a review in the particular listing. --> POST "/listings/:id/reviews".
module.exports.createReview = async (req,res,next)=>{
    // let {id} = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    //console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Added!");
    res.redirect(`/listings/${listing._id}`);
};

//DELETE REVIEW CALLBACK FUNCTIONS.
//callback function to delete the review of a particular listing. --> DELETE "/listings/:id/reviews/:reviewId".
module.exports.destroyReview = async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};