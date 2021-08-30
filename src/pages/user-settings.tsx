import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import {
	TextField,
	Theme,
	Typography,
	Switch
} from '@material-ui/core';
import {connect} from 'react-redux';


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
	cpadding: {
		display:'flex',
		maxWidth:'400px',
		padding:'5px 0px 5px 0px',
		margin:'5px'
	},
	cinline: {
		display:'inline-block',
		maxWidth:'400px',
		//padding:'5px 0px 0px 0px',
		margin:'5px'
	}
});

const mapStateToProps = (state: { auth: any; }) => ({
	auth: state.auth
})


class UserSettings extends React.Component {

	render() {
		// @ts-ignore
		const { classes } = this.props;
		return (
			<div>
				<Typography variant="h4">User settings:</Typography>
				<hr />
				<Typography variant="h6" className={classes.cpadding}>Name</Typography>
				<TextField
					className={classes.cpadding}
					required
					id="outlined-required"
					size='small'
					defaultValue="Default name"
					variant="outlined"
				/>
				<Typography variant="h6" className={classes.cpadding}>Bio</Typography>
				<TextField
					className={classes.cpadding}
					required
					size='small'
					id="outlined-required"
					defaultValue="Your bio comes here.."
					variant="outlined"
				/>
				<Typography variant="h6" className={classes.cpadding}>URL</Typography>
				<TextField
					className={classes.cpadding}
					required
					id="outlined-required"
					size='small'
					defaultValue="Default URL"
					variant="outlined"
				/>
				<LocationOnIcon /><Typography variant="h6" className={classes.cinline}>Location</Typography>
				<TextField
					className={classes.cpadding}
					required
					id="outlined-required"
					size='small'
					defaultValue="Chennai, India"
					variant="outlined"
				/>
				<br/>
				<Typography variant="h6" className={classes.cinline}>Receive Notifications</Typography>
				<Switch
					color="primary"
					name="checkedB"
					defaultChecked={true}
					inputProps={{ 'aria-label': 'primary checkbox' }}
				/>
			</div>
		)
	}
}

export default connect(mapStateToProps)(withStyles(styles)(UserSettings));
