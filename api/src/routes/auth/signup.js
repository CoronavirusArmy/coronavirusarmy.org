import { validationResult, body } from "express-validator";

import { convertError } from "../../helpers/utils";
import User from "../../models/user";

export const validate = [
    body("name")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Name is required."),
    body("email")
        .isEmail()
        .normalizeEmail(),
    body("password")
        .trim()
        .custom((value, { req, loc, path }) => {
            if (value.length < 8) {
                throw new Error("Password should be 8 or more characters.");
            } else {
                if (value !== req.body.confirmPassword) {
                    throw new Error("Please confirm password.");
                } else {
                    return value;
                }
            }
        })
]

export const signup = (_req, _res, _next) => {

    const errors = validationResult(_req);

    if (!errors.isEmpty()) {
        return _next(convertError(errors.array()));
    }
    
    let userInfo = {
        email: _req.body.email.toLowerCase(),
        password: _req.body.password,
        profile: {
            name: _req.body.name
        }
    };

    const user = new User(userInfo);
    User.findOne(
        {
            email: _req.body.email.toLowerCase()
        },
        (err, existingUser) => {
            if (err) {
                return _next(err);
            }
            if (existingUser) {
                return _next(new Error(JSON.stringify([{field: 'email', description: "Account with that email address already exists."}])));
            }

            user.save(err => {
                if (err) {
                    return _next(err);
                }

                _req.responseData = {
                    message: "Registration successful.",
                    success: true
                };

                _next();
            });
        }
    );
};
