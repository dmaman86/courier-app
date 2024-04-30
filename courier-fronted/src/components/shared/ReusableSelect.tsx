import Select, { MultiValue, SingleValue } from 'react-select';

import { SelectProps, OptionType } from '../../types';

export const ReusableSelect = ({ value, options, onChange, placeholder, isMulti = false }: SelectProps) => {

    const handleChange = (selected: MultiValue<OptionType> | SingleValue<OptionType>) => {
        if(isMulti){
            const selectedValues = (selected as MultiValue<OptionType>).map((option) => option.value);
            onChange(selectedValues);
        }else{
            const selectedValue = (selected as SingleValue<OptionType>)?.value ?? '';
            onChange(selectedValue);
        }
    };

    const getValue = () => {
        if(isMulti && Array.isArray(value)){
            return options.filter(option => value.includes(option.value));
        }else{
            return options.find(option => option.value === value);
        }
    }


    return (
        <>
            <Select
                value={getValue()}
                options={options}
                onChange={handleChange}
                placeholder={placeholder}
                isMulti={isMulti} 
            />
        </>
    );
}