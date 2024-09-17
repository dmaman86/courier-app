import { TableContainer, Table, TableHead, TableRow, TableCell, Paper, TablePagination, TableBody, Stack } from "@mui/material";

import { GenericTableProps } from "@/domain";


export const ReusableTable = <T extends { id: number }>({ 
    data, 
    columns, 
    actions, 
    renderItemColumns,
    pagination, 
    onPageChange, 
    onRowsPerPageChange }: GenericTableProps<T>) => {

    if(!data || !data.length){
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
                        </TableRow> 
                    </TableHead>
                    <TableBody>
                        {
                            data.map(item => (
                                <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    {
                                        renderItemColumns(item).map((col) => (
                                            <TableCell key={`${item.id}-${col.key}`}>{col.content}</TableCell>
                                        ))
                                    }
                                    <TableCell>
                                        <Stack spacing={2} direction='row'>
                                            {actions?.map(action => (
                                                <button key={action.label} className={action.classNameButton} onClick={() => action.method(item)}>
                                                    <i className={action.classNameIcon}></i>
                                                </button>
                                            ))}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={pagination.totalItems}
                rowsPerPage={pagination.size}
                page={pagination.page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </>
    );

}