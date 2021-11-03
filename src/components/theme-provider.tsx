import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';

// @ts-ignore
function Theme({ children }) {
    // @ts-ignore
    const theme = useSelector((state) => state.theme);
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default Theme;
