import React from 'react';
import OverviewStats from '@/components/dashboard/OverviewStats';
import UpcomingDeadlinesCard from '@/components/dashboard/UpcomingDeadlinesCard';
import AlertsCard from '@/components/dashboard/AlertsCard';

const OverviewTabContent = ({ projects, personnel, materials, finances, containerVariants, currency }) => {
  return (
    <>
      <OverviewStats
        projects={projects}
        personnel={personnel}
        materials={materials}
        finances={finances}
        containerVariants={containerVariants}
        currency={currency}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingDeadlinesCard projects={projects} />
        <AlertsCard 
          projects={projects} 
          materials={materials} 
          finances={finances} 
        />
      </div>
    </>
  );
};

export default OverviewTabContent;