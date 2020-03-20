import { CommonService } from "./Common";

const updateInfo = (img, name, phone, skills, hours, redditUsername, githubUsername, zipcode) => {
    return CommonService.putRequest(`/user/info`, { 
        img: img,
        name: name,
        phone: phone, 
        skills: skills, 
        hours: hours, 
        redditUsername: redditUsername,
        githubUsername: githubUsername,
        zipcode: zipcode
    });
};

const getInfo = () => {
    return CommonService.getRequest(`/user/info`, "");
};

const getLatest = () => {
    return CommonService.getRequest(`/user/latest`, "");
};

const getAll = page => {
    return CommonService.getRequest(`/user/${page}`, "");
};

const get = page => {
    return CommonService.getRequest(`/user/${page}/all`, "");
};

const volunteer = id => {
    return CommonService.getRequest(`/volunteer/${id}`, "");
};

const screenshots = (id, page) => {
    return CommonService.getRequest(`/volunteer/${id}/screenshots/${page}`, "");
};

export const UserService = {
    updateInfo,
    getInfo,
    getLatest,
    getAll,
    get,
    volunteer,
    screenshots,
};
