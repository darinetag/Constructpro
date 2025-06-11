import React from 'react';
import ProjectSummaryCard from './ProjectSummaryCard';

const ProjectsTabContent = ({ projects, currency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map(project => (
        <ProjectSummaryCard key={project.id} project={project} currency={currency} />
      ))}
    </div>
  );
};

export default ProjectsTabContent;