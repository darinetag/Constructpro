import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, UploadCloud, Paperclip, XCircle } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/components/ui/use-toast';
import { getProjectsFromLocalStorage } from '../../utils/localStorageUtils';

const STORAGE_KEY = 'labTests';

const saveLabTestsToStorage = (labTests) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(labTests));
  } catch (error) {
    console.error('Error saving lab tests to localStorage:', error);
  }
};

const getLabTestsFromStorage = () => {
  try {
    const storedTests = localStorage.getItem(STORAGE_KEY);
    return storedTests ? JSON.parse(storedTests) : [];
  } catch (error) {
    console.error('Error retrieving lab tests from localStorage:', error);
    return [];
  }
};

const generateTestId = () => {
  return 'lab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const LabTestFormDialog = ({ isOpen, onOpenChange, mode, initialData, onSubmit, materials, isViewOnlyUser }) => {
  const { t } = useI18n();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  // State for projects loaded from localStorage
  const [projects, setProjects] = useState([]);

  const getInitialFormData = () => ({
    type: '',
    date: new Date().toISOString().split('T')[0],
    result: '',
    status: 'pending',
    notes: '',
    projectId: '',
    materialId: '',
    documentFile: null,
    documentName: '',
    documentType: '',
  });

  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    const loadedProjects = getProjectsFromLocalStorage();
    console.log('[DEBUG] Loaded projects from localStorage:', loadedProjects);
    setProjects(loadedProjects);
  }, []);

  useEffect(() => {
    console.log('[DEBUG] Mode:', mode);
    console.log('[DEBUG] Initial Data:', initialData);
    if (mode === 'edit' && initialData) {
      setFormData({
        type: initialData.type || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        result: initialData.result || '',
        status: initialData.status || 'pending',
        notes: initialData.notes || '',
        projectId: initialData.projectId || '',
        materialId: initialData.materialId || '',
        documentFile: initialData.documentFile || null, 
        documentName: initialData.documentName || '',
        documentType: initialData.documentType || '',
      });
    } else {
      setFormData(getInitialFormData());
    }
  }, [mode, initialData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`[DEBUG] Input Change - ${name}:`, value);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    console.log(`[DEBUG] Select Change - ${name}:`, value);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (isViewOnlyUser) return;
    const file = e.target.files[0];
    console.log('[DEBUG] File selected:', file);
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t('common.errorTitle'),
          description: t('common.toast.fileSizeError', { maxSize: '5MB' }),
          variant: 'destructive',
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      setFormData(prev => ({ 
        ...prev, 
        documentFile: file,
        documentName: file.name,
        documentType: file.type 
      }));
    }
  };

  const handleRemoveFile = () => {
    if (isViewOnlyUser) return;
    console.log('[DEBUG] Removing file');
    setFormData(prev => ({
      ...prev,
      documentFile: null,
      documentName: '',
      documentType: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const saveToLocalStorage = (testData) => {
    const existingTests = getLabTestsFromStorage();
    
    if (mode === 'add') {
      // Add new test
      const newTest = {
        ...testData,
        id: generateTestId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedTests = [...existingTests, newTest];
      saveLabTestsToStorage(updatedTests);
      
      toast({
        title: t('common.success'),
        description: t('laboratoryPage.admin.toast.testAdded'),
        variant: 'default',
      });
      
      return newTest;
    } else if (mode === 'edit' && initialData?.id) {
      // Update existing test
      const updatedTests = existingTests.map(test => 
        test.id === initialData.id 
          ? { 
              ...test, 
              ...testData, 
              updatedAt: new Date().toISOString() 
            }
          : test
      );
      
      saveLabTestsToStorage(updatedTests);
      
      toast({
        title: t('common.success'),
        description: t('laboratoryPage.admin.toast.testUpdated'),
        variant: 'default',
      });
      
      return updatedTests.find(test => test.id === initialData.id);
    }
    
    return testData;
  };

// In LabTestFormDialog.js - Remove the saveToLocalStorage function call
// and let the parent component handle all localStorage operations

const handleSubmit = (e) => {
  e.preventDefault();
  if (isViewOnlyUser) return;
  
  const dataToSubmit = { ...formData };
  if (!formData.documentFile && initialData?.documentFile) {
    dataToSubmit.documentFile = initialData.documentFile;
    dataToSubmit.documentName = initialData.documentName;
    dataToSubmit.documentType = initialData.documentType;
  } else if (!formData.documentFile) {
    delete dataToSubmit.documentFile;
    delete dataToSubmit.documentName;
    delete dataToSubmit.documentType;
  }

  console.log('[DEBUG] Submitting Form Data:', dataToSubmit);
  
  // REMOVE THIS - Don't save to localStorage here
  // const savedTest = saveToLocalStorage(dataToSubmit);
  
  // Just call the parent's onSubmit - let it handle localStorage
  onSubmit(dataToSubmit);

  if (mode === 'add') {
    setFormData(getInitialFormData());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
};
  const dialogTitleKey = mode === 'edit' ? 'laboratoryPage.admin.form.editTestTitle' : 'laboratoryPage.admin.form.addTestTitle';
  const dialogDescriptionKey = mode === 'edit' ? 'laboratoryPage.admin.form.editTestDescription' : 'laboratoryPage.admin.form.addTestDescription';
  const submitButtonTextKey = mode === 'edit' ? 'common.saveChanges' : 'laboratoryPage.admin.form.addTestButton';

  console.log('[DEBUG] Props - Projects from localStorage:', projects);
  console.log('[DEBUG] Props - Materials:', materials);
  console.log('[DEBUG] Form Data:', formData);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {mode === 'add' && !isOpen && !isViewOnlyUser && (
         <DialogTrigger asChild>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white">
            <PlusCircle className="h-4 w-4" />
            {t('laboratoryPage.admin.addNewTestButtonSmall')}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[525px] bg-card shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{t(dialogTitleKey)}</DialogTitle>
          <DialogDescription>{t(dialogDescriptionKey)}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">{t('laboratoryPage.admin.form.testTypeLabel')}</Label>
                <Input id="type" name="type" value={formData.type} onChange={handleInputChange} placeholder={t('laboratoryPage.admin.form.testTypePlaceholder')} disabled={isViewOnlyUser} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">{t('laboratoryPage.admin.form.testDateLabel')}</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} disabled={isViewOnlyUser} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectId">{t('laboratoryPage.admin.form.projectLabel')}</Label>
                <Select name="projectId" value={formData.projectId} onValueChange={(value) => handleSelectChange('projectId', value)} disabled={isViewOnlyUser}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('laboratoryPage.admin.form.projectPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="materialId">{t('laboratoryPage.admin.form.materialLabel')}</Label>
                <Select name="materialId" value={formData.materialId} onValueChange={(value) => handleSelectChange('materialId', value)} disabled={isViewOnlyUser}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('laboratoryPage.admin.form.materialPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map(material => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name} ({material.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">{t('laboratoryPage.admin.form.statusLabel')}</Label>
                    <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)} disabled={isViewOnlyUser}>
                    <SelectTrigger>
                        <SelectValue placeholder={t('laboratoryPage.admin.form.statusPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">{t('status.pending')}</SelectItem>
                        <SelectItem value="passed">{t('status.passed')}</SelectItem>
                        <SelectItem value="failed">{t('status.failed')}</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="result">{t('laboratoryPage.admin.form.resultLabel')}</Label>
                    <Input id="result" name="result" value={formData.result} onChange={handleInputChange} placeholder={t('laboratoryPage.admin.form.resultPlaceholder')} disabled={isViewOnlyUser} />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('laboratoryPage.admin.form.notesLabel')}</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} placeholder={t('laboratoryPage.admin.form.notesPlaceholder')} disabled={isViewOnlyUser} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentFile">{t('laboratoryPage.admin.form.uploadFullDocumentLabel')}</Label>
              {!formData.documentName ? (
                <label
                  htmlFor="documentFile-input"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg ${isViewOnlyUser ? 'cursor-not-allowed bg-muted/30' : 'cursor-pointer bg-muted hover:bg-muted/80'} transition-colors`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className={`w-8 h-8 mb-2 ${isViewOnlyUser ? 'text-muted-foreground/50' : 'text-muted-foreground'}`} />
                    <p className={`mb-1 text-sm ${isViewOnlyUser ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                      <span className="font-semibold">{t('common.clickToUpload')}</span> {t('common.orDragAndDrop')}
                    </p>
                    <p className={`text-xs ${isViewOnlyUser ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>{t('common.fileTypes.pdfDocImage')} ({t('common.maxFileSize', { size: '5MB'})})</p>
                  </div>
                  <Input 
                    id="documentFile-input" 
                    name="documentFile" 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    onChange={handleFileChange} 
                    disabled={isViewOnlyUser} 
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-foreground truncate max-w-[300px]">{formData.documentName}</span>
                  </div>
                  {!isViewOnlyUser && (
                    <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile} aria-label={t('common.removeFile')}>
                      <XCircle className="h-5 w-5 text-destructive" />
                    </Button>
                  )}
                </div>
              )}
            </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
            <Button type="submit" disabled={isViewOnlyUser}>{t(submitButtonTextKey)}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Export utility functions for use in other components
export { getLabTestsFromStorage, saveLabTestsToStorage, STORAGE_KEY };
export default LabTestFormDialog;