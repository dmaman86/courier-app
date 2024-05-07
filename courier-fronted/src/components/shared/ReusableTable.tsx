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
        <table>
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                    ))}
                    {actions && <th>Actions</th>}
                </tr>
            </thead>
            <BodyComponent data={data} actions={actions}/>
        </table>
    );

}