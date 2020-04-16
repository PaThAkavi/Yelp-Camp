var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");//used to get data out of the form

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });  //connecting mongoose to the yelp_camp database

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

//Creating a campground 'model'
var Campground = mongoose.model("Campground", campgroundSchema);

//Creating a new campground and adding it to the DATABASE
// Campground.create({
    
//     name: "Kipling Camp",
//     image: "https://farm4.staticflickr.com/3062/2984119099_82336dfc3b.jpg",
//     description: "This is a huge hill with a very beautiful sunrise and sunset viewpoint. Everyone must visit it atleast once in lifetime."
    
// }, function(err, newCampground){
//     if(err){
//         console.log("ERROR:");
//         console.log(err);
//     } else{
//         console.log("WE'VE JUST ADDED A NEW CAMPGROUND TO OUR DATABASE:");
//         console.log(newCampground);
//     }
// });

//printing all the items saved in the DATABASE
// Campground.find({}, function(err, campgrounds){
//     if(err){
//         console.log("ERROR:");
//         console.log(err);
//     } else{
//         console.log("HERE ARE ALL THE CAMPGROUNDS IN THE DATABASE:");
//         console.log(campgrounds);
//     }
// });

// var campgrounds = [
//     {name: "Salmon Creek", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f5c37aaeeeb7b9_340.jpg"},
//     {name: "Tsomoriri Camp", image: "https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104491f5c37aaeeeb7b9_340.jpg"},
//     {name: "Kipling Camp", image: "https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104491f5c37aaeeeb7b9_340.jpg"}
// ];

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - Display a list of all the campgrounds
app.get("/campgrounds", function(req, res){
        Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

//[NEW - display a form to make a new campground]SEPARATE ROUTE FOR FORM
app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

//CREATE - Add new campground to the DB
app.post("/campgrounds", function(req, res){
    var name = req.body.name;  //grabbing the 'name' from the form only with the help of 'body-parser'
    var image = req.body.image;//grabbing the 'image' from the form
    var description = req.body.description;
    
    var newCampground = {   //NEW CAMPGROUND OBJECT
        name: name,
        image: image,
        description: description
    };   
    
    //create a new campground and save it to the Database
    Campground.create(newCampground, function(err, newlyCreated){
         if(err){
            console.log(err);
         } else{
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
         }
    });
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render("show", {campground: foundCampground});
        }
    });
});


app.listen(8888, function(){
    console.log("YelpCamp Server has started on port 8888...");
});