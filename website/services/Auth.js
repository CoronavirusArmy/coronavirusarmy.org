import { CommonService } from "./Common";

const login = (email, password) => {
    return CommonService.postRequest(`/auth/login`, { email: email, password: password });
};

const signup = (name, email, password, confirmPassword) => {
    return CommonService.postRequest(`/auth/signup`, { name:name, email: email, password: password, confirmPassword: confirmPassword });
};

const logout = () => {
    return CommonService.getRequest(`/auth/logout`, "");
};

export const AuthService = {
    login,
    signup,
    logout,
};
