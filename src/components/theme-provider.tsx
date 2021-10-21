import React from 'react';
import { useSelector } from 'react-redux';
import {MuiThemeProvider} from '@material-ui/core/styles';

// @ts-ignore
function Theme({ children }) {
    // @ts-ignore
    const theme = useSelector((state) => state.theme);
    return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

export default Theme;
