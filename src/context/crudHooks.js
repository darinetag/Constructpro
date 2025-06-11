import { useMemo, useCallback } from 'react';

export const useCrudOperations = (state, setState, itemName, toast) => {
  const addItem = useCallback((newItem) => {
    const entityName = itemName.charAt(0).toUpperCase() + itemName.slice(1).replace('Item', '');
    const id = newItem.id || Date.now().toString();
    const updatedState = [...state, { ...newItem, id }];
    setState(updatedState);
    toast({ title: 'Success', description: `${entityName} added successfully` });
    return true;
  }, [state, setState, itemName, toast]);

  const updateItem = useCallback((id, updatedItem) => {
    const entityName = itemName.charAt(0).toUpperCase() + itemName.slice(1).replace('Item', '');
    const updatedState = state.map(item =>
      item.id === id ? { ...item, ...updatedItem } : item
    );
    setState(updatedState);
    toast({ title: 'Success', description: `${entityName} updated successfully` });
    return true;
  }, [state, setState, itemName, toast]);

  const deleteItem = useCallback((id) => {
    const entityName = itemName.charAt(0).toUpperCase() + itemName.slice(1).replace('Item', '');
    const updatedState = state.filter(item => item.id !== id);
    setState(updatedState);
    toast({ title: 'Success', description: `${entityName} removed successfully` });
    return true;
  }, [state, setState, itemName, toast]);

  return useMemo(() => {
    const operations = {};
    operations[`add${itemName.charAt(0).toUpperCase() + itemName.slice(1)}`] = addItem;
    operations[`update${itemName.charAt(0).toUpperCase() + itemName.slice(1)}`] = updateItem;
    operations[`delete${itemName.charAt(0).toUpperCase() + itemName.slice(1)}`] = deleteItem;
    return operations;
  }, [addItem, updateItem, deleteItem, itemName]);
};