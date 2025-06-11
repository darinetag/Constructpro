import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useI18n } from '@/context/I18nContext';

const StatCard = ({ titleKey, value, icon, descriptionKey, descriptionValue, progressValue, progressTextKey, progressTextValue, footerContent, currency }) => {
  const { t } = useI18n();
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const displayValue = typeof value === 'number' ? `${value.toLocaleString(t('localeCode', 'en-US'))} ${currency || ''}`.trim() : value;
  const title = t(titleKey);
  const description = descriptionKey ? t(descriptionKey, { count: descriptionValue }) : null;
  const progressText = progressTextKey ? t(progressTextKey, { value: progressTextValue }) : null;


  return (
    <motion.div variants={item}>
      <Card className="card-hover h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayValue}</div>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          {progressValue !== undefined && (
            <div className="mt-4">
              <Progress value={progressValue} className="h-2" />
              {progressText && <p className="text-xs text-muted-foreground mt-1">{progressText}</p>}
            </div>
          )}
          {footerContent && <div className="mt-4">{footerContent}</div>}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;