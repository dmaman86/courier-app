import { Dialog, DialogTitle, DialogActions } from "@mui/material";

interface AlertDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    isConfirm?: boolean
}

export const AlertDialog = ({ open, onClose, onConfirm, title, isConfirm = true }: AlertDialogProps) => {


    return(
        <>
            <Dialog open={open} 
                    onClose={onClose} 
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogActions>
                    <button onClick={onClose} className="btn btn-secondary">Close</button>
                    { isConfirm && <button onClick={onConfirm} className="btn btn-danger">Sure</button> }
                </DialogActions>
            </Dialog>
        </>
    );
}