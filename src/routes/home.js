import express from 'express';
import { logger } from '../utils/logger.js';

const home = express.Router();

home.get("/", (req, res) => {
    logger('info', "Home page requested");
    if (req.isAuthenticated()) {
        return res.render("../views/index.ejs", {
            name: req.user.displayName ? req.user.displayName : req.user.name,
            photo: req.user.photos ? req.user.photos[0].value : "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=64",
            email: req.user.emails ? req.user.emails[0].value : req.user.email
        });
    } else {
        return res.redirect("/login");
    }
});

export default home;