import React from 'react';
import { Button, Chip, Grid, IconButton, Paper, TextField, Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import makeStyles from '@mui/styles/makeStyles';
import {showAlert} from '../../actions/alert';
import {useHistory} from 'react-router-dom';
import Yamde from 'yamde';
import {useDispatch, useSelector} from 'react-redux';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        standardInput: {
            width: '100%'
        },
        user: {
            width: '100%',
            minHeight: '8em',
            padding: '0.5em'
        },
        userChip: {
            margin: '0.5em'
        },
        userSelection: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1em',
            width: '100%',
        },
        userSelectionInput: {
            width: '40%'
        },
        submitButton: {
            display: 'flex',
            justifyContent: 'center'
        }
    }),
);

interface State {
    project: string;
    commitRef: string;
    title: string;
    body: string;
    users: string[];
    tags: string[];
    temp: string;
    tempTwo: string;
    deadline: Date
}

export default function CreateIssue() {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [state, setState] = React.useState<State>({
        project: '',
        commitRef: '',
        title: '',
        body: '',
        users: [],
        tags: [],
        temp: '',
        tempTwo: '',
        deadline: new Date()
    });
    // @ts-ignore
    const { theme, auth } = useSelector((state) => state);

    const submitForm = async () => {
        if (state.project === '') {
            dispatch(showAlert({
                message: 'Project ID is required',
            }));
            return;
        }

        if (state.commitRef === '') {
            dispatch(showAlert({
                message: 'Commit ref is required',
            }));
            return;
        }

        if (state.title === '') {
            dispatch(showAlert({
                message: 'Title is required',
            }));
            return;
        }

        if (state.body === '') {
            dispatch(showAlert({
                message: 'Body is required',
            }));
            return;
        }

        try {
            const users = [...state.users, auth.username];

            let priority = 1;
            if (state.tags.indexOf('medium') > -1) {
                priority = 2;
            }
            else if (state.tags.indexOf('high') > -1) {
                priority = 3;
            }

            const resp = await fetch(`${process.env.REACT_APP_BASE_URL}/issues/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                body: JSON.stringify({
                    project_id: state.project,
                    deadline: Math.ceil(state.deadline.getTime() / 1000),
                    users: users,
                    tags: state.tags,
                    priority: priority,
                    heading: state.title,
                    body: state.body,
                })
            });
            if (resp.status !== 200) {
                dispatch(showAlert({
                    message: 'Error creating issue!',
                }));
                return;
            }
        }
        catch(e) {
            dispatch(showAlert({
                message: 'Error creating issue!',
            }));
            return;
        }

        history.push('/issues');
        dispatch(showAlert({ message: 'Issue created!' }));
    }

    const setText = (text: any) => {
        setState({
            ...state,
            body: text
        });
    }

    const setItem = (item: string, value: any) => {
        if (item === 'deadline') {
            value = {
                target: {
                    value: value
                }
            }
        }
        setState({
            ...state,
            [item]: value.target.value
        });
    }

    const addItem = (item: string) => {
        let data = state.temp.trim();
        let action = 'temp';
        if (item === 'tags') {
            data = state.tempTwo.trim();
            action = 'tempTwo';
        }
        // @ts-ignore
        if (data.length > 0 && state[item].indexOf(data) === -1) {
            setState(
                {
                    ...state,
                    // @ts-ignore
                    [item]: [...state[item], data],
                    [action]: ''
                }
            );
        }
    }

    const removeItem = (item: string, data: string) => {
        setState({
            ...state,
            // @ts-ignore
            [item]: state[item].filter(e => e !== data)
        });
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={2} />
                <Grid item xs={4}>
                    <TextField id="project-name" label="Project ID" variant="outlined" className={classes.standardInput}
                    value={state.project} onChange={(e) => setItem('project', e)}/>
                </Grid>
                <Grid item xs={4}>
                    <TextField id="repo-commit-ref" label="Commit ref" variant="outlined" className={classes.standardInput}
                               value={state.commitRef} onChange={(e) => setItem('commitRef', e)}/>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={2} />
                <Grid item xs={4}>
                    <TextField id="title" label="Issue title" variant="outlined" className={classes.standardInput}
                               value={state.title} onChange={(e) => setItem('title', e)}/>
                </Grid>
                <Grid item xs={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            renderInput={(props) => <TextField {...props} />}
                            label="DateTimePicker"
                            value={state.deadline}
                            onChange={(newValue) => setItem('deadline', newValue)}
                            className={classes.standardInput}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={2} />
                <Grid item xs={8}>
                    <Yamde value={state.body} handler={setText} theme={theme.palette.mode}/>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={2} />
                <Grid item xs={8}>
                    <Paper elevation={3} className={classes.user}>
                        {state.users.map(member => (
                            <Chip label={member} className={classes.userChip} onDelete={() => removeItem('users', member)}/>
                        ))}
                        <div className={classes.userSelection}>
                            <TextField id="assigned-email" label="Assign users" variant="outlined" className={classes.userSelectionInput}
                                       value={state.temp} onChange={(e) => setItem('temp', e)}/>
                            <IconButton size="large" onClick={() => addItem('users')}>
                                <AddCircleIcon/>
                            </IconButton>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={2} />
                <Grid item xs={8}>
                    <Paper elevation={3} className={classes.user}>
                        {state.tags.map(member => (
                            <Chip label={member} className={classes.userChip} onDelete={() => removeItem('tags', member)}/>
                        ))}
                        <div className={classes.userSelection}>
                            <TextField id="assigned-email" label="Issue tags" variant="outlined" className={classes.userSelectionInput}
                                       value={state.tempTwo} onChange={(e) => setItem('tempTwo', e)}/>
                            <IconButton size="large" onClick={() => addItem('tags')}>
                                <AddCircleIcon/>
                            </IconButton>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={5} />
                <Grid item xs={2} className={classes.submitButton}>
                    <Button variant="contained" onClick={submitForm}>Create issue</Button>
                </Grid>
            </Grid>
        </div>
    );
}
