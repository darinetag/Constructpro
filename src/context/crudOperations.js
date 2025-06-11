export const createCrudFunctions = (state, setState, itemName, toast) => ({
  [`add${itemName}`]: (newItem) => {
    const updatedState = [...state, { ...newItem, id: Date.now().toString() }];
    setState(updatedState);
    toast({ title: 'Success', description: `${itemName} added successfully` });
    return true;
  },
  [`update${itemName}`]: (id, updatedItem) => {
    const updatedState = state.map(item =>
      item.id === id ? { ...item, ...updatedItem } : item
    );
    setState(updatedState);
    toast({ title: 'Success', description: `${itemName} updated successfully` });
    return true;
  },
  [`delete${itemName}`]: (id) => {
    const updatedState = state.filter(item => item.id !== id);
    setState(updatedState);
    toast({ title: 'Success', description: `${itemName} removed successfully` });
    return true;
  },
});