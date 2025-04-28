const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const courseRoutes = require("./courseRoutes");
const subscriberRoutes = require("./subscriberRoutes");
const apiRoutes = require("./apiRoutes");
const homeRoutes = require("./homeRoutes");
const errorRoutes = require("./errorRoutes");
const authRoutes = require("./authRoutes");
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/api", apiRoutes);
router.use("/", authRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

// Middleware pour gérer les erreurs 404 et 500
router.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});
module.exports = router;