import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DollarSign, Package, Tag, Info, CalendarDays, UserCircle, Star, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { format } from 'date-fns';
import { getDateFnsLocale } from '@/lib/dateFnsLocaleMapping';

const MarketplaceItemDetailsDialog = ({ isOpen, onOpenChange, item, currency }) => {
  const { t, locale } = useI18n();
  const dateFnsLocale = getDateFnsLocale(locale);

  if (!item) return null;

  const getCategoryBadgeVariant = (category) => {
    switch (category?.toLowerCase()) {
      case 'materials': return 'info';
      case 'equipment': return 'warning';
      case 'services': return 'success';
      default: return 'secondary';
    }
  };

  const getConditionBadgeVariant = (condition) => {
    if (!condition) return 'secondary';
    switch (condition.toLowerCase()) {
      case 'new': return 'success';
      case 'used - like new':
      case 'used - good': 
        return 'info';
      case 'used - fair': return 'warning';
      default: return 'secondary';
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl bg-card text-card-foreground rounded-xl shadow-2xl border-border">
        <ScrollArea className="max-h-[80vh] p-1">
          <DialogHeader className="p-6 border-b border-border">
            <DialogTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
              {item.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1">
              {t('marketplace.details.postedOn', { date: format(new Date(item.datePosted), 'PPP', { locale: dateFnsLocale }) })}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-border">
                <img  
                  src={item.imageUrl || `https://source.unsplash.com/random/400x300/?${item.category},construction`} 
                  alt={item.name} 
                  className="object-cover w-full h-full"
                 src="https://images.unsplash.com/photo-1693148415001-de2f1824a67f" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-2xl font-semibold text-primary">{item.price} {currency}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-muted-foreground" />
                  <Badge variant={getCategoryBadgeVariant(item.category)} className="text-sm">{t(`marketplace.categories.${item.category?.toLowerCase()}`)}</Badge>
                </div>
                {item.condition && (
                  <div className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-muted-foreground" />
                    <Badge variant={getConditionBadgeVariant(item.condition)} className="text-sm">{t(`marketplace.conditions.${item.condition?.toLowerCase().replace(/\s-\s/g, '_').replace(/\s/g, '_')}`)}</Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-1 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  {t('marketplace.details.descriptionTitle')}
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{item.description}</p>
              </div>

              {item.specifications && item.specifications.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    {t('marketplace.details.specificationsTitle')}
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-2">
                    {item.specifications.map((spec, index) => (
                      <li key={index}>{spec}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <UserCircle className="h-5 w-5 mr-2 text-primary" />
                  {t('marketplace.details.sellerInfoTitle')}
                </h3>
                <p className="text-muted-foreground">{t('marketplace.details.sellerName', { name: item.sellerName || t('common.notAvailable') })}</p>
                <p className="text-muted-foreground">{t('marketplace.details.sellerContact', { contact: item.sellerContact || t('common.notAvailable') })}</p>
                {item.sellerRating && (
                   <div className="flex items-center mt-1">
                     <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                     <span className="text-sm text-muted-foreground">{item.sellerRating.toFixed(1)}/5.0</span>
                   </div>
                )}
              </div>

              {item.location && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2 text-primary" />
                    {t('marketplace.details.locationAndAvailability')}
                  </h3>
                  <p className="text-muted-foreground">{t('marketplace.details.location', { location: item.location })}</p>
                  {item.availability && <p className="text-muted-foreground">{t('marketplace.details.availability', { availability: item.availability })}</p>}
                </div>
              )}

            </div>
          </div>
          
          <DialogFooter className="p-6 border-t border-border">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="mr-2"
            >
              {t('actions.close')}
            </Button>
            <Button 
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
              onClick={() => {
                // Implement contact seller or add to cart logic here
                console.log("Contacting seller for item:", item.id);
                onOpenChange(false);
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" /> {t('marketplace.details.contactSellerButton')}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MarketplaceItemDetailsDialog;