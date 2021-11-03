import React from 'react';
import './App.css';
import ThemeProvider from './components/theme-provider';
import {useDispatch, useSelector } from 'react-redux';
import {CssBaseline} from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import Alert from './components/alert';
import ResponsiveDrawer from './components/responsive-drawer';
import Login from './components/login';
import {AUTO_LOGIN} from './types';

function App() {
    // @ts-ignore
    const auth = useSelector((state) => state.auth)
    useDispatch()({ type: AUTO_LOGIN });
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider>
                <CssBaseline/>
                <main className={`cssjss-advanced-global-root`}>
                    {auth.loggedIn ? <ResponsiveDrawer/> : <Login/>}
                    <Alert />
                </main>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;
