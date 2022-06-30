import passport from "passport";
import { usersDao } from "../daos/index.js"
import { Strategy } from "passport-local";
import { logger } from '../utils/logger.js';

const LocalStrategy = Strategy;

function localAuth() {
    passport.use(new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        (email, password, done) => {
            usersDao.findById(email)
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: "Incorrect email." });
                    }
                    if (user.password !== password) {
                        return done(null, false, { message: "Incorrect password." });
                    }
                    return done(null, user);
                })
                .catch(err => {
                    done(err),
                    logger('error', err);
                });
        }
    ));
}

export default localAuth;