import Initiative from "../../models/initiative";
import { toObjectId } from "../../helpers/utils";

export const list = (_req, _res, _next) => {
    return Initiative.find({})
        .populate("leader", "profile")
        .populate("members.user", "profile")
        .sort({_id: 1})
        .then(data => {
            _req.responseData = data;
            _next();
        })
        .catch(err => _next(err));
};

export const details = (_req, _res, _next) => {
    return Initiative.findOne({ _id: toObjectId(_req.params.id) })
        .populate("leader", "profile")
        .populate("members.user", "profile")
        .then(data => {
            _req.responseData = data;
            _next();
        })
        .catch(err => _next(err));
};

export const join = (_req, _res, _next) => {
    return Initiative.updateOne(
        { _id: toObjectId(_req.params.id) },
        {
            $pull: { members: { user: toObjectId(_req.user._id) } }
        }
    ).then(res => {
        return Initiative.updateOne(
            { _id: toObjectId(_req.params.id) },
            {
                $push: { members: { user: _req.user._id } }
            }
        );
    })
    .then(data => {
        _req.responseData = {
            success: true,
            message: "Successfully joined the project."
        }
        _next();
    })
    .catch(err => _next(err));
};
