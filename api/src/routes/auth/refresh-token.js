import User from "../../models/user";
import { createToken, checkRefreshToken } from "../../helpers/utils";

const validateAndCreateToken = async refreshToken => {
    if (refreshToken != "") {
        try {
            const valid = await checkRefreshToken(refreshToken);
            if (valid === true) {
                const user = await User.findOne({ refreshToken: refreshToken });
				const token = await createToken(user);
				return token;
            }
        } catch (err) {
            throw err
        }
    } else {
        throw "There is no refresh token to check.";
    }
};

export const generateToken = (_req, _res, _next) => {
    return validateAndCreateToken(_req.body.refreshToken)
        .then(authToken => {
            _req.responseData = {
                success: true,
                token: authToken
            };
            _next();
        })
        .catch(err => {
            _next(err);
        });
};
