import axios from "axios";
import Router from "next/router";
import { toast } from "react-toastify";

import { updateCookieToken, getTokens, logout } from "../helpers/Services";
import AppConfig from "../config/App";

axios.defaults.baseURL = AppConfig.apiUrl;
axios.defaults.withCredentials = true;


const handleResponse = response => {
    return response.text().then(text => {
        try {
            const data = text && JSON.parse(text)
            if (!response.ok) {
                const error = (data && data.message) || response.statusText
                return Promise.reject(error)
            }
            return data
        } catch(_err) {
            return Promise.reject(text)
        }
    })
}

axios.interceptors.response.use( response => {
    return response.data ? response.data : response;
  }, err => {
    return new Promise((resolve, reject) => {
        const originalReq = err.config;
        if ( err.response && err.response.status === 401 && err.config && !err.config.__isRetryRequest )
        {
            originalReq._retry = true;
            const token = getTokens();

            const res = fetch(`${AppConfig.apiUrl}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: token.refreshToken
                }),
            }).then(res => {return handleResponse(res)}).then(res => {
                updateCookieToken({authToken: res.token, refreshToken: token.refreshToken});
                originalReq.headers['Authorization'] = 'Bearer ' + res.token;
                return axios(originalReq);
            })
            .catch(()=> {
                toast.error("Session ended, please login again...");
                logout();
                Router.push({pathname: '/login'});
            })

            resolve(res);
        }
        reject((err.response && err.response.data) ? err.response.data : err);
    })
});

const createHeader = () => {
    const token = getTokens();
    if (token)
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token.authToken;
}

const getRequest = (url, params) => {
    createHeader();
    let paramsStr = "";
    if (typeof params === "object") paramsStr = params.join("/");

    if (params) paramsStr = `/${paramsStr}`;

    return axios.get(`${url}${paramsStr}`);
};

const postRequest = (url, body) => {
    createHeader();
    return axios.post(url, body)
};

const putRequest = (url, body) => {
    createHeader();
    return axios.put(`${url}`, body);
};

export const CommonService = {
    getRequest,
    putRequest,
    postRequest
};
