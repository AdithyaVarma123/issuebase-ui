import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useState} from 'react';
import {useSelector} from "react-redux";

export default function FormDialog() {

	const [name,setName]=useState("")


	const [open, setOpen] = React.useState(false);
	// @ts-ignore
	const { auth } = useSelector((state) => state);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	console.log(auth);
	const handleCreate = async () => {


	};


	return (
		<div>
			<Button variant="outlined" onClick={handleClickOpen}>
				Create Project
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Create new project</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="project name"
						type="text"
						fullWidth
						variant="standard"
						onChange={(e)=>setName(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleCreate}>Create</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
