import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useTranslation('common');
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <section className={styles.footerSection}>
          <h4 className={styles.footerSectionTitle}>{t('footer.popularCategories')}</h4>
          <ul className={styles.footerList}>
            <li><Link href="/">{t('footer.links.cars')}</Link></li>
            <li><Link href="/">{t('footer.links.flatsForRent')}</Link></li>
            <li><Link href="/">{t('footer.links.mobilePhones')}</Link></li>
            <li><Link href="/">{t('footer.links.jobs')}</Link></li>
          </ul>
        </section>
        <section className={styles.footerSection}>
          <h4 className={styles.footerSectionTitle}>{t('footer.trendingSearches')}</h4>
          <ul className={styles.footerList}>
            <li><Link href="/">{t('footer.links.bikes')}</Link></li>
            <li><Link href="/">{t('footer.links.watches')}</Link></li>
            <li><Link href="/">{t('footer.links.books')}</Link></li>
            <li><Link href="/">{t('footer.links.dogs')}</Link></li>
          </ul>
        </section>
        <section className={styles.footerSection}>
          <h4 className={styles.footerSectionTitle}>{t('footer.aboutUs')}</h4>
          <ul className={styles.footerList}>
            <li><Link href="/">{t('footer.links.contactUs')}</Link></li>
            <li><Link href="/">{t('footer.links.olxForBusinesses')}</Link></li>
          </ul>
        </section>
        <section className={styles.footerSection}>
          <h4 className={styles.footerSectionTitle}>{t('footer.olx')}</h4>
          <ul className={styles.footerList}>
            <li><Link href="/">{t('footer.links.help')}</Link></li>
            <li><Link href="/">{t('footer.links.sitemap')}</Link></li>
            <li><Link href="/">{t('footer.links.termsOfUse')}</Link></li>
            <li><Link href="/">{t('footer.links.privacyPolicy')}</Link></li>
          </ul>
        </section>
        <section className={styles.footerSection}>
          <h4 className={styles.footerSectionTitle}>{t('footer.followUs')}</h4>
          <div className={styles.socialIcons}>
            <Link href="/" className={styles.socialIcon} aria-label="Facebook">
              <FaFacebook />
            </Link>
            <Link href="/" className={styles.socialIcon} aria-label="Youtube">
              <FaYoutube />
            </Link>
            <Link href="/" className={styles.socialIcon} aria-label="Instagram">
              <FaInstagram />
            </Link>
          </div>
          <div className={styles.footerAppBadges}>
            <Link href="/" className={styles.footerAppBadge}>
              <Image
                src="https://www.olx.com.lb/assets/iconAppStoreEN_noinline.a731d99c8218d6faa0e83a6d038d08e8.svg"
                alt="App Store"
                width={100}
                height={33}
              />
            </Link>
            <Link href="/" className={styles.footerAppBadge}>
              <Image
                src="https://www.olx.com.lb/assets/iconGooglePlayEN_noinline.9892833785b26dd5896b7c70b089f684.svg"
                alt="Google Play"
                width={100}
                height={33}
              />
            </Link>
            <Link href="/" className={styles.footerAppBadge}>
              <Image
                src="https://www.olx.com.lb/assets/iconAppGallery_noinline.6092a9d739c77147c884f1f7ab3f1771.svg"
                alt="App Gallery"
                width={100}
                height={33}
              />
            </Link>
          </div>
        </section>
      </div>
      <div className={styles.footerBottom}>
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}

