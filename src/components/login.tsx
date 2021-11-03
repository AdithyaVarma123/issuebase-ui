import React from 'react';
import clsx from 'clsx';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Theme,
    Typography,
} from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {GoogleLogin, useGoogleLogout} from 'react-google-login';
import {FcGoogle} from 'react-icons/fc';
import LoginGithub from './github/login-github';
import {googleOAuthLogin} from '../actions/google-oauth';
import {showAlert} from '../actions/alert';
import {useDispatch, useSelector} from 'react-redux';
import {githubOAuthLogin} from '../actions/github-oauth';
import {
    autoLogin,
    checkUserName,
    createUser,
    githubLoginForIssueBase,
    googleLoginForIssueBase,
    oauthLogin
} from '../actions/oauth';
import RefreshIcon from '@mui/icons-material/Refresh';
import {AUTO_LOGIN, SIGN_IN} from '../types';
import {Cookie} from '../reducers/cookie';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        pos: {
            marginBottom: 12,
        },
        formInput: {
            minWidth: '80%'
        },
        title: {
            fontSize: 32
        },
        center: {
            display: 'flex',
            justifyContent: 'center'
        },
        marginTop: {
            marginTop: '1em'
        },
        marginY: {
            marginTop: '1em',
            marginBottom: '1em'
        },
        marginX: {
            marginRight: '1em',
            marginLeft: '1em'
        },
        thickDivider: {
            height: 3
        },
        phone: {
            width: '100%'
        }
    }),
);

interface State {
    password: string;
    confirmPassword: string;
    passwordErr: boolean;
    email: string;
    showPassword: boolean;
    phone: string;
    phoneCode: string;
    name: string;
}

enum PageState {
    Login,
    NewUser,
    SignUp
}

function Login() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [pageState, setPageState] = React.useState<PageState>(PageState.Login);

    const initValueState = {
        password: '',
        confirmPassword: '',
        showPassword: false,
        passwordErr: false,
        phone: '',
        phoneCode: '',
        email: '',
        name: ''
    };
    const [values, setValues] = React.useState<State>(initValueState);

    let title;
    const [usernameInput, setUsernameInput] = React.useState<string>('');
    let [usernameError, setUsernameError] = React.useState<boolean>(false);

    let cardContent;
    const [dataState, setDataState] = React.useState<any>({ githubState: false, oauthState: false });
    // @ts-ignore
    const autoLoginSelector = useSelector(state => state.autoLogin);
    // @ts-ignore
    const auth = useSelector(state => state.auth);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (autoLoginSelector.method === 'github' && !auth.loggedIn && !dataState.githubState) {
        setDataState({ ...dataState, githubState: true });
        (async () => {
            const res = await autoLogin(autoLoginSelector.tokens, 'github', autoLoginSelector.tokens.github_access_token);
            if (typeof res === 'object') {
                const temp: {
                    payload: {
                        profileObj: any
                    },
                    tokens: {
                        id_token: string,
                        access_token: string,
                        refresh_token: string,
                        github_access_token: string
                    },
                    type: string,
                    mode: string
                } = {
                    payload: {
                        profileObj: undefined
                    },
                    tokens: {
                        id_token: '',
                        access_token: '',
                        refresh_token: '',
                        github_access_token: ''
                    },
                    type: SIGN_IN,
                    mode: 'github'
                };
                temp.tokens = {
                    id_token: res.id_token,
                    access_token: res.access_token,
                    refresh_token: res.refresh_token,
                    github_access_token: res.github_access_token
                };
                temp.payload.profileObj = {
                    username: res.username,
                    imageUrl: res.avatar_url
                };
                dispatch(temp);
            }
            else {
                Cookie.remove(AUTO_LOGIN);
                setDataState({ ...dataState, githubState: false });
            }
        })();
    }

    if (autoLoginSelector.method === 'oauth' && !auth.loggedIn && !dataState.oauthState) {
        setDataState({ ...dataState, oauthState: true });
        (async () => {
            const res = await autoLogin(autoLoginSelector.tokens, 'oauth');
            if (typeof res === 'object') {
                const temp: {
                    payload: {
                        profileObj: any
                    },
                    tokens: {
                        id_token: string,
                        access_token: string,
                        refresh_token: string
                    },
                    type: string,
                    mode: string
                } = {
                    payload: {
                        profileObj: undefined
                    },
                    tokens: {
                        id_token: '',
                        access_token: '',
                        refresh_token: ''
                    },
                    type: SIGN_IN,
                    mode: 'oauth'
                };
                temp.tokens = {
                    id_token: res.id_token,
                    access_token: res.access_token,
                    refresh_token: res.refresh_token
                };
                temp.payload.profileObj = {};
                dispatch(temp);
            }
            else {
                Cookie.remove(AUTO_LOGIN);
                setDataState({ ...dataState, oauthState: false });
            }
        })();
    }

    const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (prop) {
            case 'phoneCode': {
                if (!(/^\d+$/.test(event.target.value))) {
                    dispatch(
                        showAlert({
                            message: 'Enter a valid phone code!'
                        })
                    )
                }
                break;
            }
            case 'phone': {
                if (!(/^\d+$/.test(event.target.value))) {
                    dispatch(
                        showAlert({
                            message: 'Enter a valid phone number!'
                        })
                    )
                }
                break;
            }
            case 'confirmPassword': {
                setValues({ ...values, [prop]: event.target.value, passwordErr: values.password !== event.target.value });
                return;
            }
        }

        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    }

    const responseGoogle = async (response: any, skip = false) => {
        if (!autoLoginSelector.autoLogin) {
            return;
        }

        let temp = dataState;
        if (autoLoginSelector.hasOwnProperty("method")) {
            temp = googleOAuthLogin(response);
            temp.mode = 'google';
            temp.tokens = await autoLogin(autoLoginSelector.tokens, 'google', temp.payload.tokenObj.access_token);
            setDataState(temp)
            dispatch(temp)
            dispatch(
                showAlert({
                    message: 'Successfully logged in!'
                })
            );
            return;
        }

        if (!skip) {
            temp = googleOAuthLogin(response);
            setDataState(temp)
        }
        else {
            temp.username = usernameInput;
            temp.phone = values.phoneCode + values.phone;
        }
        const res: any = await googleLoginForIssueBase(temp);
        temp.mode = 'google';
        if (res.state === 'new_user') {
            setPageState(PageState.NewUser);
            return;
        }
        else {
            temp.tokens = res.tokens;
        }
        dispatch(temp)
        dispatch(
            showAlert({
                message: 'Successfully logged in!'
            })
        );
    }

    const failureGoogle = (response: any) => {
        dispatch(googleOAuthLogin(response));
        dispatch(
            showAlert({
                message: 'Login failed!'
            })
        );
    }

    const handleGithubAtLogin = async (user: any, skip = false) => {
        let temp = dataState;
        if (!skip) {
            temp = githubOAuthLogin(user)
            temp.code = user.code;
            temp.mode = 'github';
            setDataState(temp)
        }
        else {
            temp.username = usernameInput;
            temp.phone = values.phoneCode + values.phone;
        }
        const res: any = await githubLoginForIssueBase(temp)
        if (res.state === 'new_user') {
            setPageState(PageState.NewUser);
            return;
        } else {
            temp.tokens = res.tokens;
            temp.payload.profileObj = res.user;
            setDataState(temp)
        }
        dispatch(temp)
        dispatch(
            showAlert({
                message: 'Successfully logged in!'
            })
        );
    };

    const handleGithubAtFailure = (err: any) => {
        dispatch(githubOAuthLogin(err));
        dispatch(
            showAlert({
                message: 'Login failed!'
            })
        );
    }

    const handleUsernameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setUsernameInput(event.target.value);
        refreshUsernames(event.target.value as string);
    };

    const refreshUsernames = async (username ?: string) => {
        const specialChars = `/[!@#$%^&*()_+-=[]{};':"\\|,.<>/?]+/;`
        let data = username ? username : usernameInput;
        if (specialChars.split('').some(char => data.includes(char))) {
            dispatch(
                showAlert({
                    message: 'Username cannot have special characters!'
                })
            )
            return;
        }

        if (data.match(/^\d/)) {
            dispatch(
                showAlert({
                    message: 'Username cannot begin with a number!'
                })
            )
            return;
        }

        setUsernameError(await checkUserName(data));
    };

    const submitNewUser = async () => {
        if (values.phone.length !== 10) {
            dispatch(
                showAlert({
                    message: 'Please enter a valid phone number!'
                })
            )
            return;
        }

        if (values.phoneCode.length === 0 || values.phoneCode.length > 3) {
            dispatch(
                showAlert({
                    message: 'Please enter a valid phone code!'
                })
            )
            return;
        }

        if (usernameError) {
            dispatch(
                showAlert({
                    message: 'Please enter a valid username!'
                })
            )
            return;
        }

        if (pageState === PageState.SignUp) {

            if (values.password !== values.confirmPassword) {
                dispatch(
                    showAlert({
                        message: 'Password and confirm password field must match!'
                    })
                )
                return;
            }

            if (!(emailRegex.test(values.email))) {
                dispatch(
                    showAlert({
                        message: 'Enter a valid email address!'
                    })
                )
                return;
            }

            const res = await createUser(values.email, values.password, values.phoneCode + values.phone, usernameInput, values.name);

            // @ts-ignore
            if (res.hasOwnProperty('error')) {
                dispatch(
                    showAlert({
                        // @ts-ignore
                        message: res.message
                    })
                )
            }
            else {
                dispatch(
                    showAlert({
                        // @ts-ignore
                        message: res.message
                    })
                )
                setValues(initValueState);
                setUsernameInput("");
                setPageState(PageState.Login);
            }
            return;
        }

        switch (dataState.mode) {
            case 'google': {
                return responseGoogle(undefined, true);
            }
            case 'github': {
                return handleGithubAtLogin(undefined, true);
            }
        }
    };

    const standardLogin = async () => {
        if (!(emailRegex.test(values.email))) {
            dispatch(
                showAlert({
                    message: 'Please enter a valid email address!'
                })
            )
            return;
        }

        if (values.password.length === 0) {
            dispatch(
                showAlert({
                    message: 'Please enter a valid password!'
                })
            )
            return;
        }

        const res = await oauthLogin(values.email, values.password);

        // @ts-ignore
        if (res.hasOwnProperty('error')) {
            dispatch(
                showAlert({
                    // @ts-ignore
                    message: res.message
                })
            )
        }
        else {
            dispatch({
                type: SIGN_IN,
                // @ts-ignore
                tokens: res.tokens,
                mode: 'oauth',
                payload: { profileObj: {} }
            })
        }
    };

    const { signOut } = useGoogleLogout({
        // @ts-ignore
        onFailure: failureGoogle,
        // @ts-ignore
        onLogoutSuccess: () => {setPageState(PageState.Login)},
        clientId: "349792543381-qee13qjia4l0iddd6bu7d29mi88qmm6s.apps.googleusercontent.com",
        isSignedIn: true
    });

    const cancelNewUserOrSignUp = () => {
        if (pageState === PageState.SignUp) {
            setValues(initValueState);
            setUsernameInput("");
        }
        else {
            switch (dataState.mode) {
                case 'google': {
                    signOut();
                    break;
                }
            }
        }
        setPageState(PageState.Login);
    };

    const passwordField = (
        <FormControl className={classes.formInput} variant="outlined">
            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
            <OutlinedInput
                label="Password"
                id="standard-adornment-password"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    );

    const SignUp = (
        <>
            <Grid item xs={12} className={classes.center}>
                <TextField id="name" label="Name" variant="outlined" className={classes.formInput}
                           value={values.name}
                           onChange={handleChange('name')}
                />
            </Grid>
            <Grid item xs={12} className={classes.center}>
                <TextField id="email_s" label="Email" variant="outlined" className={classes.formInput}
                       value={values.email}
                       onChange={handleChange('email')}
                />
            </Grid>
            <Grid item xs={12} className={classes.center}>
                {passwordField}
            </Grid>
            <Grid item xs={12} className={classes.center}>
                <FormControl className={classes.formInput} variant="outlined">
                    <InputLabel htmlFor="standard-adornment-confirm-password">Confirm password</InputLabel>
                    <OutlinedInput
                        label="Confirm password"
                        id="standard-adornment-confirm-password"
                        type={values.showPassword ? 'text' : 'password'}
                        value={values.confirmPassword}
                        error={values.passwordErr}
                        onChange={handleChange('confirmPassword')}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </Grid>
        </>
    );

    switch (pageState) {
        case PageState.Login: {
            title = 'Login';
            cardContent = <Grid item xs={12}>
                <form noValidate autoComplete="off">
                    <Grid container spacing={3} direction="row">
                        <Grid item xs={12} className={classes.center}>
                            <TextField id="email" label="Email" variant="outlined" className={classes.formInput} value={values.email} onChange={handleChange('email')}/>
                        </Grid>
                        <Grid item xs={12} className={classes.center}>
                            { passwordField }
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={clsx(classes.center, classes.marginTop)}>
                        <Button variant="contained" color="primary" className={classes.formInput} onClick={standardLogin}>Login</Button>
                    </Grid>
                </form>

                <Grid container alignItems="center" spacing={3} className={classes.marginY}>
                    <Grid item xs>
                        <Divider className={classes.thickDivider}/>
                    </Grid>
                    <Grid item>
                        <Typography>or log in with</Typography>
                    </Grid>
                    <Grid item xs>
                        <Divider className={classes.thickDivider}/>
                    </Grid>
                </Grid>

                <div className={classes.center}>
                    <GoogleLogin
                        clientId="349792543381-qee13qjia4l0iddd6bu7d29mi88qmm6s.apps.googleusercontent.com"
                        buttonText="Login"
                        render={renderProps => (
                            <Button onClick={renderProps.onClick} disabled={renderProps.disabled} variant="contained"
                                    startIcon={<FcGoogle/>} style={{marginRight: '1em'}}>Google</Button>
                        )}
                        onSuccess={responseGoogle}
                        onFailure={failureGoogle}
                        isSignedIn={true}
                        cookiePolicy={'single_host_origin'}
                    />
                    <LoginGithub
                        clientId="cda139b5c412fe46a467"
                        onSuccess={handleGithubAtLogin}
                        onFailure={handleGithubAtFailure}
                        buttonText="Github"
                    />
                    <Button variant="contained" onClick={() => { setPageState(PageState.SignUp) }}>
                        Sign up
                    </Button>
                </div>
            </Grid>
            break;
        }
        case PageState.SignUp:
        case PageState.NewUser: {
            title = 'Setup';
            cardContent = <Grid item xs={12}>
                <form noValidate autoComplete="off">
                    <Grid container spacing={3} direction="row">
                        {SignUp}
                        <Grid item xs={12} className={classes.center}>
                            <FormControl className={classes.formInput} variant="outlined">
                                <InputLabel htmlFor="standard-adornment-username">Username</InputLabel>
                                <OutlinedInput
                                    label="Username"
                                    id="standard-adornment-username"
                                    type="text"
                                    className={classes.formInput}
                                    value={usernameInput}
                                    error={usernameError}
                                    onChange={handleUsernameChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label='refresh'
                                                onClick={() => {refreshUsernames()}}
                                                size="large">
                                                <RefreshIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} className={classes.center}>
                            <TextField id="code" label="CC" variant="outlined" value={values.phoneCode} onChange={handleChange('phoneCode')}/>
                        </Grid>
                        <Grid item xs={10} className={classes.center}>
                            <TextField id="phone" label="Phone" variant="outlined" className={classes.phone} value={values.phone} onChange={handleChange('phone')}/>
                        </Grid>
                        <Grid item xs={12} className={classes.center}>
                            <Button variant="contained" className={classes.marginX} color="error" onClick={cancelNewUserOrSignUp}>Cancel</Button>
                            <Button variant="contained" color="primary" onClick={submitNewUser} className={classes.marginX}>Continue</Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
            break;
        }
    }

    return (
        <Grid container spacing={0} direction="row" justifyContent="center" alignItems="center" style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            <Grid item xs={4} className={classes.root}>
                <Card className={classes.root}>
                    <CardContent>
                        <Grid container spacing={3} direction="row">
                            <Grid item xs={12} className={classes.center}>
                                <Typography className={classes.title}>
                                    {title}
                                </Typography>
                            </Grid>
                            { cardContent }
                        </Grid>
                    </CardContent>
                    <CardActions>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    )
}
export default Login;
