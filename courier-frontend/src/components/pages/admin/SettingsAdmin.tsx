import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { OfficesPartial, RolePartial } from "../../partials";


export const SettingsAdmin = () => {

    const [ expanded, setExpanded ] = useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    }

    return (
        <>
            <div className="container">
                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        {expanded !== 'panel1' && <Typography>Roles</Typography>}
                    </AccordionSummary>
                    <AccordionDetails>
                        {expanded === 'panel1' && <RolePartial />}
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        {expanded !== 'panel2' && <Typography>Offices</Typography>}
                    </AccordionSummary>
                    <AccordionDetails>
                        {expanded === 'panel2' && <OfficesPartial />}
                    </AccordionDetails>
                </Accordion>
            </div>
        </>
    );
}