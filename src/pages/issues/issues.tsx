import React from 'react';
import withStyles from '@mui/styles/withStyles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import {
    CircularProgress,
    IconButton,
    Theme,
    Typography,
    Container,
    Chip,
    Button, Grid, TextField,
} from '@mui/material'
import { Pagination } from '@mui/material';
import { connect } from 'react-redux'
import BugReportIcon from '@mui/icons-material/BugReport';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { showAlert } from '../../actions/alert'

const styles = (theme: Theme) => ({
    chip: {
        margin: theme.spacing(0.5)
    },
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
    },
    search: {
        display: 'flex',
        border: '2px solid white',
        borderRadius: 10,
        justifyContent: 'right'
    },
    searchIcon: {
        margin: '1em'
    },
    searchButton: {
        justifyContent: 'right',
        mt: 10,
        padding: '10px'
    },
    noIssues: {
        display: 'flex',
        justifyContent: 'center',
        margin: '2em'
    },
    totalIssues: {
        margin: '1em'
    },
    project: {
        marginBottom: '1em'
    }
});

const mapStateToProps = (state: { auth: any }) => ({
    auth: state.auth
});

const mapDispatchToProps = () => ({
    showAlert
})

class Issue extends React.Component {
    state: {
        loading: boolean;
        issues: {
            id: number;
            project_id: number;
            deadline: number;
            created_at: number;
            updated_at: number;
            issue_no: number;
            status: number;
            priority: number;
            heading: string;
            body: string;
            tags: string[];
            users: string[];
        }[];
        page: number;
        projectId: number;
        numPerPage: number;
        tags: string[];
        deadline: number;
        priority: number;
        status: number;
        sortBy: string;
        dir: string;
        total: number;
        search: string;
        statusText: string;
        projectValue: string;
    };

    constructor(props: any) {
        super(props);
        this.state = {
            deadline: -1,
            dir: 'asc',
            numPerPage: 15,
            priority: -1,
            projectId: 0,
            sortBy: 'updated_at',
            status: -1,
            tags: [],
            loading: false,
            issues: [],
            page: 0,
            total: 0,
            search: '',
            statusText: 'Enter a project ID',
            projectValue: ''
        };
        this.setPage = this.setPage.bind(this);
        this.search = this.search.bind(this);
        this.updateSearchData = this.updateSearchData.bind(this);
        this.setProjectId = this.setProjectId.bind(this);
        document.addEventListener("keydown", (e) =>
            e.code === "Enter" && this.search());
    }

    async componentDidMount() {
        if (this.state.projectId === 0) {
            this.setState({
                ...this.state,
                statusText: 'Enter a project ID',
                issues: [],
                total: 0
            })
            return;
        }

        this.setState({ loading: true });
        const params = new URLSearchParams();
        params.set('project_id', this.state.projectId.toString());
        params.set('page', this.state.page.toString());
        params.set('page_size', this.state.numPerPage.toString());
        params.set('tags', this.state.tags.join(','));
        params.set('deadline', this.state.deadline.toString());
        params.set('priority', this.state.priority.toString());
        params.set('status', this.state.status.toString());
        params.set('sort', this.state.sortBy);
        params.set('dir', this.state.dir);
        const resp = await fetch(`${process.env.REACT_APP_BASE_URL}/issues/filter?${params.toString()}`);
        const data = await resp.json();
        if (resp.status === 200) {
            let statusText = 'Enter a project ID';
            if (data.total === 0) {
                statusText = 'No issues found!';
            }
            this.setState({
                ...this.state,
                loading: false,
                issues: data.issues,
                total: data.total,
                statusText
            });
        }
        else {
            this.setState({
                ...this.state,
                loading: false
            });

            // @ts-ignore
            this.props.showAlert({
                message: 'An unknown error occurred!'
            });
        }
    }

    async setPage(event: any, page: number) {
        this.setState({ ...this.state, page });
        await this.componentDidMount();
    }

    search() {
        this.setPage(null, 0);
    }

    updateSearchData(event: any) {
        const str: string = event.target.value;
        const tags: string[] = [];
        let deadline: number = -1;
        let priority: number = -1;
        let status: number = -1;
        let sortBy: string = 'updated_at';
        let dir: string = 'asc';

        const tagIdx = str.indexOf('tags:');
        if (tagIdx > -1) {
            let nextSpace = str.indexOf(' ', tagIdx + 5);
            if (nextSpace === -1) {
                nextSpace = str.length;
            }
            str.slice(tagIdx + 5, nextSpace).split(',').forEach(tag => {
                const trimmed = tag.trim();
                if (trimmed.length > 0) {
                    tags.push(trimmed);
                }
            });
        }

        const deadlineIdx = str.indexOf('deadline:\'');
        if (deadlineIdx > -1) {
            let nextSpace = str.indexOf('\' ', deadlineIdx + 9);
            if (nextSpace === -1) {
                nextSpace = str.length;
            }
            deadline = Math.ceil(new Date(str.slice(deadlineIdx + 9, nextSpace)).getTime() / 1000);
        }

        const priorityIdx = str.indexOf('priority:');
        if (priorityIdx > -1) {
            let nextSpace = str.indexOf(' ', priorityIdx + 9);
            if (nextSpace === -1) {
                nextSpace = str.length;
            }

            try {
                let temp = parseInt(str.slice(priorityIdx + 9, nextSpace));
                if (!isNaN(temp)) {
                    priority = temp;
                }
            } catch (e) {}
        }

        const statusIdx = str.indexOf('status:');
        if (statusIdx > -1) {
            let nextSpace = str.indexOf(' ', statusIdx + 7);
            if (nextSpace === -1) {
                nextSpace = str.length;
            }

            try {
                let temp = parseInt(str.slice(statusIdx + 7, nextSpace));
                if (!isNaN(temp)) {
                    status = temp;
                }
            } catch (e) {}
        }

        const sortIdx = str.indexOf('sort:');
        if (sortIdx > -1) {
            let nextSpace = str.indexOf(' ', sortIdx + 5);
            if (nextSpace === -1) {
                nextSpace = str.length;
            }
            sortBy = str.slice(sortIdx + 5, nextSpace);
        }

        const dirIdx = str.indexOf('dir:');
        if (dirIdx > -1) {
            let nextSpace = str.indexOf(' ', dirIdx + 4);
            if (nextSpace === -1) {
                nextSpace = str.length;
            }
            dir = str.slice(dirIdx + 4, nextSpace);
        }

        this.setState({
            ...this.state,
            tags,
            deadline,
            priority,
            status,
            sortBy,
            dir,
            search: str
        });
    }

    async setProjectId(event: any) {
        let projectId = event.target.value;
        let projectValue = '';
        if (projectId !== '0' && projectId !== '') {
            projectValue = projectId;
        } else {
            projectId = '0';
        }

        this.setState({
            ...this.state,
            projectId: parseInt(projectId, 10),
            projectValue
        });

        setTimeout(() => this.setPage(null, 0), 250);
    }

    render() {
        // @ts-ignore
        const { classes } = this.props;

        type x = "primary" | "secondary" | "warning" | "success" | "info" | "error" | "default" | undefined;
        const colors: x[] = ['primary', 'secondary', 'warning', 'success', 'info', 'error'];

        let items = (
            <>
                <Typography variant="h6" className={classes.totalIssues}>{'Total: ' + this.state.total}</Typography>
                <List>
                    {this.state.issues.map((item) => (
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <BugReportIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.heading}
                                secondary={(new Date(item.deadline * 1000).toLocaleString())}
                            />
                            <ListItemSecondaryAction className="chip">
                                {item.tags.slice(0, 3).map((tag) => (
                                    <Chip
                                        className={classes.chip}
                                        label={tag}
                                        clickable
                                        color={colors[Math.floor(Math.random() * colors.length)]}
                                    />
                                ))}
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    size="large"
                                >
                                    <ChevronRightIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </>
        );

        if (this.state.total === 0) {
            items = <Typography variant="h6" className={classes.noIssues}>{this.state.statusText}</Typography>;
        }

        return (
            <div>
                {this.state.loading ? (
                    <div className={classes.spinner}>
                        <CircularProgress />
                    </div>
                ) : (
                    <Container maxWidth="md">
                        <Grid container spacing={2} className={classes.project}>
                            <Grid item xs={4}>
                                <TextField id="project-name" label="Project" variant="outlined" className={classes.standardInput}
                                value={this.state.projectValue} onChange={this.setProjectId} autoFocus={true}/>
                            </Grid>
                        </Grid>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                fullWidth
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={this.updateSearchData}
                                value={this.state.search}
                            />
                            <Button className="searchButton" onClick={this.search}>Go</Button>
                        </div>
                        {items}
                    </Container>
                )}
                <div className={classes.pagination}>
                    <Pagination
                        count={Math.ceil(this.state.total / this.state.numPerPage)}
                        color="secondary"
                        onChange={this.setPage}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps())(withStyles(styles)(Issue));
