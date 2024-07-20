const mongoose = require("mongoose");

const Schema = mongoose.Schema; //storing mongoose.Schema in Schema to access it easily.

const reviewSchema = new Schema({
    comment : String,
    rating :{
        type : Number,
        min : 1,
        max : 5
    },
    createdAt :{
        type : Date,
        default : Date.now(),
    },
    author :{
        type : Schema.Types.ObjectId,
        ref : "User",
    }
});

module.exports = mongoose.model("Review",reviewSchema);