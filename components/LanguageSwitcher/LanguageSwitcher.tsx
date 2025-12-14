import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { t } = useTranslation('common');

  const switchLanguage = (locale: string) => {
    // Get the current path
    const currentPath = router.asPath;
    
    // Navigate to the same path with new locale
    // This will trigger getServerSideProps with the new locale
    router.push(currentPath, currentPath, { locale });
  };

  const currentLocale = router.locale || 'en';

  return (
    <button
      className={styles.languageButton}
      onClick={() => switchLanguage(currentLocale === 'en' ? 'ar' : 'en')}
      aria-label={t('language.switch')}
    >
      {currentLocale === 'en' ? 'العربية' : 'English'}
    </button>
  );
}

