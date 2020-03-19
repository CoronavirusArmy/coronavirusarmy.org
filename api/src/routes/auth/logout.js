import { toObjectId } from "../../helpers/utils";
import User from "../../models/user";

export const logout = (_req, _res, _next) => {
    return User.updateOne({ _id: toObjectId(_req.user._id) }, { $set: { "profile.online": false } })
        .then(() => {
            _req.logout();
            _req.responseData = {
                success: true,
                message: "Logout successfully"
            };
            _next();
        });
};
