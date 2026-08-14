 const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review");
module.exports.isLoggedIn = (req, res, next) => {
    
    if (!req.isAuthenticated || !req.isAuthenticated()) {
         req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing")
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

const Listing = require("./models/listing");

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    // safety check
    if (!listing || !listing.owner || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();  
};

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);

    }else{
        next();
    }

};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);

    }else{
        next();
    }

};

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id,reviewId } = req.params;

    let review = await Review.findById(reviewId);

    // safety check
    if (!review || !review.author || !review.author.equals(req.user._id)) {
        req.flash("error", "You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();  
};