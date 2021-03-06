import React from 'react'
import clsx from 'clsx'
import MenuIcon from '@mui/icons-material/Menu'
import AssignmentIcon from '@mui/icons-material/Assignment'
import SearchIcon from '@mui/icons-material/Search'
import SettingsIcon from '@mui/icons-material/Settings'
import BugReportIcon from '@mui/icons-material/BugReport'
import EqualizerIcon from '@mui/icons-material/Equalizer'
import HomeIcon from '@mui/icons-material/Home'
import makeStyles from '@mui/styles/makeStyles'
import {
    alpha,
    AppBar,
    Avatar,
    IconButton,
    Divider,
    Drawer,
    Hidden,
    InputBase,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Switch,
    Theme,
    Toolbar,
    Typography,
    FormControlLabel,
    FormGroup,
} from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../actions/theme'
import { googleOAuthLogout } from '../actions/google-oauth'
import { showAlert } from '../actions/alert'
import {
    Route,
    BrowserRouter,
    Switch as RouterSwitch,
    Link,
} from 'react-router-dom'
import { useGoogleLogout } from 'react-google-login'
import Project from '../pages/projects/projects'
import PageMenu from './page-menu'
import CreateProject from '../pages/projects/create-project'
import CreateIssue from '../pages/issues/create-issue'
import PageTitle from './page-title'
import UserSettings from '../pages/user-settings'
import { AUTO_LOGIN, SIGN_OUT } from '../types'
import { Cookie } from '../reducers/cookie'
import Issue from '../pages/issues/issues'

const drawerWidth = 200

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        rotateEqualizerIcon: {
            transform: 'rotate(180deg)',
        },
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
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
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
            fontSize: '2em',
        },
        marginY: {
            marginLeft: '1em',
        },
        linkItem: {
            color: theme.palette.text.primary,
        },
    })
)

export default function ResponsiveDrawer() {
    // @ts-ignore
    const { auth, theme, autoLogin } = useSelector((state) => state)
    const classes = useStyles()
    const dispatch = useDispatch()

    const [mobileOpen, setMobileOpen] = React.useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const avatarMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const responseGoogle = (response: any) => {
        dispatch(googleOAuthLogout())
        dispatch(
            showAlert({
                message: 'Successfully logged out!',
            })
        )
    }

    const failureGoogle = (response: any) => {
        dispatch(googleOAuthLogout())
        dispatch(
            showAlert({
                message: 'Logout failed!',
            })
        )
    }

    const removeElement = () => {
        setAnchorEl(null)
    }

    const { signOut } = useGoogleLogout({
        // @ts-ignore
        onFailure: failureGoogle,
        // @ts-ignore
        onLogoutSuccess: responseGoogle,
        clientId:
            '349792543381-qee13qjia4l0iddd6bu7d29mi88qmm6s.apps.googleusercontent.com',
        isSignedIn: true,
    })

    const logout = () => {
        Cookie.remove(AUTO_LOGIN)
        switch (autoLogin.method) {
            case 'google': {
                signOut()
                break
            }
            case 'github': {
                dispatch({ type: SIGN_OUT })
                break
            }
        }
    }

    const pages = [
        {
            route: '/home',
            name: 'Home',
            icon: <HomeIcon />,
        },
        {
            route: '/projects',
            name: 'Projects',
            icon: <EqualizerIcon className={classes.rotateEqualizerIcon} />,
        },
        {
            route: '/issues',
            name: 'Issues',
            icon: <BugReportIcon />,
        },
        {
            route: '/assigned',
            name: 'Assignments',
            icon: <AssignmentIcon />,
        },
        {
            route: '/settings',
            name: 'Settings',
            icon: <SettingsIcon />,
        },
    ]

    const routes = [
        {
            path: '/home',
            component: <h1>Home</h1>,
        },
        {
            path: '/projects',
            component: <Project />,
        },
        {
            path: '/issues',
            component: <Issue />,
        },
        {
            path: '/assigned',
            component: <h1>Assigned</h1>,
        },
        {
            path: '/settings',
            component: <UserSettings />,
        },
        {
            path: '/create-project',
            component: <CreateProject />,
        },
        {
            path: '/create-issue',
            component: <CreateIssue />,
        },
    ]

    const toggleThemeSet = () => {
        localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark')
        dispatch(toggleTheme())
    }

    const drawer = (
        <div>
            <div className={clsx(classes.toolbar, classes.center)}>
                <Typography
                    className={clsx(classes.cornerTitle, classes.center)}
                >
                    IssueBase
                </Typography>
            </div>
            <Divider />
            <List>
                {pages.map((item) => (
                    <ListItem
                        key={item.route}
                        component={Link}
                        to={item.route}
                        className={classes.linkItem}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.name} />
                    </ListItem>
                ))}
            </List>
            <FormGroup row className={classes.center}>
                <FormControlLabel
                    control={
                        <Switch
                            color="default"
                            checked={theme.palette.mode === 'dark'}
                            onChange={toggleThemeSet}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                            name="themeToggle"
                        />
                    }
                    label="Toggle theme"
                />
            </FormGroup>
        </div>
    )

    return (
        <div className={classes.root}>
            <BrowserRouter>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                            size="large"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            className={classes.title}
                        >
                            <PageTitle />
                        </Typography>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search???"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </div>
                        <IconButton
                            onClick={avatarMenu}
                            aria-controls="avatar-menu"
                            aria-haspopup="true"
                            className={classes.marginY}
                            size="large"
                        >
                            <Avatar src={auth.user.imageUrl} />
                        </IconButton>
                        <Menu
                            id="avatar-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={removeElement}
                        >
                            <PageMenu close={removeElement} />
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer} aria-label="mailbox folders">
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
                                keepMounted: true,
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden smDown implementation="css">
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
                    <RouterSwitch>
                        {routes.map((route) => (
                            <Route path={route.path}>{route.component}</Route>
                        ))}
                        <Route path="/projects">
                            <Project />
                        </Route>
                        <Route path="/assigned">assigned</Route>
                        <Route path="/settings">
                            <UserSettings />
                        </Route>
                        <Route path="/create-project">
                            <CreateProject />
                        </Route>
                    </RouterSwitch>
                </main>
            </BrowserRouter>
        </div>
    )
}
