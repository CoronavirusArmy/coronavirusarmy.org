import User from "../../models/user";
import Initiative from "../../models/initiative";

import { toObjectId } from "../../helpers/utils";

export const getDetails = (_req, _res, _next) => {
    _req.cData = {};
    return User.findOne({ _id: toObjectId(_req.params.id) })
        .select('profile')
        .then(user => {
            if(!user){
                return _next(new Error('Volunteer cannot be found.'))
            } else {
                _req.cData.user = user;
                _next();
            }   
        })
        .catch(err => _next(err));
};

export const getInitiatives = (_req, _res, _next) => {
    
    return Initiative.find({
            $or: [
                { leader: toObjectId(_req.params.id) },
                { members: { $elemMatch: { user: toObjectId(_req.params.id) } } }
            ]
        })
        .select('name')
        .then(initiatives => {
            _req.responseData = { 
                user: _req.cData.user,
                initiatives: initiatives
            };
            _next();
        })
        .catch(err => _next(err));
    
}