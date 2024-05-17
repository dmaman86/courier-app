import { TableContainer, Table, TableHead, TableRow, TableCell, Paper } from "@mui/material";

import { GenericTableProps } from "../../types";


export const ReusableTable = <T extends { id: number }>({ data, columns, actions, BodyComponent }: GenericTableProps<T>) => {

    if(!data){
        return (
            <>
                <h1>No data avaible.</h1>
            </>
        );
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.key}>{col.label}</TableCell>
                            ))}
                            {actions && <TableCell>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <BodyComponent data={data} actions={actions}/>
                </Table>
            </TableContainer>
        </>
    );

}