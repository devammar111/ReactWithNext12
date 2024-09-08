import Slide from "@mui/material/Slide"
import { TransitionProps } from "@mui/material/transitions"
import React, { forwardRef, useContext } from "react"
import { Breakpoint, styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import styles from '../umbracoForm/submitButton.module.scss';


export default function BasicDialog({ onOpen, onClose, children, open, size }: any) {
    const Transition = forwardRef(function Transition(
        props: TransitionProps & {
            children: React.ReactElement<any, any>
        },
        ref: React.Ref<unknown>
    ) {
        return <Slide direction="up" ref={ref} {...props} onExited={() => {
            if (onClose) {
                onClose();
            }
        }} onEnter={() => {
            if (onOpen) {
                onOpen();
            }
        }} />;
    });

    return (
        <div>
            <Dialog
                onClose={onClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                TransitionComponent={Transition}
                fullWidth
                maxWidth={size}
            >
                <DialogContent dividers>
                    <Typography align='center' gutterBottom>
                        {children}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <button className={styles.btnClose} onClick={onClose}>
                        Close
                    </button>
                </DialogActions>
            </Dialog>
        </div>


    ) 
}