import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content?: React.ReactNode;
  actions?: React.ReactNode;
}

export const CustomDialog = ({
  open,
  onClose,
  title,
  content,
  actions,
}: DialogProps) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        {content && <DialogContent>{content}</DialogContent>}
        {actions && <DialogActions>{actions}</DialogActions>}
      </Dialog>
    </>
  );
};
