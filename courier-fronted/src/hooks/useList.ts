import { useState } from "react";


export const useList = <T extends { id: number }>(initialState: T[]) => {

    const [ items, setItems ] = useState<T[]>(initialState);

    const setAllItems = (newItems: T[]) => {
        setItems(newItems);
    }

    const addItem = (item: T) => {
        setItems(prev => [ ...prev, item ]);
    }

    const updateItem = (updateItem: T) => {
        setItems(prev => prev.map(item => item.id === updateItem.id ? updateItem : item));
    }

    const removeItem = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }

    return { items, setAllItems, addItem, updateItem, removeItem };
}