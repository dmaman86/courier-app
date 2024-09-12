import Select, { MultiValue, SingleValue } from 'react-select';

import { OptionType, SelectProps } from '@/domain';

export const ReusableSelect = <T extends OptionType>({ label, 
                                                        value, 
                                                        options, 
                                                        onChange, 
                                                        isMulti = false, 
                                                        isDisabled = false }: SelectProps<T>) => {

    
    return (
        <>
            <label>{label}</label>
            <Select<T, typeof isMulti>
                value={value}
                options={options}
                onChange={onChange}
                isMulti={isMulti}
                isDisabled={isDisabled}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => String(option.value)}
                classNamePrefix="react-select"
            />
        </>
    );
}