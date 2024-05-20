import { useCallback, useState } from "react";
import { Item } from "../types";


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

    const removeItem = useCallback((id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const existItem = useCallback((id: number) => {
        return items.some(item => item.id === id);
    }, [items]);

    return { items, setAllItems, addItem, updateItem, removeItem, existItem };
}