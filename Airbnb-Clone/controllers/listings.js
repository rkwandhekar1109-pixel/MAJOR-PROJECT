const Listing =require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({
  accessToken: mapToken
});
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const initData = require("../init/data.js");

 


module.exports.index = async (req, res) => {
  const { category, search } = req.query;

  let filter = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    // ✅ CHANGE 'name' TO 'title' TO MATCH YOUR DB
    filter.title = { $regex: search, $options: "i" };
  }

  const allListings = await Listing.find(filter);

  res.render("listings/index", { allListings });
};


module.exports.renderNewForm = (req, res) => {
    // console.log(isLoggedIn);
  res.render("listings/new.ejs");
}
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
             path:"author",
        },
    })
    .populate("owner")
    if(!listing){
        req.flash("error","Listing you requested for does not exit!");
        return res.redirect("/listings");
        
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}


module.exports.createListing = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location, // ✅ fixed
    limit: 1,
  }).send();

  if (!response.body.features.length) {
    req.flash("error", "Location not found!");
    return res.redirect("/listings/new");
  }

const geoData = response.body.features[0].geometry;
  // new Listing.geometry = response.body.features[0].geometry;

  const newListing = new Listing(req.body.listing);

  newListing.geometry = geoData; 

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  newListing.owner = req.user._id;

  await newListing.save();

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};
 





 
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;

 
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/h_300,w_250"
  );

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};
 

 
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !==  "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
     let {id} = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("success","New Listing Deleted");
     res.redirect("/listings");

}

