import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {createStyles, Grid, Paper, TextField, Theme, Chip} from '@material-ui/core';

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
        }
    }),
);

export default function CreateProject() {
    const classes = useStyles();
    const members = ["ksindell0@cocolog-nifty.com","bstroban1@usgs.gov","kdavidovsky2@woothemes.com","ybisp3@jiathis.com","fducket4@washington.edu","bdegogay5@csmonitor.com"];
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
                        <Chip label="Basic" className={classes.userChip}/>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}
