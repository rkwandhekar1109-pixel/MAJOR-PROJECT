const User = require("../models/user.js");
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}


module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        // 🔥 THIS PART IS CRITICAL
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// module.exports.signup = async (req, res, next) => {
//     try {
//         let { username, email, password } = req.body;

//         const newUser = new User({ email, username });
//         const registeredUser = await User.register(newUser, password);

//         req.login(registeredUser, (err) => {
//             if (err) return next(err);

//             req.flash("success", "Welcome to wunderlust");
//             return res.redirect("/listings");   // ✅ only ONE response
//         });

//     } catch (e) {
//         req.flash("error", e.message);
//         return res.redirect("/signup");
//     }
// }

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome back to Wunderlust!");

    let redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;

    return res.redirect(redirectUrl); 
  }

  module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);

        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}