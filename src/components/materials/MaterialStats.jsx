import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, Tag } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon, colorClass, bgColorClass }) => (
  <Card className="card-hover transform hover:scale-105 transition-transform duration-300 ease-out shadow-lg">
    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={`p-2 rounded-full ${bgColorClass}`}>
        {React.cloneElement(icon, { className: `h-5 w-5 ${colorClass}` })}
      </div>
    </CardHeader>
    <CardContent>
      <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
      <p className="text-xs text-muted-foreground pt-1">{subtext}</p>
    </CardContent>
  </Card>
);


const MaterialStats = ({ materials }) => {
  const totalInventoryValue = materials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0);
  const lowStockMaterialsCount = materials.filter(m => m.quantity < 100).length; // Arbitrary threshold
  const uniqueCategoriesCount = new Set(materials.map(m => m.category)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard 
        title="Total Inventory Value" 
        value={`$${totalInventoryValue.toLocaleString()}`}
        subtext={`${materials.length} different materials`}
        icon={<Package />}
        colorClass="text-blue-600"
        bgColorClass="bg-blue-100"
      />
      <StatCard 
        title="Low Stock Alert" 
        value={lowStockMaterialsCount} 
        subtext="materials running low"
        icon={<AlertTriangle />}
        colorClass="text-amber-600"
        bgColorClass="bg-amber-100"
      />
      <StatCard 
        title="Material Categories" 
        value={uniqueCategoriesCount} 
        subtext="unique categories"
        icon={<Tag />}
        colorClass="text-green-600"
        bgColorClass="bg-green-100"
      />
    </div>
  );
};

export default MaterialStats;