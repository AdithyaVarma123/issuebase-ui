import React, { Component } from 'react'
import Button from '@mui/material/Button';

export default class DropzoneDialogComponent extends Component {
    state: { open: boolean; files: File[] };
    props: {
        onSave ?: (files: File[]) => void;
        maxFileSize: number;
        acceptedFiles: string[];
        buttonText: string
        files ?: File[]
    } = {
        maxFileSize: 5000000,
        acceptedFiles: ['image/jpeg', 'image/png', 'image/bmp'],
        buttonText: 'Add images'
    };
    constructor(props: any) {
        super(props);
        this.props = {...props};
        this.state = {
            open: false,
            files: []
        };
    }

    handleClose() {
        this.setState({
            open: false
        });
    }

    handleSave(files: File[]) {
        this.setState({
            files: files,
            open: false
        });

        try {
            if (this.props.onSave) {
                this.props.onSave(files);
            }
        }
        catch (err) {}
    }

    handleOpen() {
        this.setState({
            open: true,
            files: this.props.files ? this.props.files : []
        }, () => {console.log(this.state.files)});
    }

    render() {
        return (
            <div>
                <Button onClick={this.handleOpen.bind(this)} variant="contained">{this.props.buttonText}</Button>
                {/*<DropzoneDialog*/}
                {/*    open={this.state.open}*/}
                {/*    onSave={this.handleSave.bind(this)}*/}
                {/*    acceptedFiles={this.props.acceptedFiles}*/}
                {/*    showPreviews={true}*/}
                {/*    maxFileSize={this.props.maxFileSize}*/}
                {/*    onClose={this.handleClose.bind(this)}*/}
                {/*    initialFiles={this.state.files}*/}
                {/*/>*/}
            </div>
        );
    }
}
