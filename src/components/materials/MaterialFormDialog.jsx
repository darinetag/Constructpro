import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';

const MaterialFormDialog = ({ isOpen, onOpenChange, mode, initialData, onSubmit, projects, currency = 'DZD' }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    unitPrice: '',
    supplier: '',
    projectId: '',
    lastOrdered: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        quantity: initialData.quantity?.toString() || '',
        unit: initialData.unit || '',
        unitPrice: initialData.unitPrice?.toString() || '',
        supplier: initialData.supplier || '',
        projectId: initialData.projectId || '',
        lastOrdered: initialData.lastOrdered ? new Date(initialData.lastOrdered).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        name: '',
        category: '',
        quantity: '',
        unit: '',
        unitPrice: '',
        supplier: '',
        projectId: '',
        lastOrdered: new Date().toISOString().split('T')[0],
      });
    }
  }, [mode, initialData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      quantity: parseFloat(formData.quantity) || 0,
      unitPrice: parseFloat(formData.unitPrice) || 0,
    });
    if (mode === 'add') {
       setFormData({
        name: '', category: '', quantity: '', unit: '', unitPrice: '', supplier: '', projectId: '', lastOrdered: new Date().toISOString().split('T')[0],
      });
    }
  };

  const dialogTitle = mode === 'edit' ? 'Edit Material' : 'Add New Material';
  const dialogDescription = mode === 'edit' ? 'Update material information.' : 'Add a new material to your inventory.';
  const submitButtonText = mode === 'edit' ? 'Save Changes' : 'Add Material';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {mode === 'add' && !isOpen && ( 
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-primary-foreground">
            <PlusCircle className="h-4 w-4" />
            Add Material
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[525px] bg-card shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Material Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Concrete (Grade 40)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleInputChange} placeholder="Structural" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} placeholder="500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" name="unit" value={formData.unit} onChange={handleInputChange} placeholder="cubic meters" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price ({currency})</Label>
                <Input id="unitPrice" name="unitPrice" type="number" value={formData.unitPrice} onChange={handleInputChange} placeholder="12000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" name="supplier" value={formData.supplier} onChange={handleInputChange} placeholder="ABC Supplies" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastOrdered">Last Ordered</Label>
                <Input id="lastOrdered" name="lastOrdered" type="date" value={formData.lastOrdered} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectId">Assigned Project</Label>
                <Select name="projectId" value={formData.projectId} onValueChange={(value) => handleSelectChange('projectId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not Assigned</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{submitButtonText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialFormDialog;