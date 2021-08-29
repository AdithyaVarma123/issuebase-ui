import React from 'react';
import './App.css';
import ThemeProvider from './components/theme-provider';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import {CssBaseline} from '@material-ui/core';
import Alert from './components/alert';
import ResponsiveDrawer from './components/responsive-drawer';
import Login from './components/login';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

const useStyles = makeStyles({
    root: {
        margin: '0',
        fontFamily: 'Georgia, Times, serif'
    },
    '@global': {
        'html, body': {
            margin: 0,
            padding: 0,
            height: '100%',
            width: '100%'
        },
        '*, *:before, *:after': {
            boxSizing: 'inherit'
        },
        '.cssjss-advanced-global-root': {
            height: '100%',
            width: '100%'
        }
    }
});

function App() {
    const classes = useStyles();
    // @ts-ignore
    const auth = useSelector((state) => state.auth)
    return (
        <ThemeProvider>
            <CssBaseline/>
            <main className={`${classes.root} cssjss-advanced-global-root`}>
                {auth.loggedIn ? <ResponsiveDrawer/> : <Login/>}
                <Alert />
            </main>
        </ThemeProvider>
    );
}

export default App;
