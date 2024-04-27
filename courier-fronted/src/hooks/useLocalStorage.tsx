import { useState } from 'react';
import { Token } from '../types';

export const useLocalStorage = (key: string, initialValue: Token | null) => {
    const [storedValue, setStoredValue] = useState<Token | null>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = (newValue: Token | null) => {
        try{
            setStoredValue(newValue);
            window.localStorage.setItem(key, JSON.stringify(newValue));
        }catch(error){
            setStoredValue(initialValue);
        }
    };

    const removeStoredValue = () => {
        try{
            window.localStorage.removeItem(key);
            setStoredValue(null);
        }catch(error){
            setStoredValue(initialValue);
        }
    }

    return [storedValue, setValue, removeStoredValue] as const;
}