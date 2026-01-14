import { BaseEntity } from "@/models";
import { useCallback, useState } from "react";

export const useList = <T extends BaseEntity>(initialItems: T[]) => {
  const [items, setItems] = useState<T[]>(initialItems);

  const setAllItems = useCallback((newItems: T[]) => {
    setItems(newItems);
  }, []);

  const addItem = useCallback((item: T) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const updateItem = useCallback((updateItem: T) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updateItem.id ? updateItem : item)),
    );
  }, []);

  const removeItem = useCallback((id: string | number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getItemById = useCallback(
    (id: string | number) => {
      return items.find((item) => item.id === id) ?? null;
    },
    [items],
  );

  const existItem = useCallback(
    (id: string | number) => {
      return items.some((item) => item.id === id);
    },
    [items],
  );

  return {
    items,
    setAllItems,
    addItem,
    updateItem,
    removeItem,
    getItemById,
    existItem,
  };
};
