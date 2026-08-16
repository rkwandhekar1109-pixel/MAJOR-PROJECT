// if(process.env.NODE_ENV != "production"){
//     require('dotenv').config();

// }
// if (!process.env.SECRET) {
//     throw new Error("SECRET is missing in .env file");
// }

// const express = require("express");
// const app=express();
// const mongoose = require("mongoose");
// const path =require("path");
// const methodOverride = require("method-override");
// // const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl = process.env.ATLASDB_URL;

// if (!dbUrl) {
//     throw new Error("ATLASDB_URL is missing in .env file");
// }
// console.log("DB URL:", dbUrl);
// const ejsMate = require("ejs-mate");
// const ExpressError = require("./utils/ExpressError.js");
// const session=require("express-session");
// const MongoStore = require("connect-mongo").default;
// const flash= require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");
 
 
// const listingRouter = require("./routes/listings.js");
// const reviewRouter = require("./routes/review.js")
// const userRouter = require("./routes/user.js")

 

// main()
//     .then(()=>{
//         console.log("Connected to DB");
//     })
//     .catch ((err) => {
//         console.log(err);
//     });

// async function main(){
//     await mongoose.connect(dbUrl)
         
    
// };


// app.set("view engine", "ejs");
// app.set("views",path.join(__dirname,"views"));
// app.use(express.urlencoded({extended:true}));
// app.use(methodOverride("_method"));
// app.engine('ejs', ejsMate);
// app.use(express.static(path.join(__dirname,"/public")));
 
 

// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     crypto: {
//         secret: process.env.SECRET,
//     },
//     touchAfter: 24 * 3600,
// });

// store.on("error", (err) => {
//     console.log("SESSION STORE ERROR:", err);
// });


// const sessionOptions = {
//     store,
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly: true,
//         secure: false,   // 🔥 MUST be false (VERY IMPORTANT)
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//     }
// };

 

// app.use(session(sessionOptions));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
 
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
 
// app.use((req,res,next)=>{
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     res.locals.currUser = req.user;
//     next();
// });
 
// app.use("/", userRouter);
// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews", reviewRouter);

 





 
// app.use((req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });

    
// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "Something went wrong" } = err;
//   res.status(statusCode).render("error.ejs", { message });

// //   res.status(statusCode).send(message);
// });

// app.listen(8080,() =>{
//     console.log("Server is listening to port 8080");
// });











if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

if (!process.env.SECRET) {
    throw new Error("SECRET is missing in environment variables");
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

const dbUrl = process.env.ATLASDB_URL;

if (!dbUrl) {
    throw new Error("ATLASDB_URL is missing in environment variables");
}

const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ====================
// Database Connection
// ====================

async function main() {
    await mongoose.connect(dbUrl);
}

// ====================
// Express Configuration
// ====================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));

// ====================
// Session Store
// ====================

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("SESSION STORE ERROR:", err);
});

// ====================
// Session Options
// ====================

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// ====================
// Passport Configuration
// ====================

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ====================
// Flash Messages & User
// ====================

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// ====================
// Routes
// ====================

app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

// ====================
// 404 Error
// ====================

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// ====================
// Error Handler
// ====================

app.use((err, req, res, next) => {
    let {
        statusCode = 500,
        message = "Something went wrong",
    } = err;

    res.status(statusCode).render("error.ejs", { message });
});

// ====================
// Start Server
// ====================

const PORT = process.env.PORT || 8080;

main()
    .then(() => {
        console.log("Connected to DB");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Database connection error:", err);
    });