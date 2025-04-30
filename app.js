const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path = require("path");
const method_override = require("method-override");
const ejs_mate = require("ejs-mate");
const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(Mongo_URL);
}

app.get("/", (req, res) => {
  res.send("This is the response");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(method_override("_method"));
app.engine("ejs", ejs_mate);
app.use(express.static(path.join(__dirname, "/public")));

//Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// NEW ROUTE
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// CREATE ROUTE
app.post("/listings", async (req, res) => {
  let newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//EDIT ROUTE
app.get('/listings/:id/edit', async (req, res) => {
    let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', {listing});
})

// UPDATE ROUTE
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
 await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`)
})

//VIEW ROUTE
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//DELETE ROUTE
app.delete('/listings/:id', async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
})

// app.get('/testListing', async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description : "By the beach",
//         price : 1200,
//         location : "Calangute, Goa",
//         country : "India"
//     })
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Testing was successful.")
// })

app.listen(8080, () => {
  console.log("App is running on the post 8080");
});
