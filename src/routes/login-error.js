import express from 'express';
import { logger } from '../utils/logger.js';

const loginError = express.Router();

loginError.get('/', (req, res) => {
    logger('error', "Error login page requested");
    res.render("../views/login-error.ejs");
});

export default loginError;