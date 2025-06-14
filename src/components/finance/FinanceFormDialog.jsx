import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useI18n } from '@/context/I18nContext';
import { getProjectsFromLocalStorage, getTransactionsFromLocalStorage, saveTransactionsToLocalStorage, generateId } from '@/utils/localStorageUtils';

const initialFormData = {
  type: 'expense',
  category: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
  projectId: '',
};

const FinanceFormDialog = ({
  isOpen,
  onClose,
  mode,
  transactionData,
  projects: propProjects,
  onTransactionsChange,
  onProjectsChange,
}) => {
  console.log("🔍 Projects prop in FinanceFormDialog:", propProjects);
  const { t } = useI18n();
  const currencySymbol = t('currency.dZD');

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [localProjects, setLocalProjects] = useState(propProjects || []);
  const isInitialMount = useRef(true); // Track initial mount

  useEffect(() => {
    // Sync localProjects with propProjects or localStorage
    if (propProjects && propProjects.length > 0) {
      console.log('🔍 Using projects prop:', propProjects);
      setLocalProjects(propProjects);
    } else {
      const lsProjects = getProjectsFromLocalStorage();
      console.log('🔍 Fallback to localStorage projects:', lsProjects);
      setLocalProjects(lsProjects);
      if (onProjectsChange && lsProjects.length > 0) {
        onProjectsChange(lsProjects);
      }
    }
  }, [propProjects, onProjectsChange]);

  useEffect(() => {
    if (!isOpen) return; // Skip if dialog is closed

    if (isInitialMount.current || mode === 'edit') {
      // Initialize form data only on mount or edit mode
      if (mode === 'edit' && transactionData) {
        setFormData({
          ...initialFormData,
          ...transactionData,
          amount: transactionData.amount?.toString() || '',
          projectId: transactionData.projectId || (localProjects[0]?.id || ''),
        });
      } else {
        setFormData({
          ...initialFormData,
          projectId: localProjects[0]?.id || '',
        });
      }
      setErrors({});
      isInitialMount.current = false;
    } else {
      // Update projectId only if formData.projectId is empty and localProjects has changed
      if (!formData.projectId && localProjects[0]?.id) {
        setFormData((prev) => ({
          ...prev,
          projectId: localProjects[0]?.id || '',
        }));
      }
    }
  }, [isOpen, mode, transactionData, localProjects]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const isFormValid = () => {
    if (!formData.type) return false;
    if (!formData.category.trim()) return false;
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) return false;
    if (!formData.date) return false;
    if (!formData.description.trim()) return false;
    if (!formData.projectId) return false;
    return true;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = t('financePage.form.error.typeRequired');
    if (!formData.category.trim()) newErrors.category = t('financePage.form.error.categoryRequired');
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = t('financePage.form.error.amountInvalid');
    }
    if (!formData.date) newErrors.date = t('financePage.form.error.dateRequired');
    if (!formData.description.trim()) newErrors.description = t('financePage.form.error.descriptionRequired');
    if (!formData.projectId) newErrors.projectId = t('financePage.form.error.projectRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const transactionPayload = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    let updatedTransactions;
    if (mode === 'add') {
      const transactions = getTransactionsFromLocalStorage();
      const newTransaction = { ...transactionPayload, id: generateId() };
      updatedTransactions = [...transactions, newTransaction];
      setFormData({
        ...initialFormData,
        projectId: localProjects[0]?.id || '',
        date: new Date().toISOString().split('T')[0],
      });
    } else {
      const transactions = getTransactionsFromLocalStorage();
      updatedTransactions = transactions.map((t) =>
        t.id === transactionData.id ? { ...transactionPayload, id: transactionData.id } : t
      );
    }
    saveTransactionsToLocalStorage(updatedTransactions);
    if (onTransactionsChange) onTransactionsChange(updatedTransactions);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? t('financePage.form.addTitle') : t('financePage.form.editTitle')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' ? t('financePage.form.addDescription') : t('financePage.form.editDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">{t('financePage.form.typeLabel')}</Label>
              <Select
                name="type"
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder={t('financePage.form.typePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">{t('financePage.form.typeIncome')}</SelectItem>
                  <SelectItem value="expense">{t('financePage.form.typeExpense')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <div className="text-red-500 text-xs">{errors.type}</div>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">{t('financePage.form.categoryLabel')}</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder={
                  formData.type === 'income'
                    ? t('financePage.form.categoryPlaceholderIncome')
                    : t('financePage.form.categoryPlaceholderExpense')
                }
              />
              {errors.category && <div className="text-red-500 text-xs">{errors.category}</div>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">{t('financePage.form.amountLabel', { currency: currencySymbol })}</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.amount && <div className="text-red-500 text-xs">{errors.amount}</div>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">{t('financePage.form.dateLabel')}</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
              {errors.date && <div className="text-red-500 text-xs">{errors.date}</div>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('financePage.form.descriptionLabel')}</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t('financePage.form.descriptionPlaceholder')}
            />
            {errors.description && <div className="text-red-500 text-xs">{errors.description}</div>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectId">{t('financePage.form.projectLabel')} <span className="text-red-500">*</span></Label>
            <Select
              name="projectId"
              value={formData.projectId}
              onValueChange={(value) => handleSelectChange('projectId', value)}
            >
              <SelectTrigger id="projectId">
                <SelectValue placeholder={t('financePage.form.projectPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {localProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.projectId && <div className="text-red-500 text-xs">{errors.projectId}</div>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" disabled={!isFormValid()}>
              {mode === 'add' ? t('actions.add') : t('actions.saveChanges')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FinanceFormDialog;
