import React from 'react';
import { Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { clearAlert } from '../actions/alert';

const Alert = () => {
    /* Replaces mapStateToProps */
    // @ts-ignore
    const alert = useSelector((state) => state.alert);
    /*Replaces mapDispatchToProps */
    const dispatch = useDispatch();
    const handleClose = () => dispatch(clearAlert());
    return (
        <Snackbar
            {...alert}
            onClose={handleClose}
            action={
                <IconButton
                    size='small'
                    aria-label='close'
                    color='inherit'
                    onClick={handleClose}
                >
                    <CloseIcon fontSize='small' />
                </IconButton>
            }
        />
    );
};

export default Alert;
