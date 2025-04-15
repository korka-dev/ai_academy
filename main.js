require("dotenv").config(); // Charger les variables d'environnement

const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const Subscriber = require("./models/subscriber");
const session = require("express-session");

// Connexion à MongoDB avec la variable d'environnement
mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.once("open", () => {
    console.log("✅ Connexion réussie à MongoDB via Mongoose !");
});
db.on("error", console.error.bind(console, "❌ Erreur de connexion à MongoDB :"));

const app = express();

// Middleware global pour définir une valeur par défaut pour pageTitle
app.use((req, res, next) => {
    res.locals.pageTitle = "AI Academy";
    next();
});
  

// Configuration des sessions
app.use(
    session({
        secret: process.env.JWT_SECRET || "secretKey",
        resave: false,
        saveUninitialized: true
    })
);

// Définir le port
app.set("port", process.env.PORT || 3000);

// Configurer EJS comme moteur de template
app.set("view engine", "ejs");
app.use(layouts);

// Middleware pour gérer les données des formulaires
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static("public"));

// Middleware pour les notifications flash
app.use((req, res, next) => {
    res.locals.notification = req.session.notification || null;
    delete req.session.notification;
    next();
});

// Définir les routes
app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/courses", homeController.courses);
app.get("/contact", homeController.contact);
app.post("/contact", homeController.processContact);
app.get("/faq", homeController.faq);
app.get("/thanks", (req, res) => {
    res.render("thanks", { pageTitle: "Merci" });
});

app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/subscribers/new", subscribersController.getSubscriptionPage);
app.post("/subscribers/create", subscribersController.saveSubscriber);
app.get("/subscribers/:id", subscribersController.show);
app.post("/subscribers/:id/delete", subscribersController.deleteSubscriber);
app.get("/subscribers/:id/edit", subscribersController.editSubscriber);
app.post("/subscribers/:id/update", subscribersController.updateSubscriber);

// Gestion des erreurs
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// Démarrer le serveur
app.listen(app.get("port"), () => {
    console.log(`🚀 Serveur démarré sur le port : ${app.get("port")}`);
    console.log(`🌐 Adresse : http://localhost:${app.get("port")}`);
});

