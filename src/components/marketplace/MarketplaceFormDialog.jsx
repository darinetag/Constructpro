import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const MarketplaceFormDialog = ({ isOpen, onOpenChange, mode, initialData, onSubmit, isProjectOwner }) => {
  const { t } = useI18n();
  const currencySymbol = t('currency.dZD');

  const defaultPersonnelData = { itemType: 'personnel_listing', name: '', role: '', experience: '', hourlyRate: '', availability: '', contact: '', skills: '', location: '' };
  const defaultServiceData = { itemType: 'service_listing', name: '', provider: '', rate: '', availability: '', contact: '', description: '', location: '' };
  const defaultJobOpeningData = { itemType: 'job_opening', name: '', company: '', salaryRange: '', jobType: 'Full-time', availability: 'Immediate', contact: '', description: '', location: '', skillsRequired: '' };
  const defaultMaterialData = { itemType: 'material_listing', name: '', quantity: '', unit: '', price: '', condition: 'New', availability: '', contact: '', description: '', location: ''};
  
  const getItemTypeDefaultData = (type) => {
    if (type === 'personnel_listing') return defaultPersonnelData;
    if (type === 'service_listing') return defaultServiceData;
    if (type === 'job_opening') return defaultJobOpeningData;
    if (type === 'material_listing') return defaultMaterialData;
    return defaultPersonnelData; 
  };
  
  const [itemType, setItemType] = useState(initialData?.itemType || (isProjectOwner ? 'job_opening' : 'personnel_listing'));
  const [formData, setFormData] = useState(initialData || getItemTypeDefaultData(itemType));


  useEffect(() => {
    let currentType = initialData?.itemType || (isProjectOwner && mode === 'add' ? 'job_opening' : itemType);
    setItemType(currentType);

    if (mode === 'edit' && initialData) {
      const skillsArrayToString = (skills) => Array.isArray(skills) ? skills.join(', ') : (skills || '');
      setFormData({
        ...initialData,
        skills: skillsArrayToString(initialData.skills),
        skillsRequired: skillsArrayToString(initialData.skillsRequired),
      });
    } else if (mode === 'add') {
        setFormData(getItemTypeDefaultData(currentType));
    }
  }, [isOpen, mode, initialData, itemType, isProjectOwner]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleItemTypeChange = (value) => {
    if (isProjectOwner && value !== 'job_opening') {
        return;
    }
    setItemType(value);
    setFormData(getItemTypeDefaultData(value));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = { ...formData, itemType };
    
    if (itemType === 'personnel_listing' || itemType === 'job_opening') {
      const skillsKey = itemType === 'personnel_listing' ? 'skills' : 'skillsRequired';
      processedData[skillsKey] = formData[skillsKey] ? formData[skillsKey].split(',').map(skill => skill.trim()).filter(skill => skill) : [];
    }
    if (itemType === 'personnel_listing' && formData.hourlyRate) {
      processedData.price = parseFloat(formData.hourlyRate) || 0;
      processedData.priceType = 'hourly';
    } else if (itemType === 'service_listing' && formData.rate) {
      processedData.price = parseFloat(formData.rate.match(/[\d\.]+/)?.[0]) || 0;
      processedData.priceType = formData.rate.toLowerCase().includes('/day') ? 'daily' : formData.rate.toLowerCase().includes('/hr') ? 'hourly' : 'fixed';
    } else if (itemType === 'job_opening' && formData.salaryRange) {
        processedData.price = parseFloat(formData.salaryRange.match(/[\d\.]+/)?.[0]) || 0;
        processedData.priceType = 'monthly_salary';
    } else if (itemType === 'material_listing' && formData.price) {
        processedData.price = parseFloat(formData.price) || 0;
        processedData.priceType = 'per_unit';
    }


    onSubmit(processedData);
  };

  const dialogTitle = mode === 'add' 
    ? (isProjectOwner ? t('marketplace.formDialog.addTitleJob') : t('marketplace.formDialog.addTitleGeneric')) 
    : t('marketplace.formDialog.editTitleGeneric');
  const dialogDescription = mode === 'add' 
    ? (isProjectOwner ? t('marketplace.formDialog.addJobOpeningDescription') : t('marketplace.formDialog.addListingDescription')) 
    : t('marketplace.formDialog.editListingDescription');


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {mode === 'add' && !isProjectOwner && (
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            {t('marketplace.addListingButton')}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            {!isProjectOwner && (
                <div className="space-y-2">
                <Label htmlFor="itemType">{t('marketplace.formDialog.itemTypeLabel')}</Label>
                <Select value={itemType} onValueChange={handleItemTypeChange} disabled={isProjectOwner && mode === 'add'}>
                    <SelectTrigger id="itemType"><SelectValue /></SelectTrigger>
                    <SelectContent>
                    <SelectItem value="personnel_listing">{t('marketplace.itemTypes.personnellisting')}</SelectItem>
                    <SelectItem value="service_listing">{t('marketplace.itemTypes.servicelisting')}</SelectItem>
                    <SelectItem value="material_listing">{t('marketplace.itemTypes.materiallisting')}</SelectItem>
                    {isProjectOwner && <SelectItem value="job_opening">{t('marketplace.itemTypes.jobopening')}</SelectItem>}
                    </SelectContent>
                </Select>
                </div>
            )}

            {itemType === 'personnel_listing' && !isProjectOwner && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="nameP">{t('marketplace.formDialog.nameLabel')}</Label><Input id="nameP" name="name" value={formData.name || ''} onChange={handleInputChange} placeholder={t('placeholders.fullName')} required /></div>
                  <div className="space-y-2"><Label htmlFor="role">{t('marketplace.formDialog.roleLabel')}</Label><Input id="role" name="role" value={formData.role || ''} onChange={handleInputChange} placeholder={t('placeholders.role')} required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="experience">{t('marketplace.formDialog.experienceLabel')}</Label><Input id="experience" name="experience" value={formData.experience || ''} onChange={handleInputChange} placeholder={t('placeholders.experience')} /></div>
                  <div className="space-y-2"><Label htmlFor="hourlyRate">{t('marketplace.formDialog.hourlyRateLabel', { currency: currencySymbol })}</Label><Input id="hourlyRate" name="hourlyRate" type="number" value={formData.hourlyRate || ''} onChange={handleInputChange} placeholder="4000" /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="skills">{t('marketplace.formDialog.skillsLabel')}</Label><Input id="skills" name="skills" value={formData.skills || ''} onChange={handleInputChange} placeholder={t('placeholders.skills')} /></div>
                <div className="space-y-2"><Label htmlFor="locationP">{t('marketplace.formDialog.locationLabel')}</Label><Input id="locationP" name="location" value={formData.location || ''} onChange={handleInputChange} placeholder={t('placeholders.location')} /></div>
              </>
            )}

            {itemType === 'service_listing' && !isProjectOwner && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="nameS">{t('marketplace.formDialog.serviceNameLabel')}</Label><Input id="nameS" name="name" value={formData.name || ''} onChange={handleInputChange} placeholder={t('placeholders.serviceName')} required /></div>
                  <div className="space-y-2"><Label htmlFor="provider">{t('marketplace.formDialog.providerNameLabel')}</Label><Input id="provider" name="provider" value={formData.provider || ''} onChange={handleInputChange} placeholder={t('placeholders.providerName')} /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="rateS">{t('marketplace.formDialog.rateLabel', { currency: currencySymbol, perUnit: t('marketplace.formDialog.perDay') })}</Label><Input id="rateS" name="rate" value={formData.rate || ''} onChange={handleInputChange} placeholder={`120000 ${currencySymbol}/${t('marketplace.formDialog.perDay')}`} /></div>
                <div className="space-y-2"><Label htmlFor="descriptionS">{t('marketplace.formDialog.descriptionLabel')}</Label><Textarea id="descriptionS" name="description" value={formData.description || ''} onChange={handleInputChange} placeholder={t('placeholders.detailedDescription')} /></div>
                <div className="space-y-2"><Label htmlFor="locationS">{t('marketplace.formDialog.serviceAreaLabel')}</Label><Input id="locationS" name="location" value={formData.location || ''} onChange={handleInputChange} placeholder={t('placeholders.serviceArea')} /></div>
              </>
            )}

            {itemType === 'job_opening' && isProjectOwner && (
              <>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="nameJ">{t('marketplace.formDialog.jobTitleLabel')}</Label><Input id="nameJ" name="name" value={formData.name || ''} onChange={handleInputChange} placeholder={t('placeholders.jobTitle')} required /></div>
                    <div className="space-y-2"><Label htmlFor="company">{t('marketplace.formDialog.companyNameLabel')}</Label><Input id="company" name="company" value={formData.company || ''} onChange={handleInputChange} placeholder={t('placeholders.companyName')} /></div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="jobType">{t('marketplace.formDialog.jobTypeLabel')}</Label>
                        <Select name="jobType" value={formData.jobType || 'Full-time'} onValueChange={(value) => handleInputChange({ target: { name: 'jobType', value }})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Full-time">{t('marketplace.jobTypes.fullTime')}</SelectItem>
                                <SelectItem value="Part-time">{t('marketplace.jobTypes.partTime')}</SelectItem>
                                <SelectItem value="Contract">{t('marketplace.jobTypes.contract')}</SelectItem>
                                <SelectItem value="Temporary">{t('marketplace.jobTypes.temporary')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2"><Label htmlFor="salaryRange">{t('marketplace.formDialog.salaryRangeLabel', { currency: currencySymbol })}</Label><Input id="salaryRange" name="salaryRange" value={formData.salaryRange || ''} onChange={handleInputChange} placeholder={`50000-70000 ${currencySymbol}/${t('marketplace.formDialog.perMonth')}`} /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="skillsRequired">{t('marketplace.formDialog.skillsRequiredLabel')}</Label><Input id="skillsRequired" name="skillsRequired" value={formData.skillsRequired || ''} onChange={handleInputChange} placeholder={t('placeholders.skillsRequired')} /></div>
                <div className="space-y-2"><Label htmlFor="descriptionJ">{t('marketplace.formDialog.jobDescriptionLabel')}</Label><Textarea id="descriptionJ" name="description" value={formData.description || ''} onChange={handleInputChange} placeholder={t('placeholders.jobDescription')} /></div>
                <div className="space-y-2"><Label htmlFor="locationJ">{t('marketplace.formDialog.jobLocationLabel')}</Label><Input id="locationJ" name="location" value={formData.location || ''} onChange={handleInputChange} placeholder={t('placeholders.jobLocation')} /></div>
              </>
            )}

            {itemType === 'material_listing' && !isProjectOwner && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="nameM">{t('marketplace.formDialog.materialNameLabel')}</Label><Input id="nameM" name="name" value={formData.name || ''} onChange={handleInputChange} placeholder={t('placeholders.materialName')} required /></div>
                        <div className="space-y-2"><Label htmlFor="condition">{t('marketplace.formDialog.conditionLabel')}</Label>
                            <Select name="condition" value={formData.condition || 'New'} onValueChange={(value) => handleInputChange({ target: { name: 'condition', value }})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="New">{t('marketplace.materialConditions.new')}</SelectItem>
                                    <SelectItem value="Used">{t('marketplace.materialConditions.used')}</SelectItem>
                                    <SelectItem value="Surplus">{t('marketplace.materialConditions.surplus')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="quantityM">{t('marketplace.formDialog.quantityLabel')}</Label><Input id="quantityM" name="quantity" value={formData.quantity || ''} onChange={handleInputChange} placeholder="e.g., 100" /></div>
                        <div className="space-y-2"><Label htmlFor="unitM">{t('marketplace.formDialog.unitLabel')}</Label><Input id="unitM" name="unit" value={formData.unit || ''} onChange={handleInputChange} placeholder={t('placeholders.unit')} /></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="priceM">{t('marketplace.formDialog.pricePerUnitLabel', { currency: currencySymbol })}</Label><Input id="priceM" name="price" type="number" value={formData.price || ''} onChange={handleInputChange} placeholder="e.g., 50" /></div>
                    <div className="space-y-2"><Label htmlFor="descriptionM">{t('marketplace.formDialog.descriptionLabel')}</Label><Textarea id="descriptionM" name="description" value={formData.description || ''} onChange={handleInputChange} placeholder={t('placeholders.detailedDescription')} /></div>
                    <div className="space-y-2"><Label htmlFor="locationM">{t('marketplace.formDialog.locationLabel')}</Label><Input id="locationM" name="location" value={formData.location || ''} onChange={handleInputChange} placeholder={t('placeholders.location')} /></div>
                </>
            )}
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="availability">{t('marketplace.formDialog.availabilityLabel')}</Label><Input id="availability" name="availability" value={formData.availability || ''} onChange={handleInputChange} placeholder={t('placeholders.availability')} /></div>
                <div className="space-y-2"><Label htmlFor="contact">{t('marketplace.formDialog.contactLabel')}</Label><Input id="contact" name="contact" value={formData.contact || ''} onChange={handleInputChange} placeholder={t('placeholders.contact')} required /></div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t('actions.cancel')}</Button>
            <Button type="submit">{mode === 'add' ? t('actions.add') : t('actions.saveChanges')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MarketplaceFormDialog;