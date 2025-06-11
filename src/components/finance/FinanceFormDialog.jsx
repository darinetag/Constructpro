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

const FinanceFormDialog = ({ isOpen, onClose, mode, transactionData, projects, addFinance, updateFinance }) => {
  const { t } = useI18n();
  const currencySymbol = t('currency.dZD');

  const initialFormData = {
    type: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    projectId: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (mode === 'edit' && transactionData) {
      setFormData({
        ...transactionData,
        amount: transactionData.amount.toString(),
        projectId: transactionData.projectId || '', 
      });
    } else {
      setFormData(initialFormData);
    }
  }, [mode, transactionData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const processedData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };
    if (mode === 'add') {
      addFinance(processedData);
    } else {
      updateFinance(transactionData.id, processedData);
    }
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? t('financePage.form.addTitle') : t('financePage.form.editTitle')}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? t('financePage.form.addDescription') : t('financePage.form.editDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">{t('financePage.form.categoryLabel')}</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder={formData.type === 'income' ? t('financePage.form.categoryPlaceholderIncome') : t('financePage.form.categoryPlaceholderExpense')}
              />
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
              />
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectId">{t('financePage.form.projectLabel')}</Label>
            <Select 
              name="projectId" 
              value={formData.projectId} 
              onValueChange={(value) => handleSelectChange('projectId', value)}
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t('actions.cancel')}</Button>
          <Button onClick={handleSubmit}>{mode === 'add' ? t('actions.add') : t('actions.saveChanges')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FinanceFormDialog;