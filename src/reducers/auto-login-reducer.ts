import {AUTO_LOGIN} from '../types';
import { Cookie } from './cookie';

const INITIAL_STATE = {
    autoLogin: false,
    method: ''
}
const autoLoginReducer = (state = INITIAL_STATE, action: {
    type: any;
    }) => {
    if (action.type === AUTO_LOGIN) {
        try {
            // @ts-ignore
            const data = JSON.parse(Cookie.get(AUTO_LOGIN));

            if (data === null || data === undefined) {
                throw "invalid";
            }

            return {
                autoLogin: true,
                method: data.method,
                ...data
            };
        }
        catch(err) {
            Cookie.remove(AUTO_LOGIN);
            return {
                autoLogin: true
            };
        }
    }
    return state;
};

export default autoLoginReducer;
