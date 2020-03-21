import User from "../../models/user";

export const latest = (_req, _res, _next) => {
    return User.find({visible: true})
        .select('profile')
        .sort({'profile.hours': -1})
        .limit(5)
        .then(data => {
            _req.responseData = data;
            _next();
        })
        .catch(err => _next(err));
};


export const list = (_req, _res, _next) => {
    const page = _req.params.page ? (_req.params.page - 1) : 0;
    const limit = 10;

    const options = {
        pagination: true,
        page: page,
        limit: limit,
        offset: page * limit,
        sort: { time: -1, _id: -1 },
        select: 'profile time'
    }
    
    const query = { visible: true };

    return User.paginate(query, options)
        .then(data => {
            _req.responseData = data;
            _next();
        })
        .catch(err => _next(err));
};


export const all = (_req, _res, _next) => {
    const page = _req.params.page ? (_req.params.page - 1) : 0;
    const limit = 10;

    const options = {
        pagination: true,
        page: page,
        limit: limit,
        offset: page * limit,
        sort: { 'profile.hours': -1 },
        select: 'profile phone email redditUsername'
    }
    
    const query = { };

    return User.paginate(query, options)
        .then(data => {
            _req.responseData = data;
            _next();
        })
        .catch(err => _next(err));
};
