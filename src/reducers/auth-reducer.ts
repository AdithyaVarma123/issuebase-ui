import {AUTO_LOGIN, SIGN_IN, SIGN_OUT} from '../types';
import {Cookie} from './cookie';

const INITIAL_STATE = {
    loggedIn: false,
    user: null
};

const authReducer = (state = INITIAL_STATE, action: {
    mode: 'google' | 'github' | 'oauth';
    tokens: {
        access_token: string,
        id_token: string,
        refresh_token: string
    };
    username: string;
    type: any; payload: { tokenId: any; profileObj: any; }; }) => {
    switch (action.type) {
        case SIGN_IN: {
            let loggedIn = action.payload ? true : false;

            if (loggedIn) {
                Cookie.remove(AUTO_LOGIN);
                Cookie.set(AUTO_LOGIN, JSON.stringify({ method: action.mode, tokens: action.tokens}), new Date(new Date().getTime() + 86400000));
            }

            return loggedIn
                ? {
                    ...state,
                    loggedIn,
                    user: {
                        ...action.payload.profileObj
                    },
                    tokens: {
                        ...action.tokens
                    },
                    username: action.username
                }
                : { ...state, loggedIn, user: null };
        }
        case SIGN_OUT: {
            return { ...INITIAL_STATE };
        }
        default: {
            return state;
        }
    }
};

export default authReducer;
