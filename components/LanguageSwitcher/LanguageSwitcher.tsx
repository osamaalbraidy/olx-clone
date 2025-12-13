import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { t } = useTranslation('common');

  const switchLanguage = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
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

