require("dotenv").config(); 

const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const httpStatus = require("http-status-codes");
const routes = require("./routes/index");
const User = require("./models/user");



// Connexion à MongoDB avec la variable d'environnement
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.once("open", () => {
    console.log("✅ Connexion réussie à MongoDB via Mongoose !");
});
db.on("error", console.error.bind(console, "❌ Erreur de connexion à MongoDB :"));

const app = express();

// Définir le port
app.set("port", process.env.PORT || 3000);

// Configurer EJS comme moteur de template
app.set("view engine", "ejs");
app.use(layouts);

// Servir les fichiers statiques
app.use(express.static("public"));

// Middleware pour gérer les données des formulaires
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Ajouter le middleware method-override
app.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

// Configuration des cookies et des sessions
app.use(cookieParser("secret_passcode"));
app.use(session({
    secret: process.env.JWT_SECRET || "secretKey",
    cookie: {
        maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
}));

// Middleware pour les notifications flash
app.use(flash());

// Initialiser Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuration de Passport avec le modèle User
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware pour rendre les variables locales disponibles dans toutes les vues
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});

app.use("/", routes);



// Démarrer le serveur
app.listen(app.get("port"), () => {
    console.log(`🚀 Serveur démarré sur le port : ${app.get("port")}`);
    console.log(`🌐 Adresse : http://localhost:${app.get("port")}`);
});


