import { useState } from 'react';
import { Token } from '../types';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = (newValue: T) => {
        setStoredValue(newValue);
        window.localStorage.setItem(key, JSON.stringify(newValue));
    };

    const removeStoredValue = () => {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);
    }

    return [storedValue, setValue, removeStoredValue] as const;
}