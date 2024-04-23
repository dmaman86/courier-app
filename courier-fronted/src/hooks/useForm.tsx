import { useState, ChangeEvent } from 'react';

export const useForm = <T extends Record<string, any>>(initialState: T) => {
    const [values, setValues] = useState<T>(initialState);

    // Asegurarse de que el evento y la destructuración del target estén correctamente tipados
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    // Explicitar los tipos de retorno para que TypeScript los maneje correctamente
    return [values, handleInputChange] as const;
};