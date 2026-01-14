import { Button, Stack } from "@mui/material";
import { useSnackbar } from "notistack";

export const SnackbarConfirmAction = (
  key: string | number,
  onConfirm: () => void,
) => {
  const { closeSnackbar } = useSnackbar();

  const handleConfirm = () => {
    onConfirm();
    closeSnackbar(key);
  };

  const handleCancel = () => {
    closeSnackbar(key);
  };

  return (
    <Stack direction="row" spacing={1}>
      <Button color="error" size="small" onClick={handleConfirm}>
        Delete
      </Button>
      <Button color="inherit" size="small" onClick={handleCancel}>
        Cancel
      </Button>
    </Stack>
  );
};
