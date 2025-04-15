const Subscriber = require("../models/subscriber");
const { body, validationResult } = require("express-validator");

exports.getAllSubscribers = (req, res, next) => {
    let searchQuery = req.query.search || ""; 

    let searchConditions = searchQuery
        ? isNaN(searchQuery)
            ? { name: { $regex: searchQuery, $options: "i" } } 
            : { zipCode: searchQuery } 
        : {}; 

    Subscriber.find(searchConditions)
        .exec()
        .then(subscribers => {
            res.render("subscribers/index", { pageTitle: "Liste des abonnés", subscribers });
        })
        .catch(error => {
            console.error(`Erreur lors de la recherche des abonnés : ${error.message}`);
            next(error);
        });
};

exports.getSubscriptionPage = (req, res) => {
    res.render("subscribers/new", { pageTitle: "S'abonner", errors: null });
};

exports.saveSubscriber = [
    body("name").notEmpty().withMessage("Le nom est requis."), 
    body("email").isEmail().withMessage("L'email doit être valide."), 
    body("zipCode").isNumeric().withMessage("Le code postal doit être un nombre."), // Vérifie que le champ "zipCode" est un nombre
    (req, res, next) => {
        const errors = validationResult(req); 
        if (!errors.isEmpty()) {
            return res.render("subscribers/new", {
                pageTitle: "S'abonner",
                errors: errors.mapped() 
            });
        }

        let newSubscriber = new Subscriber({
            name: req.body.name,
            email: req.body.email,
            zipCode: req.body.zipCode
        });

        newSubscriber.save()
            .then(() => {
                res.render("subscribers/thanks", { pageTitle: "Merci" });
            })
            .catch(error => {
                console.error(`Erreur lors de l'enregistrement de l'abonné : ${error.message}`);
                res.render("subscribers/new", {
                    pageTitle: "S'abonner",
                    errors: error.errors || { message: error.message }
                });
            });
    }
];

exports.show = (req, res, next) => {
    let subscriberId = req.params.id;

    Subscriber.findById(subscriberId)
        .then(subscriber => {
            res.render("subscribers/show", {
                subscriber: subscriber
            });
        })
        .catch(error => {
            console.log(`Erreur lors de la récupération d'un abonné par ID: ${error.message}`);
            next(error);
        });
};

exports.deleteSubscriber = (req, res, next) => {
    let subscriberId = req.params.id;

    Subscriber.findByIdAndDelete(subscriberId)
        .then(() => {
            res.redirect("/subscribers");
        })
        .catch(error => {
            console.error(`Erreur lors de la suppression de l'abonné : ${error.message}`);
            next(error);
        });
};

exports.editSubscriber = (req, res, next) => {
    let subscriberId = req.params.id;

    Subscriber.findById(subscriberId)
        .then(subscriber => {
            if (!subscriber) {
                return res.status(404).send("Abonné non trouvé");
            }
            res.render("subscribers/edit", { pageTitle: "Modifier un abonné", subscriber });
        })
        .catch(error => {
            console.error(`Erreur lors de la récupération de l'abonné : ${error.message}`);
            next(error);
        });
};

exports.updateSubscriber = (req, res, next) => {
    let subscriberId = req.params.id;

    Subscriber.findByIdAndUpdate(subscriberId, {
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
    }, { new: true, runValidators: true })
        .then(() => {
            res.redirect("/subscribers");
        })
        .catch(error => {
            console.error(`Erreur lors de la mise à jour de l'abonné : ${error.message}`);
            next(error);
        });
};