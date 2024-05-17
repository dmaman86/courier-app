import Select from 'react-select';

import { SelectProps } from '../../types';

export const ReusableSelect = ({ value, options, onChange, isMulti = false }: SelectProps) => {

    
    return (
        <>
            <Select
                value={value}
                options={options}
                onChange={onChange}
                isMulti={isMulti} 
            />
        </>
    );
}