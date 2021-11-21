import React from 'react';
import {
    Badge,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    ImageList,
    IconButton,
    Theme,
    Typography,
    Button
} from '@mui/material';
import { Pagination } from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormDialog from "./create";
import {connect} from "react-redux";
import {withStyles} from "@mui/styles";

const styles = (theme: Theme) => ({
    spinner: {
        display: 'flex',
        justifyContent: 'center'
    },
    projectTitle: {
        fontSize: 20
    },
    gridSpace: {
        margin: '2em'
    },
    title: {
        fontSize: 20
    },
    head: {
        fontSize: 14
    },
    btn: {
        margin: 'auto'
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center'
    }
});

const mapStateToProps = (state: { auth: any; }) => ({
    auth: state.auth
})


class Project extends React.Component {

    state: { loading: boolean; projects: { name: string; issues: number; head: string; }[]; page: number; };

    constructor(props: any) {
        super(props);
        this.state = {
            loading: true,
            projects: [],
            page: 1
        };
        this.setPage = this.setPage.bind(this);
    }

    async componentDidMount() {
        this.setState({ loading: true });
        const resp = await fetch('projects.json');
        setTimeout(async () => {
            this.setState({ projects: (await resp.json()).slice((this.state.page - 1) * 12, this.state.page * 12), loading: false });
        }, 750);
    }

    async setPage(event: any, page: number) {
        this.setState({ page });
        await this.componentDidMount();
    }

    async getData() {
        fetch('http://localhost:8080/projects/viewProject')
    }

    render() {
        // @ts-ignore
        const { classes } = this.props;
        // @ts-ignore
        console.log(this.props);
        return (
            <div>
                {this.state.loading ? (
                    <div className={classes.spinner}>
                        <CircularProgress/>
                    </div>
                ) : (
                    <ImageList cols={6}>
                        {this.state.projects.map(item => (
                            <Card className={classes.gridSpace}>
                                <CardContent>
                                    <div>
                                        <Typography className={classes.title}>{item.name}</Typography>
                                    </div>
                                    <div>
                                        <Typography className={classes.head}>{item.head}</Typography>

                                    </div>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton size="large">
                                        <Badge badgeContent={item.issues} max={10000} color="secondary">
                                            <BugReportIcon />
                                        </Badge>
                                    </IconButton>
                                    <IconButton aria-label="Go to project" className={classes.btn} size="large">
                                        <ChevronRightIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        ))}
                    </ImageList>
                )}
                <div className={classes.pagination}>
                    <Pagination count={10} color="secondary" onChange={this.setPage}/>
                </div>
                <div>
                    <FormDialog></FormDialog>
                </div>
            </div>
        );
    }
}


export default connect(mapStateToProps)(withStyles(styles)(Project));
