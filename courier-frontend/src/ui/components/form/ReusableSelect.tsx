import Select from 'react-select';

import { OptionType, SelectProps } from '@/domain';

export const ReusableSelect = <T extends OptionType>({ label, value, options, onChange, isMulti = false, isDisabled = false }: SelectProps<T>) => {

    
    return (
        <>
            <label>{label}</label>
            <Select
                value={value}
                options={options}
                onChange={onChange}
                isMulti={isMulti}
                isDisabled={isDisabled}
            />
        </>
    );
}