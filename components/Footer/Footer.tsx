import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <section className={styles.footerSection}>
          <h4 className={styles.footerSectionTitle}>Popular Categories</h4>
          <ul className={styles.footerList}>
            <li><Link href="/">Cars</Link></li>
            <li><Link href="/">Flats for rent</Link></li>
            <li><Link href="/">Mobile Phones</Link></li>
            <li><Link href="/">Jobs</Link></li>
          </ul>
        </section>
        <section className={styles.footerSection}>
          <h4 className={styles.footerSectionTitle}>Trending Searches</h4>
          <ul className={styles.footerList}>
            <li><Link href="/">Bikes</Link></li>
            <li><Link href="/">Watches</Link></li>
            <li><Link href="/">Books</Link></li>
            <li><Link href="/">Dogs</Link></li>
          </ul>
        </section>
        <section className={styles.footerSection}>
          <h4 className={styles.footerSectionTitle}>About Us</h4>
          <ul className={styles.footerList}>
            <li><Link href="/">Contact Us</Link></li>
            <li><Link href="/">OLX for Businesses</Link></li>
          </ul>
        </section>
        <section className={styles.footerSection}>
          <h4 className={styles.footerSectionTitle}>OLX</h4>
          <ul className={styles.footerList}>
            <li><Link href="/">Help</Link></li>
            <li><Link href="/">Sitemap</Link></li>
            <li><Link href="/">Terms of use</Link></li>
            <li><Link href="/">Privacy Policy</Link></li>
          </ul>
        </section>
        <section className={styles.footerSection}>
          <h4 className={styles.footerSectionTitle}>Follow us</h4>
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
        <p>Classifieds in Lebanon.© 2006 – 2025 OLX</p>
      </div>
    </footer>
  );
}

