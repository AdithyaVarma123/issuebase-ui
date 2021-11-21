import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Grid, Paper, TextField, Theme, Chip, Button, IconButton } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {useHistory} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import {showAlert} from '../../actions/alert';

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
    name: string;
    users: string[];
    temp: string;
}

export default function CreateProject() {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [state, setState] = React.useState<State>({
        name: '',
        users: [],
        temp: ''
    });
    // @ts-ignore
    const { auth } = useSelector((state) => state);
    console.log(auth);

    const setItem = (item: string, value: any) => {
        setState({
            ...state,
            [item]: value.target.value
        });
    }

    async function submitForm() {
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.tokens.access_token}`
            },
            body: JSON.stringify({ project_name:state.name, users: state.users })
        };
        console.log(requestOptions);
        try {
            // @ts-ignore
            const resp = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/createProject`, requestOptions)
            await resp.json();
        }
        catch(e) {}
        history.push('/projects');
        dispatch(showAlert({ message: 'Project created!' }));
    }

    const addItem = (item: string) => {
        let data = state.temp.trim();
        // @ts-ignore
        if (data.length > 0 && state[item].indexOf(data) === -1) {
            setState(
                {
                    ...state,
                    // @ts-ignore
                    [item]: [...state[item], data],
                    temp: ''
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
                <Grid item xs={8}>
                    <TextField id="project-name" label="Project name" variant="outlined" className={classes.standardInput}
                    value={state.name} onChange={(e) => setItem('name', e)}/>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={2} />
                <Grid item xs={8}>
                    <Paper elevation={3} className={classes.user}>
                        {state.users.map(member => (
                            <Chip label={member} className={classes.userChip} onDelete={() => removeItem('users', member)}/>
                        ))}
                        <div className={classes.userSelection}>
                            <TextField id="member-email" label="Assign " variant="outlined" className={classes.userSelectionInput}
                                       value={state.temp} onChange={(e) => setItem('temp', e)}/>
                            <IconButton size="large" onClick={() => addItem('users')}>
                                <AddCircleIcon/>
                            </IconButton>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={5} />
                <Grid item xs={2} className={classes.submitButton}>
                    <Button variant="contained" onClick={submitForm}>Create project</Button>
                </Grid>
            </Grid>
        </div>
    );
}
