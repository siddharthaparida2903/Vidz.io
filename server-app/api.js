// Assign the technologies to variables
var mongoClient = require("mongodb").MongoClient;
var express = require("express");
var cors = require("cors");

//Asign the mongodb url to "conStr"
var conStr = "mongodb://127.0.0.1:27017";

//Asign "express()" to "app"
var app = express();

//Allow the app to use "cors"
app.use(cors());
//Allow the app to convert the fetched data from mongdb to JSON.
//This will ensure the fucntioning of various CRUD functionalities
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//ROUTES
// > GET	/admin		Returns admin user details
app.get("/admin", (req, res) =>{
  // Connect to the database
  mongoClient.connect(conStr).then(clientObj => {
    // Select the database
    var database = clientObj.db("videolibrary");
    // Select the collection
    database.collection("admin").find({}).toArray().then(documents => {
      res.send(documents);
      res.end();
    });
  });
});

// > GET 	/videos		Returns all videos
app.get("/videos", (req, res) => {
  // Connect to the database
  mongoClient.connect(conStr).then(clientObj => {
    // Select the database
    var database = clientObj.db("videolibrary");
    database.collection("videos").find({}).toArray().then(documents => {
      res.send(documents);
      res.end();
    });
  });
});

// > GET	/categories	Returns all categories
app.get("/categories", (req, res) => {
  // Connect to the database
  mongoClient.connect(conStr).then(clientObj => {
    // Select the database
    var database = clientObj.db("videolibrary");
    database.collection("categories").find({}).toArray().then((documents) => {
      res.send(documents);
      res.end();
    });
  });
});

// > GET	/users		Returns all users
app.get("/users", (req, res) => {
  // Connect to the database
  mongoClient.connect(conStr).then(clientObj => {
    // Select the database
    var database = clientObj.db("videolibrary");
    database.collection("users").find({}).toArray().then(documents => {
      res.send(documents);
      res.end();
    });
  });
});

// > GET 	/video/1	Returns specific video by id
app.get("/video/:id", (req, res) => {
  mongoClient.connect(conStr).then(clientObj => {
    var database = clientObj.db("videolibrary");
    //use "req.params.id" to get the id of the ideo
    database.collection("videos").find({VideoId: parseInt(req.params.id)}).toArray().then(documents => {
      res.send(documents);
      res.end();
    });
  });
});

// > GET	/videos/java	Returns specific category videos
app.get("/videos/:categoryid", (req, res) => {
  mongoClient.connect(conStr).then(clientObj => {
    var database = clientObj.db("videolibrary");
    database.collection("videos").find({CategoryId: parseInt(req.params.categoryid)}).toArray().then(documents => {
      res.send(documents);
      res.end();
    });
  });
});

// > POST	/register-user	Adds new user to database
app.post("/register-user", (req, res) => {
  //Define the user details to be inserted to db
  var user = {
    // > UserId [string]
    UserId: req.body.UserId,
		// > UserName [string]
    UserName: req.body.UserName,
		// > Password [string]
    Password: req.body.Password,
		// > Mobile [string]
    Mobile: req.body.Mobile,
	  // > Email [string]
    Email: req.body.Email
  }

  mongoClient.connect(conStr).then(clientObj => {
    var database = clientObj.db("videolibrary");
    database.collection("users").insertOne(user).then(() => {
      console.log("User Registered");
      res.end();
    });
  });
});

// > POST	/add-video	Adds new video
app.post("/add-video", (req, res) => {
  //Define the video details to be inserted to db
  var video = {
    // > VideoId [number][PK]
    VideoId: parseInt(req.body.VideoId),
		// > Title [string]
    Title: req.body.Title,
		// > URL [string]
    Url: req.body.Url,
		// > Likes [number]
    Likes: parseInt(req.body.Likes),
		// > Dislikes [number]
    Dislikes: parseInt(req.body.Dislikes),
		// > Views [number]
    Views: parseInt(req.body.Views),
		// > CategoryId [number][FK]
    CategoryId: parseInt(req.body.CategoryId)
  }
  // Add video to database
  mongoClient.connect(conStr).then(clientObj => {
    var database = clientObj.db("videolibrary");
    database.collection("videos").insertOne(video).then(() => {
      console.log("Video Added");
      res.end();
    });
  });
});

// > PUT 	/edit-video/1	Edits specified video and update by id
app.put("/edit-video/:id", (req, res) => {
  // Define the video details to be updated in db
  var video = {
    VideoId: parseInt(req.body.VideoId),
    Title: req.body.Title,
    Url: req.body.Url,
    Likes: parseInt(req.body.Likes),
    Dislikes: parseInt(req.body.Dislikes),
    Views: parseInt(req.body.Views),
    CategoryId: parseInt(req.body.CategoryId)
  }

  mongoClient.connect(conStr).then(clientObj => {
    var database = clientObj.db("videolibrary");
    database.collection("videos").updateOne({VideoId: parseInt(req.params.id)}, {$set: video}).then(() => {
      console.log("Video Updated");
      res.end();
    });
  });
});

// > DELETE /delete-video/1 Removes specified video by id
app.delete("/delete-video/:id", (req, res) => {
  mongoClient.connect(conStr).then(clientObj =>{
    var database = clientObj.db("videolibrary");
    database.collection("videos").deleteOne({VideoId: parseInt(req.params.id)}).then(() => {
      console.log("Video Deleted");
      res.end();
    });
  });
});

app.listen(5000);
console.log("Server started at: http://127.0.0.1:5000");
