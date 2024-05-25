import { Accordion, AccordionActions, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { RolePartial } from "../../partials";


export const SettingsAdmin = () => {

    return (
        <>
            <div className="container">
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        Roles
                    </AccordionSummary>
                    <AccordionDetails>
                        <RolePartial />
                    </AccordionDetails>
                </Accordion>
            </div>
        </>
    );
}