import Link from 'next/link';
import Image from 'next/image';
import styles from './AppPromotion.module.css';

export default function AppPromotion() {
  return (
    <div className={styles.appPromotion}>
      <div className={styles.appPromotionContent}>
        <div className={styles.appPromotionText}>
          <div className={styles.appPromotionTitle}>Find amazing deals on the go.</div>
          <div className={styles.appPromotionSubtitle}>Download OLX app now!</div>
        </div>
        <div className={styles.appPromotionImage}>
          <Image
            src="https://www.olx.com.lb/assets/olxMobileApp.e928f8475339cf7b05bbf6db4e610b13.webp"
            alt="OLX mobile app"
            width={200}
            height={200}
          />
        </div>
        <div className={styles.appPromotionBadges}>
          <Link href="/" className={styles.appBadge}>
            <Image
              src="https://www.olx.com.lb/assets/iconAppStoreEN_noinline.a731d99c8218d6faa0e83a6d038d08e8.svg"
              alt="App Store"
              width={120}
              height={40}
            />
          </Link>
          <Link href="/" className={styles.appBadge}>
            <Image
              src="https://www.olx.com.lb/assets/iconGooglePlayEN_noinline.9892833785b26dd5896b7c70b089f684.svg"
              alt="Google Play"
              width={120}
              height={40}
            />
          </Link>
          <Link href="/" className={styles.appBadge}>
            <Image
              src="https://www.olx.com.lb/assets/iconAppGallery_noinline.6092a9d739c77147c884f1f7ab3f1771.svg"
              alt="App Gallery"
              width={120}
              height={40}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

