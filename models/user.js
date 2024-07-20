//requiring mongoose package.
const mongoose = require("mongoose");

//Storing mongoose.Schema in a Schema variable.
const Schema = mongoose.Schema;

//requiring "passport-local-mongoose" package.
const passportLocalMongoose = require("passport-local-mongoose");

//creating userSchema
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }
    //username and password fields can be created automatically by the npm package : "passport-local-mongoose".
});

//using passportLocalMongoose plugin for the userSchema.
userSchema.plugin(passportLocalMongoose);

//creating User model for the userSchema.
const User = mongoose.model("User",userSchema);

//exporting User Model
module.exports = User; 