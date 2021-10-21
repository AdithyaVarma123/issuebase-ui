import { SIGN_IN, SIGN_OUT } from '../types';

export const githubOAuthLogin = (response: { error: any; }) => {
    const action = { type: SIGN_IN };
    let payload;
    if (typeof response === 'undefined' || response.error) {
        //If login fails
        payload = null;
    } else {
        payload = response;
    }
    // @ts-ignore
    action.payload = payload;
    return action;
};

export const githubOAuthLogout = () => {
    const action = { type: SIGN_OUT };
    return action;
};
