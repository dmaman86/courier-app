import Select, { MultiValue, SingleValue } from "react-select";

import { AxiosCall, FetchResponse, OptionType } from "@/domain";
import { useCallback, useState } from "react";
import { useAsync, useFetchAndLoad } from "@/hooks";


interface SelectDetailsFormProps<T extends OptionType, R = T> {
    label: string;
    initialData: T | T[];
    listOptions: T[] | null;
    transformData: (data: SingleValue<T> | MultiValue<T> | R) => void;
    formatLabel?: (item: R) => T;
    isMulti: boolean;
    isDisabled?: boolean;
    fetchItem?: () => AxiosCall<R[]>;
}

export const SelectDetailsForm = <T extends OptionType, R = T>({
    label,
    initialData,
    listOptions,
    transformData,
    formatLabel,
    isMulti,
    isDisabled = false,
    fetchItem
  }: SelectDetailsFormProps<T, R>) => {


    const [ options, setOptions ] = useState<T[] | null>(listOptions);

    const { loading, callEndPoint } = useFetchAndLoad();

    const fetchDetails = async () => {
        if(!options && fetchItem){
            return await callEndPoint(fetchItem());
        }
        return { data: null, error: null };
    }

    const handleSuccess = (response: FetchResponse<R[]>) => {
        const { data } = response;
        if(data){
            if(formatLabel){
                const formattedData = data.map(item => formatLabel(item));
                setOptions(formattedData);
            }
        }
    }

    useAsync(fetchDetails, handleSuccess, () => {}, [listOptions, fetchItem]);

    const handleChange = useCallback((selected: SingleValue<T> | MultiValue<T>) => {
        transformData(selected);
    }, [transformData]);

    return(
        <>
            {
                options && (
                    <>
                        <label>{label}</label>
                        <Select<T, typeof isMulti>
                            value={initialData}
                            options={options}
                            onChange={handleChange}
                            isMulti={isMulti}
                            isDisabled={isDisabled || loading}
                        />
                    </>
                )
            }
        </>
    );
}