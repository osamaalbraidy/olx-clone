import { Ad } from '@/types';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import styles from './AdCard.module.css';

interface AdCardProps {
  ad: Ad;
  onClick?: () => void;
}

export default function AdCard({ ad, onClick }: AdCardProps) {
  const { t } = useTranslation('common');
  const currency = ad.currency || 'USD';
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(ad.price);

  return (
    <div className={styles.adCard} onClick={onClick}>
      <div className={styles.imageContainer}>
        {ad.images && ad.images.length > 0 ? (
          <Image
            src={ad.images[0]}
            alt={ad.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className={styles.placeholderImage}>{t('adCard.noImage')}</div>
        )}
        {ad.featured && <span className={styles.featuredBadge}>{t('adCard.featured')}</span>}
      </div>
      <div className={styles.content}>
        <div className={styles.priceRow}>
          <div className={styles.price}>{formattedPrice}</div>
          {ad.metadata?.negotiable && (
            <span className={styles.negotiable}>{t('adCard.negotiable')}</span>
          )}
        </div>
        <h3 className={styles.title}>{ad.title}</h3>
        <div className={styles.favoriteIcon}>
          <FaHeart />
        </div>
        {ad.metadata && (
          <div className={styles.metadata}>
            {ad.metadata.km && <span>{ad.metadata.km}</span>}
            {ad.metadata.year && (
              <>
                {ad.metadata.km && <span className={styles.separator}>•</span>}
                <span>{ad.metadata.year}</span>
              </>
            )}
            {ad.metadata.bedrooms && (
              <>
                {(ad.metadata.km || ad.metadata.year) && <span className={styles.separator}>•</span>}
                <span>{ad.metadata.bedrooms}</span>
              </>
            )}
            {ad.metadata.bathrooms && (
              <>
                {ad.metadata.bedrooms && <span className={styles.separator}>•</span>}
                <span>{ad.metadata.bathrooms}</span>
              </>
            )}
            {ad.metadata.size && (
              <>
                {(ad.metadata.km || ad.metadata.year || ad.metadata.bedrooms) && <span className={styles.separator}>•</span>}
                <span>{ad.metadata.size}</span>
              </>
            )}
          </div>
        )}
        <div className={styles.locationDateRow}>
          {ad.location && (
            <span className={styles.location}>{ad.location}</span>
          )}
          {ad.datePosted && (
            <span className={styles.date}>{formatDate(ad.datePosted, t)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString: string, t: (key: string, options?: { count?: number }) => string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t('date.today');
  if (diffDays === 1) return t('date.dayAgo', { count: 1 });
  if (diffDays < 7) return t('date.daysAgo', { count: diffDays });
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? t('date.weekAgo', { count: 1 }) : t('date.weeksAgo', { count: weeks });
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? t('date.monthAgo', { count: 1 }) : t('date.monthsAgo', { count: months });
  }
  const years = Math.floor(diffDays / 365);
  return years === 1 ? t('date.yearAgo', { count: 1 }) : t('date.yearsAgo', { count: years });
}

