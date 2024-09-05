import { useCallback, useState } from "react";
import { Item } from "../domain";


export const useList = <T extends Item>(initialItems: T[]) => {

    const [ items, setItems ] = useState<T[]>(initialItems);

    const setAllItems = useCallback((newItems: T[]) => {
        setItems(newItems);
    }, []);

    const addItem = useCallback((item: T) => {
        setItems(prev => [ ...prev, item ]);
    }, []);

    const updateItem = useCallback((updateItem: T) => {
        setItems(prev => prev.map(item => item.id === updateItem.id ? updateItem : item));
    }, []);

    const removeItem = useCallback((itemToRemove: T) => {
        setItems(prev => prev.filter(item => item.id !== itemToRemove.id));
    }, []);

    const existItem = useCallback((itemToSearch: T | null) => {
        if(itemToSearch === null) return false;
        return items.some(item => item.id === itemToSearch.id);
    }, [items]);

    return { items, setAllItems, addItem, updateItem, removeItem, existItem };
}