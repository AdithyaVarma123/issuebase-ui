import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Grid, Paper, TextField, Theme, Chip, Button, IconButton } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
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

export default function CreateProject() {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const members = ["ksindell0@cocolog-nifty.com","bstroban1@usgs.gov","kdavidovsky2@woothemes.com","ybisp3@jiathis.com","fducket4@washington.edu","bdegogay5@csmonitor.com"];

    function submitForm() {
        history.push('/projects');
        dispatch(showAlert({ message: 'Project created!' }));
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={2} />
                <Grid item xs={4}>
                    <TextField id="project-name" label="Project name" variant="outlined" className={classes.standardInput}/>
                </Grid>
                <Grid item xs={4}>
                    <TextField id="repo-url" label="Repository url" variant="outlined" className={classes.standardInput} type="url" defaultValue="https://github.com/" inputProps={{ pattern: "https://github\.com/(.+)", }}/>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={2} />
                <Grid item xs={8}>
                    <Paper elevation={3} className={classes.user}>
                        {members.map(member => (
                            <Chip label={member} className={classes.userChip} onDelete={() => {}}/>
                        ))}
                        <div className={classes.userSelection}>
                            <TextField id="member-email" label="Assign " variant="outlined" className={classes.userSelectionInput}/>
                            <IconButton size="large">
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
