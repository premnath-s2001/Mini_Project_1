const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const MONGODB_URI ="mongodb+srv://Ravichandran:A6aPsjob4G2mvpnE@cluster0.4fago.mongodb.net/Ehoryzon";
const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions",
});
const port = process.env.PORT || 3000;
const csrfProtection = csrf();
app.set("view engine", "ejs");
app.set("views", "views");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
    session({
        secret: "my secret",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated1 = req.session.isLoggedIn;
    res.locals.Admin = req.session.Admin;
    res.locals.isAdmin = false;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    // throw new Error('Sync Dummy');
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then((user) => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch((err) => {
            next(new Error(err));
        });
});


app.use(authRoutes);
app.use("/admin",adminRoutes);
app.use(shopRoutes)
// mongoose
//     .connect(MONGODB_URI)
//     .then((result) => {
//         app.listen(port);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
app.listen(3000);