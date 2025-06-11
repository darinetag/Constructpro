import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Settings2, MapPin, DollarSign, Briefcase, Phone, Mail, Edit, Trash2, Eye, Info } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const MarketplaceItemCard = ({ item, onEdit, onDelete, onViewDetails, isProjectOwner, userProfile }) => {
  const { t } = useI18n();
  const currencySymbol = t('currency.dZD');
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const Icon = item.itemType === 'personnel_listing' ? User 
             : item.itemType === 'service_listing' ? Settings2 
             : Briefcase; 

  const canEditOrDelete = (!isProjectOwner || (isProjectOwner && item.itemType === 'job_opening' && item.contact === userProfile?.email));

  const getItemTypeTranslation = (itemType) => {
    if (!itemType) return t('marketplace.itemTypes.genericListing', 'Listing'); 
    const key = `marketplace.itemTypes.${itemType.replace(/_/g, '')}`;
    const translation = t(key);
    if (translation === key) {
      if (itemType.includes('personnel')) return t('marketplace.itemTypes.personnellisting', 'Personnel Listing');
      if (itemType.includes('service')) return t('marketplace.itemTypes.servicelisting', 'Service Listing');
      if (itemType.includes('job')) return t('marketplace.itemTypes.jobopening', 'Job Opening');
      return itemType.replace('_', ' '); 
    }
    return translation;
  };

  return (
    <motion.div variants={cardVariants}>
      <Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-border/50 rounded-lg bg-card text-card-foreground">
        <CardHeader className="bg-card-foreground/5 p-4 border-b">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Icon className="h-5 w-5 mr-2 text-primary" />
              {item.name}
            </CardTitle>
            <Badge variant="secondary" className="capitalize text-xs px-2 py-0.5">
              {getItemTypeTranslation(item.itemType)}
            </Badge>
          </div>
          {item.role && <CardDescription className="text-xs text-muted-foreground pt-1">{item.role}</CardDescription>}
          {item.provider && <CardDescription className="text-xs text-muted-foreground pt-1">{t('marketplace.provider')}: {item.provider}</CardDescription>}
          {item.company && <CardDescription className="text-xs text-muted-foreground pt-1">{t('marketplace.company')}: {item.company}</CardDescription>}
        </CardHeader>

        <CardContent className="p-4 space-y-2 text-sm flex-grow">
          {item.description && <p className="text-muted-foreground text-xs mb-2 leading-relaxed line-clamp-3">{item.description}</p>}
          
          {item.itemType === 'personnel_listing' && (
            <>
              {item.experience && <p><span className="font-medium">{t('marketplace.experience')}:</span> {item.experience}</p>}
              {item.hourlyRate && <p className="flex items-center"><DollarSign className="h-4 w-4 mr-1 text-green-500" /> <span className="font-medium">{t('marketplace.rate')}:</span> {item.hourlyRate} {currencySymbol}/{t('marketplace.hr')}</p>}
              {item.skills && Array.isArray(item.skills) && item.skills.length > 0 && (
                <div className="pt-1">
                  <span className="font-medium">{t('marketplace.skills')}:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.skills.slice(0, 3).map(skill => <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>)}
                    {item.skills.length > 3 && <Badge variant="outline" className="text-xs">+{item.skills.length - 3} {t('marketplace.more')}</Badge>}
                  </div>
                </div>
              )}
            </>
          )}

          {item.itemType === 'service_listing' && (
            <>
              {item.rate && <p className="flex items-center"><DollarSign className="h-4 w-4 mr-1 text-green-500" /> <span className="font-medium">{t('marketplace.rate')}:</span> {item.rate.includes(currencySymbol) ? item.rate : `${item.rate} ${currencySymbol}`}</p>}
            </>
          )}
          
          {item.itemType === 'job_opening' && (
             <>
              {item.salaryRange && <p className="flex items-center"><DollarSign className="h-4 w-4 mr-1 text-green-500" /> <span className="font-medium">{t('marketplace.salary')}:</span> {item.salaryRange.includes(currencySymbol) ? item.salaryRange : `${item.salaryRange} ${currencySymbol}`}</p>}
              {item.jobType && <p><span className="font-medium">{t('marketplace.jobType')}:</span> {item.jobType}</p>}
            </>
          )}

          {item.availability && <p><span className="font-medium">{t('marketplace.availability')}:</span> {item.availability}</p>}
          {item.location && <p className="flex items-center"><MapPin className="h-4 w-4 mr-1 text-blue-500" /> {item.location}</p>}
          
        </CardContent>

        <CardFooter className="p-3 border-t bg-muted/30">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {item.contact?.includes('@') ? <Mail className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />}
              <span>{item.contact}</span>
            </div>
            <div className="flex space-x-1 sm:space-x-2">
              <Button variant="outline" size="sm" onClick={() => onViewDetails(item)} className="text-xs">
                <Info className="h-3 w-3 mr-1 sm:mr-1.5" /> {t('marketplace.detailsButton')}
              </Button>
              {canEditOrDelete && onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(item)} className="text-xs">
                  <Edit className="h-3 w-3 mr-1 sm:mr-1.5" /> {t('marketplace.editButton')}
                </Button>
              )}
              {canEditOrDelete && onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(item)} className="text-xs">
                  <Trash2 className="h-3 w-3 mr-1 sm:mr-1.5" /> {t('marketplace.deleteButton')}
                </Button>
              )}
              {(isProjectOwner && !canEditOrDelete) && (
                <Button variant="outline" size="sm" className="text-xs" disabled>
                  <Eye className="h-3 w-3 mr-1 sm:mr-1.5" /> {t('marketplace.viewOnlyButton')}
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MarketplaceItemCard;