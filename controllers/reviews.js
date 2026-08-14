const Listing = require("../models/listing")
const Review = require("../models/review");

module.exports.createReview = async(req,res)=>{
    console.log(req.params.id);
    let { id } = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");
     
    res.redirect(`/listings/${listing._id}`);

}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    // remove review from listing
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    // delete review from DB
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","New Review Deleted");

    res.redirect(`/listings/${id}`);

}
