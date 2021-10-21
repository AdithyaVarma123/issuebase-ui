import { TOGGLE_THEME } from '../types';
import { createTheme } from '@material-ui/core/styles';
import {blue, green, lightBlue, pink, red, yellow} from '@material-ui/core/colors';
/*If no other key-val pairs are set on the custom theme it retains
all the default MUI theme values. So for a simple switch to dark mode this
will suffice.
Actually switching to dark doesn't change palette values so I have
to do that manually
light mode main color: #4285F4
dark mode main color: #fff
*/

let INITIAL_STATE = {};
const LIGHT_MODE_STATE = createTheme({
    palette: {
        type: 'light',
        primary: blue,
        secondary: pink,
        error: red,
        warning: yellow,
        info: lightBlue,
        success: green
    }
});
const DARK_MODE_STATE = createTheme({
    palette: {
        type: 'dark',
        primary: blue,
        secondary: pink,
    }
});

/* Choose the default theme as the users system preferences */
let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
matched
    ? (INITIAL_STATE = { ...DARK_MODE_STATE })
    : (INITIAL_STATE = { ...LIGHT_MODE_STATE });

const themeReducer = (state = INITIAL_STATE, action: { type: any; }) => {
    switch (action.type) {
        case TOGGLE_THEME:
            /*
                There is no payload we just replace the theme obj/state with the
                opposite of whatever type is
            */
            // @ts-ignore
            return state.palette.type === 'light'
                ? { ...DARK_MODE_STATE }
                : { ...LIGHT_MODE_STATE };
        default:
            return state;
    }
};

export default themeReducer;
