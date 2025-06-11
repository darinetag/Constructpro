import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Microscope, PlusCircle, Search, Edit, Trash2, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const LabServices = () => {
  const { labServices, addLabService, updateLabService, deleteLabService, loading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'

  const initialFormData = { name: '', description: '', price: '', duration: '', category: '' };
  const [formData, setFormData] = useState(initialFormData);

  const filteredServices = useMemo(() => {
    return labServices.filter(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [labServices, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
        ...formData,
        price: parseFloat(formData.price) || 0
    };
    if (formMode === 'add') {
      addLabService(dataToSubmit);
    } else {
      updateLabService(currentService.id, dataToSubmit);
    }
    setIsFormOpen(false);
    setFormData(initialFormData);
    setCurrentService(null);
  };

  const openFormDialog = (mode, service = null) => {
    setFormMode(mode);
    if (mode === 'edit' && service) {
      setCurrentService(service);
      setFormData(service);
    } else {
      setCurrentService(null);
      setFormData(initialFormData);
    }
    setIsFormOpen(true);
  };
  
  const openDeleteDialog = (service) => {
    setCurrentService(service);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (currentService) {
      deleteLabService(currentService.id);
    }
    setIsDeleteOpen(false);
    setCurrentService(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) return <p>Loading services...</p>;

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
                <Microscope className="mr-3 h-8 w-8 text-primary" /> Laboratory Services
            </h1>
            <p className="text-muted-foreground">Manage the testing services offered by the laboratory.</p>
        </div>
        <Button onClick={() => openFormDialog('add')} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search services by name, category..."
          className="pl-10 w-full sm:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-10">
          <Microscope className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">No services found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? "Try adjusting your search." : "Add a new service to get started."}
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredServices.map(service => (
            <motion.div key={service.id} variants={itemVariants}>
              <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  {service.category && <CardDescription className="text-sm text-primary">{service.category}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm">
                  <p className="text-muted-foreground line-clamp-3">{service.description}</p>
                  <div className="flex items-center text-foreground">
                    <DollarSign className="h-4 w-4 mr-1 text-green-500" /> Price: {service.price.toLocaleString()} DZD
                  </div>
                  {service.duration && 
                    <div className="flex items-center text-foreground">
                        <Clock className="h-4 w-4 mr-1 text-blue-500" /> Duration: {service.duration}
                    </div>
                  }
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openFormDialog('edit', service)}>
                    <Edit className="mr-1 h-3 w-3" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(service)}>
                    <Trash2 className="mr-1 h-3 w-3" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{formMode === 'add' ? 'Add New Service' : 'Edit Service'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div><Label htmlFor="name">Service Name</Label><Input id="name" name="name" value={formData.name} onChange={handleInputChange} required /></div>
            <div><Label htmlFor="category">Category</Label><Input id="category" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g., Soil Testing, Concrete Analysis" /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="price">Price (DZD)</Label><Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} required /></div>
              <div><Label htmlFor="duration">Est. Duration (Optional)</Label><Input id="duration" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g., 2-3 days" /></div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit">{formMode === 'add' ? 'Add Service' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete the service "{currentService?.name}"? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabServices;