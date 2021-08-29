import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
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
	Container
} from '@material-ui/core';
import {Pagination} from '@material-ui/lab';
import {connect} from 'react-redux';
import BugReportIcon from '@material-ui/icons/BugReport';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

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
						<List>
							{this.state.issues.map(item => (
								<ListItem>
									<ListItemAvatar>
										<Avatar>
											<BugReportIcon />
										</Avatar>
									</ListItemAvatar>
									<ListItemText primary={item.name} secondary={item.head} />
									<ListItemSecondaryAction>
										<IconButton edge="end" aria-label="delete">
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
		)
	}
}

export default connect(mapStateToProps)(withStyles(styles)(Issue));
