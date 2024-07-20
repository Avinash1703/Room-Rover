const mongoose = require("mongoose");

//requiring sample data from data.js
const initData = require("./data.js");

//requiring Listing model from listing.js.
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
});

//connecting mongoose with mongodb.

async function main(){
    await mongoose.connect(MONGO_URL);
}

//function to initialize database.
const initDB = async ()=>{
    await Listing.deleteMany({});//clearing the data from the database if any exists.
    //creating a new listing object with owner property and storing in the same variable(initData.data).
    initData.data = initData.data.map((obj)=>({
        ...obj, owner : '668f568a138261a43b9bab6e'//,geometry:geoData(obj.location)
    }));
    await Listing.insertMany(initData.data);
    console.log("Database initialized");
}

initDB();
