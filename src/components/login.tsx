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
        }
    }),
);

interface State {
    amount: string;
    password: string;
    weight: string;
    weightRange: string;
    showPassword: boolean;
}

function Login() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [values, setValues] = React.useState<State>({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });
    const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    }

    const responseGoogle = (response: any) => {
        dispatch(googleOAuthLogin(response))
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

    const handleSocialLogin = async (user: any) => {
        const res = await fetch(`https://github.com/login/oauth/${user.code}`);
        return;
        dispatch(githubOAuthLogin(user));
        dispatch(
            showAlert({
                message: 'Successfully logged in!'
            })
        );
    };

    const handleSocialLoginFailure = (err: any) => {
        dispatch(githubOAuthLogin(err));
        dispatch(
            showAlert({
                message: 'Login failed!'
            })
        );
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
                                    Login
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {/*{TODO: remove autocomplete}*/}
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
                                        onSuccess={handleSocialLogin}
                                        onFailure={handleSocialLoginFailure}
                                        buttonText="Github"
                                    />
                                </div>
                            </Grid>
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
