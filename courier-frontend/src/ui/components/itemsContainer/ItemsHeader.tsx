import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useDebounce } from "@/hooks";
import { ItemsHeaderProps } from "@/models";

export const ItemsHeader = ({
  title,
  placeholder,
  buttonName,
  setQuery,
  canCreate,
  onCreate,
  advancedOptions,
}: ItemsHeaderProps) => {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);

  useEffect(() => {
    setQuery(debouncedSearch);
  }, [debouncedSearch]);

  const handleToogleAdvanced = (_: any, expanded: boolean) => {
    setIsAdvancedOpen(expanded);
  };

  return (
    <>
      <Grid container alignItems="center" spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6">{title}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} justifyContent="flex-end">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="text"
                variant="outlined"
                fullWidth
                value={search}
                placeholder={placeholder}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>
            {canCreate && (
              <Grid
                size={{ xs: 12, sm: 6 }}
                justifyContent="center"
                display="flex"
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={onCreate}
                >
                  {buttonName}
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      {advancedOptions && (
        <Accordion
          sx={{ mt: 2 }}
          expanded={isAdvancedOpen}
          onChange={handleToogleAdvanced}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Advanced Search</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {advancedOptions.advancedSearchContent(
              advancedOptions.onChange,
              isAdvancedOpen,
            )}
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};
