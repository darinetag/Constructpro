import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const ProjectSummaryCard = ({ project, currency }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'Planning';
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(project.status)}`}>
            {getStatusText(project.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1">Completion</div>
            <div className="flex items-center space-x-2">
              <Progress value={project.completion} className="h-2 flex-1" />
              <span className="text-sm font-medium">{project.completion}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-muted-foreground">Budget</div>
              <div className="font-medium">{project.budget.toLocaleString()} {currency}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Location</div>
              <div className="font-medium">{project.location}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Start Date</div>
              <div className="font-medium">{new Date(project.startDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">End Date</div>
              <div className="font-medium">{new Date(project.endDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSummaryCard;