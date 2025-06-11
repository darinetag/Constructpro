import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Phone, Mail, Briefcase, DollarSign, Tag, Award } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const PersonnelCard = ({ person, assignedProject, onEdit, onDelete }) => {
  const { t } = useI18n();
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const statusKey = person.status === 'active' ? 'status.active' : 
                    person.status === 'on-leave' ? 'status.on_leave' : 
                    'status.inactive';


  return (
    <motion.div variants={itemVariants}>
      <Card className="card-hover flex flex-col h-full bg-card text-card-foreground border-border shadow-lg transition-all duration-300 hover:shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-4 bg-gradient-to-br from-card to-muted/30">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <img  
                src={person.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name.split(' ').join('')}`} 
                alt={person.name} 
                className="h-16 w-16 rounded-full border-2 border-primary shadow-md object-cover"
               src="https://images.unsplash.com/photo-1697256200022-f61abccad430" />
              <div>
                <CardTitle className="text-lg font-semibold text-primary">{person.name}</CardTitle>
                <CardDescription className="flex items-center text-xs text-muted-foreground mt-1">
                  <Briefcase className="h-3.5 w-3.5 mr-1 text-primary/70" />
                  {person.role}
                </CardDescription>
              </div>
            </div>
            <div className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
              person.status === 'active' ? 'bg-green-500/10 text-green-600 border-green-500/30' : 
              person.status === 'on-leave' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30' :
              'bg-red-500/10 text-red-600 border-red-500/30'
            }`}>
              {t(statusKey)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3 flex-grow">
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="h-4 w-4 mr-2 text-primary/70" />
            {person.contact || t('common.notAvailable')}
          </div>
          {person.phone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="h-4 w-4 mr-2 text-primary/70" />
              {person.phone}
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2 text-primary/70" />
            {person.hourlyRate} {t('currency.dZD')} / {t('personnelPage.hourlyRateSuffix')}
          </div>
          {person.experience && (
             <div className="flex items-center text-sm text-muted-foreground">
                <Award className="h-4 w-4 mr-2 text-primary/70" />
                {person.experience} {t('personnelPage.experienceSuffix')}
              </div>
          )}
          {assignedProject && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4 mr-2 text-primary/70" />
              {t('personnelPage.assignedProjectLabel')}: {assignedProject.name}
            </div>
          )}
          {(person.skills && person.skills.length > 0) && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">{t('personnelPage.skillsTitle')}</h4>
              <div className="flex flex-wrap gap-1.5">
                {(person.skills || []).map((skill, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium border border-primary/20"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <div className="p-4 border-t border-border/50 bg-muted/20">
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2.5 text-primary border-primary/50 hover:bg-primary/10 hover:border-primary"
                onClick={() => onEdit(person)}
              >
                <Edit className="h-3.5 w-3.5" />
                <span className="sr-only">{t('actions.edit')}</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2.5 text-destructive border-destructive/50 hover:bg-destructive/10 hover:border-destructive"
                onClick={() => onDelete(person)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="sr-only">{t('actions.delete')}</span>
              </Button>
            </div>
          </div>
      </Card>
    </motion.div>
  );
};

export default PersonnelCard;