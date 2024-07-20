//checking whether project environment i.e., "process.env.NODE_ENV" is in development stage or production stage.
//this states that .env file can be used only in the development phase only. and cannot be used in the production phase.
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

//requiring express to start the server.

const express = require("express");
const app = express();
const port = 8080;

//requiring path

const path = require('path');

//requiring uuid

const {v4:uuidv4} = require("uuid");
uuidv4();

//requiring ejs-mate
const ejsMate = require("ejs-mate");

//requiring method-override

const methodOverride = require("method-override");

//requiring ExpressError class from the util class to send the custom errors based on the errors occurred.

const ExpressError = require("./utils/ExpressError.js");

//requiring express session to create sessions.

const session = require("express-session");

//requiring connect-mongo to store the session information on the poduction stage.

const MongoStore = require('connect-mongo');

//requiring flash to display flash messages.

const flash = require("connect-flash");

//requiring passport package to provide authentication.

const passport = require("passport");

//requiring passport-local strategy.

const LocalStrategy = require("passport-local");

//requiring user model from user.js

const User = require("./models/user.js");

//requiring mongoose to connect the mongodb with javascript and server.

const mongoose = require('mongoose');

//database url for the database that we have created on mongo atlas to host our local mongo database on internet.
const dbUrl = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
});

//connecting mongoose with mongodb.

async function main(){
    await mongoose.connect(dbUrl);
}

//to make express to understand the information that has been sent through post request.

app.use(express.urlencoded({extended:true}));
app.use(express.json());

//enabling express server to access the views

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

//serving static files

app.use(express.static(path.join(__dirname,"public")));
//app.use(express.static(path.join(__dirname,"public/JS")));

//override with POST having ?_method=DELETE/PUT/PATCH

app.use(methodOverride('_method'));

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

//creating a variable named "store" to define the sessionOptions to be used in the production stage by MongoStore/'connect-mongo'.
//store is a variable that is used to store the session information in the database.

const store = MongoStore.create({
    mongoUrl:dbUrl,//session information is stored in the mongo atlas database.
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60, //for lazy update
});

store.on("error",(err)=>{
    console.log("Error in Mongo Session Store",err);
});

//defining session options to create sessions.

const sessionOptions ={
    store: store, //storing store in the sessionOptions to pass it to the session.
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires : Date.now() + 1000 * 60 *60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly : true
    },
};

//using session middleware to create sessions.

app.use(session(sessionOptions));

//using flash.

app.use(flash());

//middleware to initialize the passport.

app.use(passport.initialize());

//middleware to use passport session.

app.use(passport.session());

//use static authenticate method of model in LocalStrategy.

passport.use(new LocalStrategy(User.authenticate()));

//use static serialize and deserialize of model for passport session support.

passport.serializeUser(User.serializeUser()); //Generates a function that is used by Passport to serialize users into the session.
passport.deserializeUser(User.deserializeUser()); //Generates a function that is used by Passport to deserialize users into the session.

//creating a middleware to store res.locals variables.

//res.locals variables are used to access the req objects, req messages,etc.. related to req.
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

//requiring listings from routes folder. 

const listingRouter = require("./routes/listings.js");

//using listings router for the listings routes.

app.use("/listings",listingRouter);

//requiring reviews from routes folder. 

const reviewRouter = require("./routes/review.js");

//using reviews router for the reviews routes.

app.use("/listings/:id/reviews",reviewRouter);

//requiring users from routes folder. 

const userRouter = require("./routes/user.js");

//using users router for the users routes.

app.use("/",userRouter);

//for all the remaining routes other than the mentioned routes, we can send a single response using this.

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

//middleware to handle the errors on the server side.

app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong!"} = err;
    //statusCode = 500 if there's no statusCode then default error code is '500' and the message is 'Something went wrong!'. 
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
});

//enabling express to listen the requests that are sent by a user and to let us know that the serve is started.

app.listen(port,()=>{
    console.log("Server is running on port " + port);
});
