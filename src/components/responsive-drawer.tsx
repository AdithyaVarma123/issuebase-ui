import React from 'react';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import SearchIcon from '@material-ui/icons/Search';
import {makeStyles} from '@material-ui/core/styles';
import {
    alpha,
    AppBar, Avatar, IconButton, Button, createStyles, Divider, Drawer, Hidden, InputBase, List, ListItem, ListItemIcon,
    ListItemText, Menu, MenuItem, Switch, Theme, Toolbar, Typography, FormControlLabel, FormGroup
} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {toggleTheme} from '../actions/theme';
import {googleOAuthLogin, googleOAuthLogout} from '../actions/google-oauth';
import {showAlert} from '../actions/alert';
import {useGoogleLogout} from 'react-google-login';

const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        appBar: {
            [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: drawerWidth,
            },
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        drawerPaper: {
            width: drawerWidth,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        title: {
            flexGrow: 1,
        },
        center: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
            },
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(1),
                width: 'auto',
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
        cornerTitle: {
            fontSize: '2em'
        },
        marginY: {
            marginLeft: '1em'
        }
    }),
);

export default function ResponsiveDrawer() {
    const classes = useStyles();
    // @ts-ignore
    const { auth, theme } = useSelector((state) => state);
    console.log(auth);
    const dispatch = useDispatch();

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const avatarMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const responseGoogle = (response: any) => {
        dispatch(googleOAuthLogout())
        dispatch(
            showAlert({
                message: 'Successfully logged out!'
            })
        );
    }

    const failureGoogle = (response: any) => {
        dispatch(googleOAuthLogout());
        dispatch(
            showAlert({
                message: 'Logout failed!'
            })
        );
    }

    const removeElement = () => {
        setAnchorEl(null);
    };

    const { signOut } = useGoogleLogout({
        // @ts-ignore
        onFailure: failureGoogle,
        // @ts-ignore
        onLogoutSuccess: responseGoogle,
        clientId: "349792543381-qee13qjia4l0iddd6bu7d29mi88qmm6s.apps.googleusercontent.com",
        isSignedIn: true
    });

    const drawer = (
        <div>
            <div className={clsx(classes.toolbar, classes.center)}>
                <Typography className={clsx(classes.cornerTitle, classes.center)}>IssueBase</Typography>
            </div>
            <Divider />
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <FormGroup row className={classes.center}>
                <FormControlLabel
                    control={
                        <Switch
                            color='default'
                            checked={theme.palette.type === 'dark'}
                            onChange={() => dispatch(toggleTheme())}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                            name='themeToggle'
                        />
                    }
                    label="Toggle theme"
                />
            </FormGroup>
        </div>
    );


    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap className={classes.title}></Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                    <IconButton onClick={avatarMenu} aria-controls="avatar-menu" aria-haspopup="true" className={classes.marginY}>
                        <Avatar src={auth.user.imageUrl} />
                    </IconButton>
                    <Menu
                        id="avatar-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={removeElement}
                    >
                        <MenuItem onClick={signOut}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor="left"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
            </main>
        </div>
    );
}
