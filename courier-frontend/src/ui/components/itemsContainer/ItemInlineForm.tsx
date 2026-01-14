import { Box, IconButton, Paper, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { ItemInlineFormProps } from "@/models";

export const ItemInlineForm = ({
  id,
  itemForm,
  onClose,
  onSubmit,
}: ItemInlineFormProps) => {
  return (
    <Paper variant="outlined" sx={{ position: "relative", padding: 3 }}>
      {id === null && (
        <Tooltip title="Close">
          <IconButton
            size="small"
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
            onClick={onClose}
          >
            <CloseIcon
              fontSize="small"
              sx={{
                color: "error.main",
                "&:hover": { color: "error.dark" },
              }}
            />
          </IconButton>
        </Tooltip>
      )}
      <Box sx={{ marginTop: 2 }}>{itemForm(id, onSubmit, onClose)}</Box>
    </Paper>
  );
};
