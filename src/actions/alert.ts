import { SHOW_ALERT, CLEAR_ALERT } from '../types';

export const showAlert = (msgConfig = { message: 'default' }) => ({
    type: SHOW_ALERT,
    payload: { ...msgConfig }
});

export const clearAlert = () => ({ type: CLEAR_ALERT });
