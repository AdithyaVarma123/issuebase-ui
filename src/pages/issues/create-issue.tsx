import React, {useState} from 'react';
import {Button, Chip, createStyles, Grid, IconButton, Paper, TextField, Theme} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {makeStyles} from '@material-ui/core/styles';
import {showAlert} from '../../actions/alert';
import {useHistory} from 'react-router-dom';
import Yamde from 'yamde';
import {useDispatch, useSelector} from 'react-redux';
import DropzoneDialogComponent from '../../components/dropzone-dialog';

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

export default function CreateIssue() {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    let [stateFiles, setStateFiles] = React.useState<File[]>([]);
    const assigned = ["ksindell0@cocolog-nifty.com","bstroban1@usgs.gov","kdavidovsky2@woothemes.com"];
    const [text, setText] = useState('')
    // @ts-ignore
    const { theme } = useSelector((state) => state);

    function submitForm() {
        history.push('/issues');
        dispatch(showAlert({ message: 'Issue created!' }));
    }

    function onFileUpload(files: any[]) {
        setStateFiles(files);
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={2} />
                <Grid item xs={4}>
                    <TextField id="project-name" label="Project" variant="outlined" className={classes.standardInput}/>
                </Grid>
                <Grid item xs={4}>
                    <TextField id="repo-commit-ref" label="Commit ref" variant="outlined" className={classes.standardInput}/>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={2} />
                <Grid item xs={8}>
                    <TextField id="titsle" label="Issue title" variant="outlined" className={classes.standardInput}/>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={2} />
                <Grid item xs={8}>
                    <Yamde value={text} handler={setText} theme={theme.palette.type} />
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={2} />
                <Grid item xs={8}>
                    <Paper elevation={3} className={classes.user}>
                        {assigned.map(member => (
                            <Chip label={member} className={classes.userChip} onDelete={() => {}}/>
                        ))}
                        <div className={classes.userSelection}>
                            <TextField id="assigned-email" label="Assign users" variant="outlined" className={classes.userSelectionInput}/>
                            <IconButton>
                                <AddCircleIcon/>
                            </IconButton>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={2} />
                <Grid item xs={8}>
                    <Paper elevation={3} className={classes.user}>
                        {stateFiles.map(file => (
                            <Chip label={file.name} className={classes.userChip} onDelete={() => {}}/>
                        ))}
                        <div className={classes.userSelection}>
                            <DropzoneDialogComponent onSave={onFileUpload} acceptedFiles={['image/*', '.pdf', '.txt', '.log']} buttonText="Upload files" maxFileSize={3000000} files={stateFiles}/>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={5} />
                <Grid item xs={2} className={classes.submitButton}>
                    <Button variant="contained" onClick={submitForm}>Create issue</Button>
                </Grid>
            </Grid>
        </div>
    )
}
