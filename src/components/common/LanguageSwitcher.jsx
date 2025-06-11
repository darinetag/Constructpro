import React from 'react';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { locale, changeLocale, t } = useI18n();

  const languages = [
    { code: 'en', name: 'English', labelKey: 'languageSwitcher.toggleToEnglish' },
    { code: 'fr', name: 'Français', labelKey: 'languageSwitcher.toggleToFrench' },
    { code: 'ar', name: 'العربية', labelKey: 'languageSwitcher.toggleToArabic' },
  ];

  const currentLanguageName = languages.find(lang => lang.code === locale)?.name || 'Language';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('languageSwitcher.currentLanguage', { language: currentLanguageName })} className="rounded-full">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onClick={() => changeLocale(lang.code)}
            className={locale === lang.code ? "bg-accent" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;