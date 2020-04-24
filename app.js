var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var methodoverride= require("method-override");
var expresssanitizer= require("express-sanitizer");


mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

//app config
mongoose.connect("mongodb://localhost:27017/myblogapp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(expresssanitizer());


//mongoose model
var blogschema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date, default:Date.now}
});

var blog=mongoose.model("blog",blogschema);

//restful routes
 
app.get("/", function(req, res){
	res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs",function(req, res){
	blog.find({}, function(err, blogs){
		if(err){
			console.log("error!!");
		}else{
			res.render("index", {blogs:blogs});
		}
	});	
});


//NEW ROUTE 
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//CREATE ROUTE 
app.post("/blogs", function(req, res){
	//create blogs
	req.body.blog.body=req.sanitize(req.body.blog.body);
	blog.create(req.body.blog, function(err, newblog){
		if(err){
			res.render("new");
		}else{
			// then, redirect to the index 
			res.redirect("/blogs");
		}
	});
	
});

//SHOW rOute
app.get("/blogs/:id", function(req, res){
	blog.findById(req.params.id, function(err, foundblog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show", {blog:foundblog});
		}
	});
});


//edit routes
app.get("/blogs/:id/edit", function(req, res){
	blog.findById(req.params.id, function(err, foundblog ){
		if(err){
			res.redirect("/");
		}else{
			res.render("edit", {blog:foundblog});
		}
	});
	
});


//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedblog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETECroute
app.delete("/blogs/:id", function(req, res){
	//destroy blog 
	blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
	
	//and redirect somewhere
	
});


app.listen(process.env.PORT || 3000, process.env.IP , function(){
	console.log("server of my blog has started!!!");
});