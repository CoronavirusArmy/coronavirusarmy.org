import { Router } from "express";
import passport from "passport";
import isUrl from "is-url";
import { body, validationResult } from "express-validator";

import { isAuthenticated } from "../../helpers/utils";
import User from "../../models/user";
import { respond, error, toObjectId, convertError, upload } from "../../helpers/utils";

const validate = [
    body("name")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Name is required.")
];

const get = (_req, _res, _next) => {
    return User.findOne({ _id: toObjectId(_req.user._id) })
        .then(user => {
            _req.responseData = {
                name: user.profile.name ? user.profile.name : '',
                img: user.profile.img ? user.profile.img : '',
                phone: user.phone ? user.phone : '',
                skills: user.profile.skills ? user.profile.skills : '',
                hours: user.profile.hours ? user.profile.hours : '',
                redditUsername: user.redditUsername ? user.redditUsername : '',
                zipcode: user.zipcode ? user.zipcode : '',
                githubUsername: user.githubUsername ? user.githubUsername : ''
            };
            _next();
        })
        .catch(err => _next(err));
};

const update = (_req, _res, _next) => {
    const errors = validationResult(_req);

    if (!errors.isEmpty()) {
        return _next(convertError(errors.array()));
    }

    return User.updateOne(
        { _id: _req.user._id },
        {
            $set: {
                phone: _req.body.phone,
                redditUsername: _req.body.redditUsername,
                githubUsername: _req.body.githubUsername,
                zipcode: _req.body.zipcode,
                "profile.name": _req.body.name,
                "profile.skills": _req.body.skills,
                "profile.hours": _req.body.hours ? _req.body.hours : 0,
                "profile.img": _req.cData.img
            }
        }
    )
        .then(() => {
            _req.responseData = {
                success: true,
                message: "Account information was updated successfully."
            };
            _next();
        })
        .catch(err => _next(err));
};

const uploadImage = (_req, _res, _next) => {
    _req.cData = {};
    if (_req.body.img && !isUrl(_req.body.img)) {
        return upload(_req.body.img)
            .then(image => {
                _req.cData.img = image;
                _next();
            })
            .catch(_err => {
                return _next(_err);
            });
    } else {
        _req.cData.img = _req.body.img;
        _next();
    }
};

export default () => {
    let router = Router();

    router.put("/", passport.authenticate('jwt', { session : false }), isAuthenticated, validate, uploadImage, update, respond, error);
    router.get("/", passport.authenticate('jwt', { session : false }), isAuthenticated, get, respond, error);
    
    return router;
};
