import Cookies from 'universal-cookie';
import AppConfig from "../config/App";

const cookies = new Cookies();

export const logout = () => {
    cookies.remove(`${AppConfig.app}_user`, { path: '/', domain: AppConfig.domain });
    cookies.remove(`${AppConfig.app}_token`, { path: '/', domain: AppConfig.domain });
    cookies.remove(`${AppConfig.app}_dashboard`, { path: '/', domain: AppConfig.domain });
}

export const updateCookieUser = user => {
    let exp = new Date();
    exp.setDate(exp.getDate() + AppConfig.expiration);
    cookies.set(`${AppConfig.app}_user`, JSON.stringify(user), { expires: exp, domain: AppConfig.domain, path: '/', secure: AppConfig.secure});
}

export const updateCookieToken = token => {
    let exp = new Date();
    exp.setDate(exp.getDate() + AppConfig.expiration);
    cookies.set(`${AppConfig.app}_token`, JSON.stringify(token), { expires: exp, domain: AppConfig.domain, path: '/', secure: AppConfig.secure});
}

export const isLoggedIn = () => {
    const data = cookies.get(`${AppConfig.app}_user`);
    let user = typeof data !== 'undefined' ? data : null;
    return user && user._id;
}


export const userInfo = () => {
    const data = cookies.get(`${AppConfig.app}_user`);
    let user = typeof data !== 'undefined' ? data : null;
    return user;
}

export const getTokens = () => {
    const data = cookies.get(`${AppConfig.app}_token`);
    let token = typeof data !== 'undefined' ? data : null;

    return (token && token.authToken && token.refreshToken) ? token : null;
}