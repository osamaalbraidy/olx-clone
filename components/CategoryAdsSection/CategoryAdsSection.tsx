import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';
import { Ad } from '@/types';
import AdCard from '@/components/AdCard/AdCard';
import styles from './CategoryAdsSection.module.css';

interface CategoryAdsSectionProps {
  category: string;
  ads: Ad[];
}

export default function CategoryAdsSection({ category, ads }: CategoryAdsSectionProps) {
  const { t } = useTranslation('common');
  
  return (
    <section className={styles.categorySection}>
      <div className={styles.categoryHeader}>
        <h2 className={styles.categoryTitle}>{category}</h2>
        <Link href="/" className={styles.viewMoreLink}>
          <span>{t('categoryAds.viewMore')}</span>
          <FaChevronRight className={styles.viewMoreArrow} />
        </Link>
      </div>
      <div className={styles.adsGrid}>
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </section>
  );
}

