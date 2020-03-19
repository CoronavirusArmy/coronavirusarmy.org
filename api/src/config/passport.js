import dotenv from "dotenv";
import passport from "passport";
import mongoose from "mongoose";

import User from "../models/user";
const ObjectId = mongoose.Types.ObjectId;

const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

/**
 * Sign in using Email and Password.
 */
passport.use(
    new LocalStrategy(
        {
            usernameField: "email"
        },
        (identity, password, done) => {
            User.findOne(
                {
                    $or: [
                        {
                            email: identity.toLowerCase()
                            // active: true
                        },
                        {
                            username: identity.toLowerCase()
                            // active: true
                        }
                    ]
                },
                (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {
                            msg: `Invalid email and password combination.`
                        });
                    }
                    user.comparePassword(password, (err, isMatch) => {
                        if (err) {
                            return done("Invalid email and password combination.");
                        }
                        if (isMatch) {
                            return done(null, user);
                        }
                        return done(null, false, {
                            msg: "Invalid email and password combination."
                        });
                    });
                }
            );
        }
    )
);

passport.use(
    new JWTstrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SESSION_SECRET
        },
        (jwtPayload, cb) => {
            return User.findOne({
                _id: ObjectId(jwtPayload.user._id),
                email: jwtPayload.user.email
            })
                .then(user => {
                    return cb(null, user);
                })
                .catch(err => {
                    return cb(err);
                });
        }
    )
);