const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");

router.use((req, res) => {
    errorController.pageNotFoundError(req, res);
});

router.use((error, req, res, next) => {
    errorController.internalServerError(error, req, res, next);
});

module.exports = router;