import { combineReducers } from 'redux';
import authReducer from './auth-reducer';
import alertReducer from './alert-reducer';
import themeReducer from './theme-reducer';

export default combineReducers({
    auth: authReducer,
    alert: alertReducer,
    theme: themeReducer
});
