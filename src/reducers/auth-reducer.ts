import { SIGN_IN, SIGN_OUT } from '../types';

const INITIAL_STATE = {
    loggedIn: false,
    user: null
};

const authReducer = (state = INITIAL_STATE, action: {
    tokens: {
        access_token: string,
        id_token: string,
        refresh_token: string
    };
    type: any; payload: { tokenId: any; profileObj: any; }; }) => {
    switch (action.type) {
        case SIGN_IN: {
            let loggedIn = action.payload ? true : false;

            if (loggedIn) {
                document.cookie = JSON.stringify(action.tokens);
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
                    }
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
