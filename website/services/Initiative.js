import { CommonService } from "./Common";

const get = () => {
    return CommonService.getRequest(`/initiatives`, "");
};

const details = id => {
    return CommonService.getRequest(`/initiative/${id}`, "");
};

const join = id => {
    return CommonService.putRequest(`/initiative/${id}`, "");
};

export const InitiativeService = {
    get,
    details,
    join,
};
