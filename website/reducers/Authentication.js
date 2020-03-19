import Cookies from "universal-cookie";
import AppConfig from "../config/App";
import { updateCookieUser } from "../helpers/Services";
import authConstants from "../constants/Authentication";

const cookies = new Cookies();

const data = cookies.get(`${AppConfig.app}_user`);
let user = typeof data !== "undefined" ? data : null;

const dataToken = cookies.get(`${AppConfig.app}_token`);
let token = typeof dataToken !== "undefined" ? dataToken : null;

const initialState = user ? { loggedIn: true, token, user } : {};

export function authentication(state = initialState, action) {
    switch (action.type) {
        case authConstants.LOGIN_REQUEST:
            return {
                ...state,
                loggingIn: true,
                user: action.user
            };
        case authConstants.LOGIN_SUCCESS:
            return {
                ...state,
                loggedIn: true,
                user: action.user,
                token: action.token
            };
        case authConstants.UPDATE_USER_STATUS:
            let profile = state.user.profile;
            profile.online = action.status;
            return {
                ...state,
                user: { ...state.user, profile: profile }
            };
        case authConstants.UPDATE_USER:
            let user = state.user;
            switch (action.data.field) {
                case "profile.name":
                    user.profile.name = action.data.value;
                    break;
                case "profile.img":
                    user.profile.img = action.data.value;
                    break;
            }
            updateCookieUser(user);
            return {
                ...state,
                user: { ...user }
            };
        case authConstants.LOGOUT:
            return {};
        default:
            return state;
    }
}
