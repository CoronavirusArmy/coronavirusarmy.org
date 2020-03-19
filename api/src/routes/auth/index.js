import { Router } from "express";
import passport from 'passport'

import { validate as validateLogin, login } from "./login";
import { validate as validateSignUp, signup } from "./signup";
import { logout } from "./logout";
import { generateToken } from "./refresh-token";

export default () => {
    let router = Router();

    router.post("/login", validateLogin, login);
    router.post("/signup", validateSignUp, signup);
    router.get('/logout', passport.authenticate('jwt', { session : false }), logout);

    router.post('/refresh', generateToken);

    return router;
};
