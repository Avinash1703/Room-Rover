//requiring Listing model from the "models/listing.js".
const Listing =  require ("../models/listing.js");

//requiring mapbox geocoding service from the mapbox sdk services to pefom forward geocoding whenever we create a new listing.

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

//requiring mapToken environment variable to use mapbox services.

const mapToken = process.env.MAP_TOKEN;

//creating a geocoding client based on the map token to access geocoding service by our mapbox. 

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//INDEX ROUTE CALLBACK FUNCTIONS
//callback function for the index route.
module.exports.index = async (req,res,next)=>{
   let allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
};

//NEW AND CREATE ROUTE CALLBACK FUNCTIONS
//callback function for redndering the new form to create new listing route GET "/listings".
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

//callback function to create a new listing route --> POST  "/listings".
module.exports.createListing = async (req,res,next)=>{
    //variable to store the image url we are geting from the cloudinary.
    let url = req.file.path;
    //variable to store the image filename we are geting from the cloudinary.
    let filename = req.file.filename;
    //let newListing = new Listing(req.body);//passing the details we got from the form directly to the model without extracting them.
    let listing = req.body.listing;
    // console.log(listing);
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};//storing url and filename of the image in the Listing schema and then saving it in the mongoDB.
    //geocodingClient is the object of mapbox geocoding services, with the help of that we can use the methods present in the mapbox geocoding services.
    //forwardGeocode is the async method of mapbox geocoding services which perform forward geocoding. 
    let geoCoordinates = await geocodingClient.forwardGeocode({
        query: newListing.location,//location on which the geocoding should be performed.
        limit: 1, //limit is the no. of coordinates that is returned after geocoding.(it's default value is set to '5').
    }).send();
    //storing coordinates of a location usion geojson point schema format.
    newListing.geometry =  geoCoordinates.body.features[0].geometry;
    let savedListing = await newListing.save();
    //console.log(savedListing);
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

//SHOW ROUTE CALLBACK FUNCTIONS
//callback function o show a particular route --> GET "/listings/:id".
module.exports.showListing = async (req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path :"reviews",//populating each review in the listing.
        populate:{
            path:"author" //populating the author of each review in each listing.
        },
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    //console.log(listing);
    res.render("listings/show.ejs",{listing});
};

//EDIT AND UPDATE ROUTE CALLBACK FUNCTIONS
//callback function to get the edit form form for a particular listing to edit --> GET "/listings/:id/edit"
module.exports.renderEditForm = async (req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are trying to edit does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250/h_150")
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

//callback function to update the information that we got from the edit form in a listing. --> PUT "/listings/:id".
module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let updateListingInfo = req.body.listing;//here req.body.listing is used because we have to get the exact values that have been updated that's why we have used req.body.listing.
    let geoCoordinates = await geocodingClient.forwardGeocode({
        query: updateListingInfo.location,//location on which the geocoding should be performed.
        limit: 1, //limit is the no. of coordinates that is returned after geocoding.(it's default value is set to '5').
    }).send();
    updateListingInfo.geometry = geoCoordinates.body.features[0].geometry;
    let updateListing = await Listing.findByIdAndUpdate(id,updateListingInfo);//update the listing based on the body values and get the get the updatedListing and store it in updateListing.
    //if there is any edit in the file then only these steps will be executed.
    if(typeof req.file !== "undefined"){
        //variable to store the image url we are geting from the cloudinary.
        let url = req.file.path;
        //variable to store the image filename we are geting from the cloudinary.
        let filename = req.file.filename;
        updateListing.image = {url,filename};//if there is any update in files, then update them in the updateListing.
        await updateListing.save();// and then save the final updateListing.
    }
    
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//DELETE ROUTE CALLBACK FUNCTIONS.
//callback function to delete the listing. DELETE "/listings/:id".
module.exports.deleteListing = async (req,res,next)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    //console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

//FILTER ROUTES CALLBACK FUNCTIONS.


//callback function to filter the listings based on the category. GET "/listings/filter/:category"
module.exports.filterListings = async (req,res,next)=>{
    let {category} =  req.params;
    //console.log(category);
     let allListings = await Listing.find({category:category});
     res.render("listings/index",{allListings});
};

//SEARCH LOCATIONS ROUTES CALLBACK FUNCTIONS

//callback function to search the location. GET "/listings/search?location="
module.exports.searchLocation = async (req,res,next)=>{
    let {location} = req.query;
    // Perform case-insensitive search using regular expression
    const searchRegex = new RegExp(location, 'i'); // 'i' flag for case-insensitive matching
    // Find listings matching the search term in location field (flexible matching)
    let allListings = await Listing.find({location:{ $regex: searchRegex }});
    if(allListings.length>0){
        res.render("listings/index",{allListings});
    }else{
        res.render("listings/searchResponse",{allListings,location});
    }
}

