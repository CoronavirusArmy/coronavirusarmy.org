import util from "util";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AWS from 'aws-sdk'
import { promisify } from "util"
import crypto from "crypto"

import User from "../models/user";

dotenv.config();

const randomBytesAsync = promisify(crypto.randomBytes)
const ObjectId = mongoose.Types.ObjectId;

export const convertJSON = _str => {
    let str = null;
    try {
        str = JSON.parse(_str);
    } catch (e) {
        str = _str;
    }
    return str;
}

export const convertError = errors => {
    if (typeof errors === "object")
        return new Error(
            JSON.stringify(
                errors.map(err => {
                    return {
                        description: err.msg,
                        field: err.param
                    };
                })
            )
        );
    else return new Error(errors);
};

export const toObjectId = id => {
    try {
        return ObjectId(id);
    } catch (_e) {
        return null;
    }
};

export const respond = (_req, _res, _next) => {
    if (_req.user) {
        _res.status(200).json(_req.responseData);
    } else {
        _res.status(200).json(_req.responseData);
    }
};

export const error = (err, req, res, next) => {

    if (!err) err = new Error("an error has occurred");
    var code = err.status || 500;

    util.log(util.format("Error [%s]: %s", req.url, err.message));
    if (code !== 404 && code !== 403) {
        // not logging traces for 404 and 403 errors
        util.log(util.inspect(err.stack));
    }

    if (req.xhr || req.isapi) {
        res.json({
            code: code || 1,
            success: false,
            error: err.message,
            message: err.errorDetails || err.message
        });
    } else if(err.code === 'refreshExpired') {
        res.status(403).send({
            message: convertJSON(err.message),
            success: false
        });
    } else {
        // if error is string
        res.status(400).send({
            message: convertJSON(err.message),
            success: false
        });
    }
};

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        next(new Error("Unauthorized user. Please sign in."));
    }
}

export const createToken = (user) => {
    const body = { _id: user._id, email: user.email };
    return jwt.sign({ user: body }, process.env.SESSION_SECRET,
        { expiresIn: '1d' }
    );
}
export const createRefreshToken = user => {
    const token = jwt.sign({ type: 'refresh' }, process.env.SESSION_SECRET,
        { expiresIn: '7d' }
    );
    return User.updateOne(
		{ _id: toObjectId(user._id) },
		{ refreshToken: token }
	)
		.then(() => {
			return token;
		})
		.catch(err => {
			throw err;
		});
};

export const checkRefreshToken = token => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SESSION_SECRET, err => {
            if(err) reject({
                code: "refreshExpired",
                message: "Refresh token expired - session ended."
            });
            else resolve(true);
        })
    })
}

export const upload = (base64Data) => {
    return new Promise((resolve, reject) => {
        const s3 = new AWS.S3({
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        })

        randomBytesAsync(64)
            .then(_buf => {
                const filename = `${_buf.toString('hex')}-${new Date().getTime()}.png`
                base64Data = new Buffer(base64Data.replace(/^data:image\/\w+;base64,/, ""), 'base64')
                const params = {
                    Bucket: process.env.S3_BUCKET,
                    Key: filename,
                    Body: base64Data,
                    ContentEncoding: 'base64',
                    ContentType: 'image/png'
                }
                s3.upload(params, (s3Err, data) => {
                    if (s3Err) reject(s3Err)
                    resolve(data.Location)
                })
            })
    })
}
