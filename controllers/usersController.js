const User = require("../models/user");
const jsonWebToken = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

// Clé secrète pour signer les tokens JWT
const token_key = process.env.TOKEN_KEY || "secretTokenKey";

// Fonction utilitaire pour extraire les paramètres utilisateur du corps de la requête
const getUserParams = body => {
    return {
        name: {
            first: body.first,
            last: body.last
        },
        email: body.email,
        password: body.password,
        zipCode: body.zipCode
    };
};

module.exports = {
    index: (req, res, next) => {
        User.find({})
            .then(users => {
                res.locals.users = users;
                next();
            })
            .catch(error => {
                console.log(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
                next(error);
            });
    },
    indexView: (req, res) => {
        res.render("users/index", { pageTitle: "Liste des utilisateurs" });
    },
    new: (req, res) => {
        res.render("users/new", { pageTitle: "Créer un utilisateur" });
    },
    validate: [
        body("email").isEmail().withMessage("L'email doit être valide."),
        body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères."),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.flash("error", errors.array().map(err => err.msg).join(" "));
                return res.redirect("/users/new");
            }
            next();
        }
    ],
    create: (req, res, next) => {
        let userParams = getUserParams(req.body);
        User.create(userParams)
            .then(user => {
                res.locals.redirect = "/users";
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`Erreur lors de la création de l'utilisateur: ${error.message}`);
                res.locals.redirect = "/users/new";
                next();
            });
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },
    show: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`Erreur lors de la récupération de l'utilisateur par ID: ${error.message}`);
                next(error);
            });
    },
    showView: (req, res) => {
        res.render("users/show");
    },
    edit: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.render("users/edit", {
                    user: user
                });
            })
            .catch(error => {
                console.log(`Erreur lors de la récupération de l'utilisateur par ID: ${error.message}`);
                next(error);
            });
    },
    update: (req, res, next) => {
        let userId = req.params.id,
            userParams = getUserParams(req.body);
        User.findByIdAndUpdate(userId, {
            $set: userParams
        })
            .then(user => {
                res.locals.redirect = `/users/${userId}`;
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`Erreur lors de la mise à jour de l'utilisateur par ID: ${error.message}`);
                next(error);
            });
    },
    delete: (req, res, next) => {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
            .then(() => {
                res.locals.redirect = "/users";
                next();
            })
            .catch(error => {
                console.log(`Erreur lors de la suppression de l'utilisateur par ID: ${error.message}`);
                next();
            });
    },
    getApiToken: (req, res) => {
        if (req.user) {
            let signedToken = jsonWebToken.sign(
                {
                    data: req.user._id,
                    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // Token valable 30 jours
                },
                token_key
            );
            res.render("users/api-token", {
                token: signedToken,
                pageTitle: "Votre Token API"
            });
        } else {
            req.flash("error", "Vous devez être connecté pour obtenir un token API.");
            res.redirect("/login");
        }
    }
};