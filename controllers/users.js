//requiring User model from the "models/user.js".
const User = require("../models/user.js");

//CALLBACK FUNCTIONS FOR THE USER SIGNUP.

//callback function to render the user signup form.  --> GET "/signup".
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

//callback function to signup the user into the website's database. --> POST "/signup".
module.exports.signup = async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser,password);//Convenience method to register a new user instance with a given password. Checks if username is unique. 
        //console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

//CALLBACK FUNCTIONS FOR THE USER LOGIN.

//callback function to render the user login form. --> GET "/login".
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

//callback function to login the user into the website. --> POST "/login".
module.exports.login = async(req,res)=>{
    //res.send("Welcome to Wanderlust! You are logged in!");
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";//if res.locals.redirectUrl is not available in the session , then redirect to "/listings".
    res.redirect(redirectUrl);
};

//callback function to logout the user from the website. -->  GET "/logout".
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are Logged out!");
        res.redirect("/listings");
    });
};