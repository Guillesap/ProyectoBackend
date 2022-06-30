import passport from "passport";
import config from "../utils/config.js";
import { Strategy as StrategyFb } from "passport-facebook";

function fbAuth() {
    const FacebookStrategy = StrategyFb

    passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
        function (accessToken, refreshToken, profile, done) {
            done(null, profile);
        }
    ));
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
}

export default fbAuth;
