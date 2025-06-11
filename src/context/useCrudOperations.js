import { useToast } from '@/components/ui/use-toast';

export const useCrudOperations = (stateSlice, setStateSlice, itemNameSingular, toastInstance, t) => {
  const defaultToast = useToast();
  const { toast } = toastInstance || defaultToast;

  const capitalizedItemName = itemNameSingular && itemNameSingular.length > 0 
    ? itemNameSingular.charAt(0).toUpperCase() + itemNameSingular.slice(1)
    : 'Item';
  
  const addOperationName = `add${capitalizedItemName}`;
  const updateOperationName = `update${capitalizedItemName}`;
  const deleteOperationName = `delete${capitalizedItemName}`;

  const operations = {
    [addOperationName]: (newItem) => {
      const newId = newItem.id || Date.now().toString(); // Use provided ID or generate one
      const itemWithId = { ...newItem, id: newId };
      setStateSlice(currentSlice => [...(currentSlice || []), itemWithId]); // Ensure currentSlice is an array
      toast({ 
        title: t('common.toast.successTitle'), 
        description: t('common.toast.addItemSuccess', { itemName: itemNameSingular, itemNameValue: newItem.name || newItem.title || newId })
      });
      return true;
    },
    [updateOperationName]: (id, updatedItemData) => {
      let itemNameValue = '';
      setStateSlice(currentSlice =>
        (currentSlice || []).map(item => { // Ensure currentSlice is an array
          if (item.id === id) {
            itemNameValue = updatedItemData.name || updatedItemData.title || item.name || item.title || id;
            return { ...item, ...updatedItemData };
          }
          return item;
        })
      );
      toast({ 
        title: t('common.toast.successTitle'), 
        description: t('common.toast.updateItemSuccess', { itemName: itemNameSingular, itemNameValue })
      });
      return true;
    },
    [deleteOperationName]: (id) => {
      let itemNameValue = '';
      setStateSlice(currentSlice => {
        const itemToDelete = (currentSlice || []).find(item => item.id === id); // Ensure currentSlice is an array
        itemNameValue = itemToDelete?.name || itemToDelete?.title || id;
        return (currentSlice || []).filter(item => item.id !== id); // Ensure currentSlice is an array
      });
      toast({ 
        title: t('common.toast.successTitle'), 
        description: t('common.toast.deleteItemSuccess', { itemName: itemNameSingular, itemNameValue })
      });
      return true;
    },
  };

  return operations;
};