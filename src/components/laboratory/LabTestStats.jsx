import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Clock, Activity } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const StatCard = ({ titleKey, value, percentage, icon, colorClass, bgColorClass }) => {
  const { t } = useI18n();
  return (
    <Card className="card-hover transform hover:scale-105 transition-transform duration-300 ease-out shadow-lg">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{t(titleKey)}</CardTitle>
        <div className={`p-2 rounded-full ${bgColorClass}`}>
          {React.cloneElement(icon, { className: `h-5 w-5 ${colorClass}` })}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
        {percentage !== null && (
          <p className="text-xs text-muted-foreground pt-1">
            {percentage}% {t(titleKey.toLowerCase().includes('pending') ? 'laboratoryPage.admin.stats.awaitingResultsSuffix' : 'laboratoryPage.admin.stats.rateSuffix')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};


const LabTestStats = ({ labTests }) => {
  const totalTests = labTests.length;
  const passedTests = labTests.filter(test => test.status === 'passed').length;
  const failedTests = labTests.filter(test => test.status === 'failed').length;
  const pendingTests = labTests.filter(test => test.status === 'pending').length;

  const calculatePercentage = (count) => totalTests > 0 ? parseFloat(((count / totalTests) * 100).toFixed(1)) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        titleKey="laboratoryPage.admin.stats.totalTests" 
        value={totalTests} 
        percentage={null}
        icon={<Activity />}
        colorClass="text-blue-600"
        bgColorClass="bg-blue-100"
      />
      <StatCard 
        titleKey="laboratoryPage.admin.stats.passedTests" 
        value={passedTests} 
        percentage={calculatePercentage(passedTests)}
        icon={<CheckCircle2 />}
        colorClass="text-green-600"
        bgColorClass="bg-green-100"
      />
      <StatCard 
        titleKey="laboratoryPage.admin.stats.failedTests" 
        value={failedTests} 
        percentage={calculatePercentage(failedTests)}
        icon={<XCircle />}
        colorClass="text-red-600"
        bgColorClass="bg-red-100"
      />
      <StatCard 
        titleKey="laboratoryPage.admin.stats.pendingTests" 
        value={pendingTests} 
        percentage={calculatePercentage(pendingTests)}
        icon={<Clock />}
        colorClass="text-amber-600"
        bgColorClass="bg-amber-100"
      />
    </div>
  );
};

export default LabTestStats;