//requiring express.

const express = require("express");

//creating a router for listings routes.

const router = express.Router();

//requiring wrapAsync function from utils folder to handle the errors on the server side.

const wrapAsync = require("../utils/wrapAsync.js");

//requiring Listing model from lsting.js in the models folder.

const Listing = require("../models/listing.js");

//requiring isLoggedIn method to check whether the user is authenticated or not.

const {isLoggedIn} = require("../middleware.js");

//requiring isOwner method to check whether the user is owner for the listing or not.

const {isOwner} = require("../middleware.js");

//requiring validateListing middleware to check the listing is valid or not.

const {validateListing} =  require("../middleware.js");

//requiring listingController from the "controllers/listing.js".

const listingController = require("../controllers/listings.js");

//requiring multer to process "multipart/form-data" from the form to the backend express server.

const multer = require("multer");

//requiring storage (where to save the files) for the files from the "cloudConfig.js".

const { storage } = require("../cloudConfig.js");

//storing the uploaded files in the storage that is defined on the cloudinary.

const upload = multer({storage});
//storing the uploaded files in the destination folder called "uploads".
//uploads folder is created by the multer automatically.

//const upload = multer({dest: 'uploads/'});

//dest:'uploads/'--> states that the destination folder to store the files is uploads folder.(it is temporary one).

//route for performing search listings.

router.get("/search", wrapAsync(listingController.searchLocation));

//routes for filters.

router.get("/filter/:category",wrapAsync(listingController.filterListings));

router.get("/trending",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));


//roter for search router
router.get("/search",wrapAsync(listingController.searchLocation));

//router.route to get a new form to create a new listing.
router
    .route("/new")
    //New and Create Route
    //Creating the listing --> GET  "/listings/new"
    .get(isLoggedIn,listingController.renderNewForm);

//router.route for index and creating a new listings.

router
    .route("/")
    //index route -->  GET "/listings"
    .get(wrapAsync(listingController.index)) 
    //Create route --> posting the created listing into the database.
    //POST   "/listings"
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing)); // create new listing. --> POST "/listings"
    //wrapAsync middleware is used to wrap the async function with try catch block.
    //upload.single("listing[image]") -->middleware to upload the image file to the cloudinary.
    //validateListing middleware is used to validate the listing schema on the server side.

//router.route for getting the edit form to update the listing.
router
    .route("/:id/edit")
    //Update route --> Edit and Update Route
    //Edit route --->  GET   "/listings/:id/edit"
    .get(isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//router.route for show particular listing, update a particular listing, delete a particular listing.

router
    .route("/:id")
    //show route --> to show the individual listing's data. 
    //Read : SHOW ROUTE--> GET   "/listings/:id".
    .get(wrapAsync(listingController.showListing))
    //Update route -->  PUT  "/listings/:id".
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
    //Delete route ---> DELETE  "/listings/:id".
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

//exporting the listings router.

module.exports = router;