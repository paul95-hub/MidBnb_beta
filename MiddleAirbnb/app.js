var express       = require('express'),
	app           = express(),
 	bodyParser    = require("body-parser"),
 	mongoose      = require("mongoose"),
	Campground    = require("./models/campground"),
	Comment       = require("./models/comment"),
	flash         =require("connect-flash"),
	passport      = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride= require("method-override"),
	User          = require("./models/user"),
	seedDB        = require("./seeds");

// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/flats"),
	indexRoutes       = require("./routes/index");

mongoose.connect("mongodb://localhost/mid_bnb", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
mongoose.set("useFindAndModify", false);
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//Passport configuration
app.use(require("express-session")({
	secret: "The super secret is potato !!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/flats", campgroundRoutes);
app.use("/flats/:id/comments", commentRoutes);

app.listen(8000, function(){
		   console.log("Server running");
		   });
