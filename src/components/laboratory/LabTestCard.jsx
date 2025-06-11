import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CalendarDays, Beaker, Edit, Trash2, Eye, Download, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/components/ui/use-toast';

const LabTestCard = ({ test, relatedProject, relatedMaterial, onEdit, onDelete, isViewOnlyUser }) => {
  const { t } = useI18n();
  const { toast } = useToast();

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'passed': return 'success';
      case 'failed': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const handleDownloadDocument = () => {
    if (test.documentName) {
      toast({
        title: t('common.toast.documentDownloadInitiated'),
        description: t('common.toast.downloadingDocument', { documentName: test.documentName }),
      });
      console.log(`Simulating download for: ${test.documentName}`);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div variants={cardVariants}>
      <Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-border/50 rounded-lg">
        <CardHeader className="bg-card-foreground/5 p-4 border-b">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold text-foreground">{test.type}</CardTitle>
            <Badge variant={getStatusBadgeVariant(test.status)} className="capitalize text-xs px-2 py-0.5">
              {t(`status.${test.status.toLowerCase().replace('-', '')}`)}
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground pt-1">
            {t('laboratoryPage.admin.card.testId')}: {test.id}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 space-y-3 text-sm flex-grow">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2 text-primary" />
            <span className="text-muted-foreground">{t('laboratoryPage.admin.card.date')}:</span>
            <span className="ml-1 font-medium text-foreground">{format(new Date(test.date), 'PPP')}</span>
          </div>
          
          {relatedProject && (
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              <span className="text-muted-foreground">{t('laboratoryPage.admin.card.project')}:</span>
              <span className="ml-1 font-medium text-foreground">{relatedProject.name}</span>
            </div>
          )}
          
          {relatedMaterial && (
            <div className="flex items-center">
              <Beaker className="h-4 w-4 mr-2 text-primary" />
              <span className="text-muted-foreground">{t('laboratoryPage.admin.card.material')}:</span>
              <span className="ml-1 font-medium text-foreground">{relatedMaterial.name} ({relatedMaterial.category})</span>
            </div>
          )}
          
          <div className="flex items-start">
            <FileText className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="text-muted-foreground">{t('laboratoryPage.admin.card.result')}:</span>
              <p className="ml-1 font-medium text-foreground leading-tight">{test.result || t('common.na')}</p>
            </div>
          </div>

          {test.notes && (
             <div className="flex items-start">
              <FileText className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
              <div>
                <span className="text-muted-foreground">{t('laboratoryPage.admin.form.notesLabel')}:</span>
                <p className="ml-1 text-foreground leading-tight break-words text-xs">{test.notes}</p>
              </div>
            </div>
          )}

          {test.documentName && (
            <div className="flex items-center justify-between pt-2 border-t border-dashed mt-2">
                <div className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground text-xs">{t('laboratoryPage.admin.card.documentAttachedLabel')}:</span>
                    <span className="text-xs font-medium text-foreground truncate max-w-[120px]">{test.documentName}</span>
                </div>
                <Button variant="link" size="sm" onClick={handleDownloadDocument} className="text-xs p-0 h-auto text-primary hover:text-primary/80">
                    <Download className="h-3 w-3 mr-1" />
                    {t('common.download')}
                </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-3 border-t bg-muted/30 flex justify-end space-x-2">
          {isViewOnlyUser ? (
            <Button variant="outline" size="sm" className="text-xs" disabled>
              <Eye className="h-3 w-3 mr-1.5" /> {t('common.viewOnly')}
            </Button>
          ) : (
            <>
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit} className="text-xs">
                  <Edit className="h-3 w-3 mr-1.5" /> {t('common.edit')}
                </Button>
              )}
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={onDelete} className="text-xs">
                  <Trash2 className="h-3 w-3 mr-1.5" /> {t('common.delete')}
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LabTestCard;