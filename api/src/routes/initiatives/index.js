import Initiative from "../../models/initiative";
import { toObjectId } from "../../helpers/utils";

const doRemove = async(userId, initiativeId, memberId) => {
    try {
        const initiative = await Initiative.findOne({ _id: toObjectId(initiativeId) });
        if(initiative) {
            const valid = ((userId.toString() === memberId) || (initiative.leader.toString() === userId.toString()));

            if(valid) {
                await Initiative.updateOne(
                    { _id: toObjectId(initiativeId) },
                    {
                        $pull: { members: { user: toObjectId(memberId) } }
                    }
                )
                return {
                    success: true,
                    error: (userId.toString() === memberId) ? `You were removed from the initiative successfully.` : 'Member were removed from the initiative successfully.'
                }
            } else {
                return {
                    success: false,
                    error: 'Unauthorized'
                }
            }
        } else {
            throw 'Invalid Initiative ID.';
        }
    } catch(err) {
        return {
            success: false,
            error: err.message ? err.message : err
        }
    }
}

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

export const removeMember = (_req, _res, _next) => {

    return doRemove(_req.user._id, _req.params.id, _req.params.memberId)
        .then(res => {
            if(res.success) {
                _req.responseData = res;
                _next();
            } else {
                return _next(new Error(res.error));
            }
        })
        .catch(err => _next(err));

}