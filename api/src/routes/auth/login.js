import { body, validationResult } from "express-validator";
import passport from "passport";

import { convertError, createToken, createRefreshToken } from "../../helpers/utils";

export const validate = [
    body("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password is required."),
    body("email")
        .isEmail()
        .normalizeEmail()
];

export const login = (_req, _res, _next) => {
    const errors = validationResult(_req);

    if (!errors.isEmpty()) {
        return _next(convertError(errors.array()));
    }

    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return _next(new Error(err));
        }
        if (!user) {
            return _next(new Error(info.msg));
        }
        _req.logIn(
            user,
            {
                session: false
            },
            err => {
                if (err) {
                    return _next(err);
                }
                const token = createToken(user);
                createRefreshToken(user)
                    .then(refreshToken => {
                        _req.responseData = {
                            message: "Login successful",
                            success: true,
                            token: token,
                            refreshToken: refreshToken,
                            user: {
                                profile: user.profile,
                                email: user.email,
                                phone: user.phone,
                                redditUsername: user.redditUsername,
                                _id: user._id
                            },
                            authenticated: true
                        };
                        _next();
                    })
                    .catch(err => _next(err));
            }
        );
    })(_req, _res, _next);
};
