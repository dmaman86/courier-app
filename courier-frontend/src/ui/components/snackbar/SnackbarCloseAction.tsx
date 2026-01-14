import { useSnackbar } from "notistack";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const SnackbarCloseAction = (key: string | number) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton onClick={() => closeSnackbar(key)} size="small" color="inherit">
      <CloseIcon fontSize="small" />
    </IconButton>
  );
};
