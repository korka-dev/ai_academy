const courses = [
    {
    title: "Introduction à l'IA",
    description: "Découvrez les fondamentaux de l'intelligence artificielle.",
    price: 199,
    level: "Débutant"
    },
    {
    title: "Machine Learning Fondamental",
    description: "Apprenez les principes du machine learning et les algorithmes de base.",
    price: 299,
    level: "Intermédiaire"
    },
    {
    title: "Deep Learning Avancé",
    description: "Maîtrisez les réseaux de neurones profonds et leurs applications.",
    price: 399,
    level: "Avancé"
    }
    ];

const { body, validationResult } = require("express-validator");

exports.index = (req, res) => {
    res.render("index", { pageTitle: "Accueil" });
};
exports.about = (req, res) => {
    res.render("about", { pageTitle: "À propos" });
};
exports.courses = (req, res) => {
    let filteredCourses = courses;

    if (req.query.level) {
        filteredCourses = filteredCourses.filter(course => course.level === req.query.level);
    }

    if (req.query.price) {
        filteredCourses = filteredCourses.filter(course => course.price <= parseInt(req.query.price));
    }

    res.render("courses", {
        pageTitle: "Nos Cours",
        courses: filteredCourses
    });
};
exports.contact = (req, res) => {
    res.render("contact", { pageTitle: "Contact", errors: null });
};
exports.processContact = (req, res) => {
    const { name, email, course, message } = req.body;

    console.log("Données du formulaire reçues :", req.body);

    const notification = "Votre message a été envoyé avec succès !";

    res.render("thanks", {
        pageTitle: "Merci",
        notification,
        formData: { name, email, course, message }
    });
};
exports.faq = (req, res) => {
    res.render("faq", { pageTitle: "FAQ" });
};