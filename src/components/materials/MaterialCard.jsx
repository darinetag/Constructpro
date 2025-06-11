import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Store, Tag, Briefcase } from 'lucide-react';

const MaterialCard = ({ material, assignedProject, onEdit, onDelete, currency = 'DZD' }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const isLowStock = material.quantity < 100; 

  return (
    <motion.div variants={itemVariants}>
      <Card className={`card-hover h-full flex flex-col ${isLowStock ? 'border-amber-400 border-2 shadow-amber-200/50' : 'border-border'}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold text-primary">{material.name}</CardTitle>
              <CardDescription className="flex items-center mt-1 text-sm">
                <Tag className="h-4 w-4 mr-1.5 text-muted-foreground" />
                {material.category}
              </CardDescription>
            </div>
            {isLowStock && (
              <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300">
                Low Stock
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 flex-grow">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Quantity</div>
              <div className="font-medium">{material.quantity.toLocaleString()} {material.unit}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Unit Price</div>
              <div className="font-medium">{material.unitPrice.toLocaleString()} {currency}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total Value</div>
              <div className="font-medium">{(material.quantity * material.unitPrice).toLocaleString()} {currency}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Last Ordered</div>
              <div className="font-medium">{new Date(material.lastOrdered).toLocaleDateString()}</div>
            </div>
          </div>
          
          <div className="flex items-center text-sm pt-1">
            <Store className="h-4 w-4 mr-2 text-muted-foreground" />
            Supplier: <span className="font-medium ml-1">{material.supplier}</span>
          </div>
          
          {assignedProject && (
            <div className="flex items-center text-sm">
              <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
              Project: <span className="font-medium ml-1">{assignedProject.name}</span>
            </div>
          )}
        </CardContent>
        <div className="p-4 pt-3 border-t mt-auto flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 px-3"
              onClick={() => onEdit(material)}
            >
              <Edit className="h-4 w-4 mr-1.5" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 px-3 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/50 hover:border-destructive"
              onClick={() => onDelete(material)}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default MaterialCard;