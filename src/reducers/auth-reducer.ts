import { SIGN_IN, SIGN_OUT } from '../types';

const INITIAL_STATE = {
    loggedIn: false,
    user: null
};

const authReducer = (state = INITIAL_STATE, action: { type: any; payload: { tokenId: any; profileObj: any; }; }) => {
    switch (action.type) {
        case SIGN_IN:
            let loggedIn = action.payload ? true : false;
            return loggedIn
                ? {
                    ...state,
                    loggedIn,
                    user: {
                        tokenId: action.payload.tokenId,
                        ...action.payload.profileObj
                    }
                }
                : { ...state, loggedIn, user: null };
        case SIGN_OUT:
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};

export default authReducer;
