import express from 'express';
import { logger } from '../utils/logger.js';

const logout = express.Router();

logout.get("/", (req, res) => {
    logger('info', "Logout page requested");
    req.logOut();
    res.redirect("/login");
});

export default logout;