const mongoose = require("mongoose");

const Schema = mongoose.Schema; //storing mongoose.Schema in Schema to access it easily.

//creating a new schema for listing.
const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    image:{
        url: String,
        filename: String
    },
    //before the upload option.
    // image:{
    //         //link of the image is stored in the database.
    //     type: String,
    //     default:"https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    //     set:(v)=> v===""
    //     ?"https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    //     :v, //if image is empty, set it to "default link"// 'v' is the link that is given by the user.  
    // },
    price:{
        type: Number,
    },
    location:{
        type: String,
    },
    country:{
        type: String,
    },
    reviews :[
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner:{
        type : Schema.Types.ObjectId,
        ref: "User",
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category:{
        type:String,
        enum: ['Iconic City','Room','Mountain','Pool','Camping','Castle','Beach','Farm','Arctic','Dome','Boat'],
        required: true,
    }
});

//requiring review model  to delete the reviews related to the listing that is being deleted.
const Review = require("./review.js");
const { required } = require("joi");

//POST mongoose middleware to delete the reviews related to the listing when the listing is deleted.
listingSchema.post("findOneAndDelete",async (listing) =>{
    if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});


//creating Listing model.
const Listing =  mongoose.model("Listing",listingSchema);

//exporting Listing model.
module.exports = Listing;