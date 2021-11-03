import React from 'react';
import withStyles from '@mui/styles/withStyles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import FaceIcon from '@mui/icons-material/Face';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import ErrorIcon from '@mui/icons-material/Error';
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
	Container,
	Chip,
	Button
} from '@mui/material';
import { Pagination } from '@mui/material';
import {connect} from 'react-redux';
import BugReportIcon from '@mui/icons-material/BugReport';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const styles = (theme: Theme) => ({
	chip: {
		margin: theme.spacing(0.5),
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
		display:'flex',
		border:'2px solid white',
		borderRadius:10,
		justifyContent:'right'
	},
	searchIcon: {
		margin:'1em'
	},
	searchButton: {
		justifyContent:'right',
		mt:10,
		padding:'10px'
	}
});

const mapStateToProps = (state: { auth: any; }) => ({
	auth: state.auth
})


class Issue extends React.Component {
	state: { loading: boolean; issues: { name: string; issues: number; head: string; }[]; page: number; };

	constructor(props: any) {
		super(props);
		this.state = {
			loading: true,
			issues: [],
			page: 1
		};
		this.setPage = this.setPage.bind(this);
	}

	async componentDidMount() {
		this.setState({ loading: true });
		const resp = await fetch('projects.json');
		setTimeout(async () => {
			this.setState({ issues: (await resp.json()).slice((this.state.page - 1) * 12, this.state.page * 12), loading: false });
		}, 750);
	}

	async setPage(event: any, page: number) {
		this.setState({ page });
		await this.componentDidMount();
	}

	render() {
		// @ts-ignore
		const { classes } = this.props;
		return (
            <div>
				{this.state.loading ? (
					<div className={classes.spinner}>
						<CircularProgress/>
					</div>
				) : (
					<Container maxWidth='md'>
						<div className={classes.search}>
							<div className={classes.searchIcon}>
								<SearchIcon />
							</div>
							<InputBase
								fullWidth
								placeholder="Search…"
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput,
								}}
								inputProps={{ 'aria-label': 'search' }}
							/>
							<Button className='searchButton'>
								Go
							</Button>
						</div>
						<List>
							{this.state.issues.map(item => (
								<ListItem>
									<ListItemAvatar>
										<Avatar>
											<BugReportIcon />
										</Avatar>
									</ListItemAvatar>
									<ListItemText primary={item.name} secondary={item.head} />
									<ListItemSecondaryAction className='chip'>
										<Chip className={classes.chip}
											icon={<FaceIcon />}
											label='multiple users'
											clickable
											color="primary"
										/>
										<Chip className={classes.chip}
											icon={<ErrorIcon />}
											label="high priority"
											clickable
											color="secondary"
										/>
										<IconButton edge="end" aria-label="delete" size="large">
											<ChevronRightIcon />
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							))}
						</List>
					</Container>

				)}
				<div className={classes.pagination}>
					<Pagination count={10} color="secondary" onChange={this.setPage}/>
				</div>
			</div>
        );
	}
}

export default connect(mapStateToProps)(withStyles(styles)(Issue));
