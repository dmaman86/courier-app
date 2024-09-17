import React, { useEffect, useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { BranchesPartial, RolePartial, StatusOrdersPartial } from "@/ui";
import { PageProps } from "./interface";
import { withLoading } from "@/hoc";


const SettingsAdmin = ({ userDetails }: PageProps) => {

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);
    const [ expanded, setExpanded ] = useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    }

    useEffect(() => {
        setIsAdmin(userDetails.roles.some(role => role.name === 'ROLE_ADMIN'))
    }, [userDetails.roles]);

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
                        {expanded === 'panel1' && <RolePartial userDetails={userDetails} isAdmin={isAdmin}/>}
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        {expanded !== 'panel2' && <Typography>Branches</Typography>}
                    </AccordionSummary>
                    <AccordionDetails>
                        {expanded === 'panel2' && <BranchesPartial userDetails={userDetails} isAdmin={isAdmin}/>}
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                    >
                        {expanded !== 'panel3' && <Typography>Status Orders</Typography>}
                    </AccordionSummary>
                    <AccordionDetails>
                        {expanded === 'panel3' && <StatusOrdersPartial userDetails={userDetails} isAdmin={isAdmin}/>}
                    </AccordionDetails>
                </Accordion>
            </div>
        </>
    );
}

export default withLoading(SettingsAdmin);