import React, { useState, useEffect } from 'react';
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

const LS_KEY = 'transactions';

function getTransactionsFromLocalStorage() {
  try {
    const data = localStorage.getItem(LS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveTransactionsToLocalStorage(transactions) {
  localStorage.setItem(LS_KEY, JSON.stringify(transactions));
}

function generateTransactionId() {
  return Date.now().toString();
}

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
  projects,
  onTransactionsChange
}) => {
  const { t } = useI18n();
  const currencySymbol = t('currency.dZD');

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && transactionData) {
      setFormData({
        ...initialFormData,
        ...transactionData,
        amount: transactionData.amount?.toString() || '',
        projectId: transactionData.projectId || ''
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [mode, transactionData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  // For disabling the button only, not for rendering errors
  const isFormValid = () => {
    if (!formData.type) return false;
    if (!formData.category.trim()) return false;
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) return false;
    if (!formData.date) return false;
    if (!formData.description.trim()) return false;
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
      const newTransaction = { ...transactionPayload, id: generateTransactionId() };
      updatedTransactions = [...transactions, newTransaction];
    } else {
      const transactions = getTransactionsFromLocalStorage();
      updatedTransactions = transactions.map(t =>
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
                onValueChange={value => handleSelectChange('type', value)}
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
                placeholder={formData.type === 'income'
                  ? t('financePage.form.categoryPlaceholderIncome')
                  : t('financePage.form.categoryPlaceholderExpense')}
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
            <Label htmlFor="projectId">{t('financePage.form.projectLabel')}</Label>
            <Select
              name="projectId"
              value={formData.projectId}
              onValueChange={value => handleSelectChange('projectId', value)}
            >
              <SelectTrigger id="projectId">
                <SelectValue placeholder={t('financePage.form.projectPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('financePage.form.projectNone')}</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
