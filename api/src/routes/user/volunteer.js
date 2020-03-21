import dotenv from "dotenv";
import request from "request";

import User from "../../models/user";
import Initiative from "../../models/initiative";

import { toObjectId } from "../../helpers/utils";

dotenv.config();

const getInSyncData = (url, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            uri: `https://api.insync.team/coronavirus${url}`,
            method: "POST",
            json: { key: process.env.INSYNC_KEY, ...data }
        };
        request(options, function optionalCallback(err, response, body) {
            if (!err && response.statusCode === 200) {
                resolve(body);
            } else {
                resolve(null);
            }
        });
    });
};

export const getDetails = (_req, _res, _next) => {
    _req.cData = {};
    return User.findOne({ _id: toObjectId(_req.params.id) })
        .select("profile email time")
        .then(user => {
            if (!user) {
                return _next(new Error("Volunteer cannot be found."));
            } else {
                _req.cData.user = user;
                _next();
            }
        })
        .catch(err => _next(err));
};

export const getInitiatives = (_req, _res, _next) => {
    return Initiative.find({
        $or: [{ leader: toObjectId(_req.params.id) }, { members: { $elemMatch: { user: toObjectId(_req.params.id) } } }]
    })
        .select("name")
        .then(initiatives => {
            _req.responseData = {
                user: { profile: _req.cData.user.profile, time: _req.cData.user.time },
                initiatives: initiatives
            };
            _next();
        })
        .catch(err => _next(err));
};

export const getScreenshots = (_req, _res, _next) => {
    return getInSyncData("/screenshots", { email: _req.cData.user.email, page: _req.params.page })
        .then(data => {
            _req.responseData = { screenshots: data };
            _next();
        })
        .catch(err => _next(err));
};
