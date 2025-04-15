require("dotenv").config(); // Charger les variables d'environnement

const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
//const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const Subscriber = require("./models/subscriber");
const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");
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

/* Définir les routes
app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/courses", homeController.courses);
app.get("/contact", homeController.contact);
app.post("/contact", homeController.processContact);
app.get("/faq", homeController.faq);
app.get("/thanks", (req, res) => {
    res.render("thanks", { pageTitle: "Merci" });
});
*/

app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/subscribers/new", subscribersController.getSubscriptionPage);
app.post("/subscribers/create", subscribersController.saveSubscriber);
app.get("/subscribers/:id", subscribersController.show);
app.post("/subscribers/:id/delete", subscribersController.deleteSubscriber);
app.get("/subscribers/:id/edit", subscribersController.editSubscriber);
app.post("/subscribers/:id/update", subscribersController.updateSubscriber);

// Definir les routes des utilisateurs 
// Ajouter le middleware method-override
const methodOverride = require("method-override");
app.use(methodOverride("_method", {
methods: ["POST", "GET"]

}));
// Routes pour les utilisateurs
app.get("/users", usersController.index, usersController.indexView);
app.get("/users/new", usersController.new);
app.post("/users/create", usersController.create, usersController.redirectView);
app.get("/users/:id", usersController.show, usersController.showView);
app.get("/users/:id/edit", usersController.edit);
app.put("/users/:id/update", usersController.update, usersController.redirectView);
app.delete("/users/:id/delete", usersController.delete, usersController.redirectView);
// Routes pour les cours
app.get("/courses", coursesController.index, coursesController.indexView);
app.get("/courses/new", coursesController.new);
app.post("/courses/create", coursesController.create, coursesController.redirectView);
app.get("/courses/:id", coursesController.show, coursesController.showView);
app.get("/courses/:id/edit", coursesController.edit);
app.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
app.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);


// Gestion des erreurs
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// Démarrer le serveur
app.listen(app.get("port"), () => {
    console.log(`🚀 Serveur démarré sur le port : ${app.get("port")}`);
    console.log(`🌐 Adresse : http://localhost:${app.get("port")}`);
});

