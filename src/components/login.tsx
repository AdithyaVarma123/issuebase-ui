import React from 'react';
import clsx from 'clsx';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    createStyles, Divider, FormControl,
    Grid, IconButton, InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Theme,
    Typography,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import {GoogleLogin} from 'react-google-login';
import {FcGoogle} from 'react-icons/fc';
import LoginGithub from './github/login-github';
import {googleOAuthLogin} from '../actions/google-oauth';
import { showAlert } from '../actions/alert';
import {useDispatch} from 'react-redux';
import {githubOAuthLogin} from '../actions/github-oauth';
import {checkUserName, googleLoginForIssueBase} from '../actions/oauth';
import RefreshIcon from '@material-ui/icons/Refresh';

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
        thickDivider: {
            height: 3
        },
        phone: {
            width: '100%'
        }
    }),
);

interface State {
    amount: string;
    password: string;
    weight: string;
    weightRange: string;
    showPassword: boolean;
    phone: string;
    phoneCode: string;
}

enum PageState {
    Login,
    NewUser
}

function Login() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [pageState, setPageState] = React.useState<PageState>(PageState.Login)
    const [values, setValues] = React.useState<State>({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
        phone: '',
        phoneCode: ''
    });
    let title;
    const [usernameInput, setUsernameInput] = React.useState<string>('');
    let [usernameError, setUsernameError] = React.useState<boolean>(false);
    let cardContent;
    const [dataState, setDataState] = React.useState<any>();

    const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });

        switch (prop) {
            case 'phoneCode': {
                if (!(/^\d+$/.test(event.target.value))) {
                    dispatch(
                        showAlert({
                            message: 'Enter a valid phone code!'
                        })
                    )
                    return;
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
                    return;
                }
                break;
            }
        }
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    }

    const responseGoogle = async (response: any, skip = false) => {
        let temp = dataState;
        if (!skip) {
            temp = googleOAuthLogin(response);
            setDataState(temp)
        }
        else {
            temp.username = usernameInput;
            temp.phone = values.phoneCode + values.phone;
        }
        const res: any = await googleLoginForIssueBase(temp)
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

    const handleGithubAtLogin = async (user: any) => {
        const res = await fetch(`https://github.com/login/oauth/${user.code}`);
        return;
        dispatch(githubOAuthLogin(user));
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

    const submitNewUser = () => {
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

        responseGoogle(undefined, true);
    };

    if (pageState === PageState.Login) {
        title = 'Login';
        cardContent = <Grid item xs={12}>
            <form noValidate autoComplete="off">
                <Grid container spacing={3} direction="row">
                    <Grid item xs={12} className={classes.center}>
                        <TextField id="email" label="Email" variant="outlined" className={classes.formInput}/>
                    </Grid>
                    <Grid item xs={12} className={classes.center}>
                        <FormControl className={classes.formInput} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange('password')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                labelWidth={70}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} className={clsx(classes.center, classes.marginTop)}>
                    <Button variant="contained" color="primary" className={classes.formInput}>Login</Button>
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
            </div>
        </Grid>
    }
    else {
        title = 'Setup';
        cardContent = <Grid item xs={12}>
            <form noValidate autoComplete="off">
                <Grid container spacing={3} direction="row">
                    <Grid item xs={12} className={classes.center}>
                        <TextField id="username" label="Username" variant="outlined" error={usernameError}
                                   className={classes.formInput}
                                   value={usernameInput}
                                   onChange={handleUsernameChange}/>
                        <IconButton
                            color="primary"
                            aria-label='refresh'
                            onClick={() => {refreshUsernames()}}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={2} className={classes.center}>
                        <TextField id="code" label="Code" variant="outlined" value={values.phoneCode} onChange={handleChange('phoneCode')}/>
                    </Grid>
                    <Grid item xs={10} className={classes.center}>
                        <TextField id="phone" label="Phone" variant="outlined" className={classes.phone} value={values.phone} onChange={handleChange('phone')}/>
                    </Grid>
                    <Grid item xs={12} className={classes.center}>
                        <Button variant="contained" color="primary" onClick={submitNewUser}>Continue</Button>
                    </Grid>
                </Grid>
            </form>
        </Grid>
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
                        {/*{<Button>Sign up</Button>}*/}
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    )
}
export default Login;
