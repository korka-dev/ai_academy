const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");

// Middleware pour vérifier les tokens JWT
router.use(apiController.verifyToken);

// Routes API pour les utilisateurs
router.get("/users", apiController.getAllUsers);
router.get("/users/:id", apiController.getUserById);
router.post("/users", apiController.createUser);
router.put("/users/:id", apiController.updateUser);
router.delete("/users/:id", apiController.deleteUser);

// Routes API pour les cours
router.get("/courses", apiController.getAllCourses);
router.get("/courses/:id", apiController.getCourseById);
router.post("/courses", apiController.createCourse);
router.put("/courses/:id", apiController.updateCourse);
router.delete("/courses/:id", apiController.deleteCourse);

// Routes API pour les abonnés
router.get("/subscribers", apiController.getAllSubscribers);
router.get("/subscribers/:id", apiController.getSubscriberById);
router.post("/subscribers", apiController.createSubscriber);
router.put("/subscribers/:id", apiController.updateSubscriber);
router.delete("/subscribers/:id", apiController.deleteSubscriber);
// Route pour la documentation (n'a pas besoin de token)
router.get("/documentation", (req, res) => {
    res.render("api/documentation");
    });

// Route pour l'authentification API
router.post("/login", apiController.apiAuthenticate);

module.exports = router;