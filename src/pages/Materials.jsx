import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package as PackageIcon, Search, Store as StoreIcon, Filter } from 'lucide-react';
import { MaterialCard, MaterialFormDialog, MaterialDeleteDialog, MaterialStats } from '@/components/materials';
import NearbyLocationsCard from '@/components/common/NearbyLocationsCard';
import { useI18n } from '@/context/I18nContext';

const Materials = () => {
  const { materials, projects, addMaterial, updateMaterial, deleteMaterial, loading } = useAppContext();
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [formMode, setFormMode] = useState('add');

  const categories = useMemo(() => {
    if (loading) return ['all'];
    const uniqueCategories = [...new Set(materials.map(m => m.category))];
    return ['all', ...uniqueCategories.filter(Boolean)]; // Ensure 'all' is first and remove null/undefined categories
  }, [materials, loading]);

  const filteredMaterials = useMemo(() => {
    if (loading) return [];
    return materials.filter(material => {
      const nameMatch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
      const supplierMatch = material.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const categorySearchMatch = material.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSearch = nameMatch || supplierMatch || categorySearchMatch;
      const matchesCategoryFilter = filterCategory === 'all' || material.category === filterCategory;
      
      return matchesSearch && matchesCategoryFilter;
    });
  }, [materials, searchTerm, filterCategory, loading]);

  if (loading) {
    return <div className="flex items-center justify-center h-full text-lg font-semibold text-primary">{t('common.loadingMaterials')}</div>;
  }

  const handleFormSubmit = (formData) => {
    if (formMode === 'add') {
      addMaterial(formData);
    } else {
      updateMaterial(currentMaterial.id, formData);
    }
    setIsFormDialogOpen(false);
    setCurrentMaterial(null);
  };

  const openFormDialog = (mode, material = null) => {
    setFormMode(mode);
    setCurrentMaterial(material);
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (material) => {
    setCurrentMaterial(material);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (currentMaterial) {
      deleteMaterial(currentMaterial.id);
    }
    setIsDeleteDialogOpen(false);
    setCurrentMaterial(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07 }
    }
  };

  const mockNearbyStores = [
    { id: 'store1', name: 'Construct Supplies Co.', address: '123 Builder Rd, Cityville', phone: '555-1234', website: '#' },
    { id: 'store2', name: 'ProMaterials Depot', address: '456 Hardware Ln, Townburg', phone: '555-5678', website: '#' },
    { id: 'store3', name: 'Quality Building Materials', address: '789 Cement St, Villagetown', phone: '555-9012', website: '#' },
  ];

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent-foreground to-secondary-foreground">
            {t('materialsPage.title')}
          </h1>
          <p className="text-muted-foreground">{t('materialsPage.description')}</p>
        </div>
        <MaterialFormDialog
          isOpen={isFormDialogOpen && formMode==='add'}
          onOpenChange={(isOpen) => {
             if (!isOpen) setCurrentMaterial(null);
             setIsFormDialogOpen(isOpen);
          }}
          mode="add"
          onSubmit={handleFormSubmit}
          projects={projects}
        />
      </div>

      <MaterialStats materials={materials} />

      <div className="bg-card p-4 sm:p-6 rounded-xl shadow-lg border">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
          <div className="relative w-full md:w-auto flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t('materialsPage.searchPlaceholder')}
              className="pl-10 w-full sm:w-[350px] h-11 text-base rounded-lg focus:ring-2 focus:ring-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-5 w-5 text-muted-foreground"/>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[200px] h-11 text-base rounded-lg focus:ring-2 focus:ring-primary transition-all">
                <SelectValue placeholder={t('materialsPage.filterCategoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="text-base">
                    {category === 'all' ? t('materialsPage.allCategories') : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-secondary/30 rounded-lg">
            <PackageIcon className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-xl font-semibold text-foreground">{t('materialsPage.noMaterialsFound')}</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              {searchTerm || filterCategory !== 'all' 
                ? t('materialsPage.noMaterialsFoundFilterHint')
                : t('materialsPage.noMaterialsFoundAddHint')}
            </p>
            {!(searchTerm || filterCategory !== 'all') && (
                 <Button onClick={() => openFormDialog('add')} className="mt-6">{t('materialsPage.addNewButton')}</Button>
            )}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredMaterials.map(material => (
              <MaterialCard
                key={material.id}
                material={material}
                assignedProject={projects.find(p => p.id === material.projectId)}
                onEdit={() => openFormDialog('edit', material)}
                onDelete={() => openDeleteDialog(material)}
              />
            ))}
          </motion.div>
        )}
      </div>
      
      <NearbyLocationsCard 
        title={t('materialsPage.nearbyStoresTitle')}
        locations={mockNearbyStores}
        icon={StoreIcon}
      />

      {currentMaterial && formMode === 'edit' && (
        <MaterialFormDialog
          isOpen={isFormDialogOpen && formMode==='edit'}
          onOpenChange={(isOpen) => {
             if (!isOpen) setCurrentMaterial(null);
             setIsFormDialogOpen(isOpen);
          }}
          mode="edit"
          initialData={currentMaterial}
          onSubmit={handleFormSubmit}
          projects={projects}
        />
      )}

      <MaterialDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        materialName={currentMaterial?.name}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default Materials;