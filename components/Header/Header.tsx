import Link from 'next/link';
import { FaMapMarkerAlt, FaSearch, FaChevronDown, FaPlus } from 'react-icons/fa';
import Logo from '@/components/Logo/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerRow1}>
          <Logo />
        </div>
        <div className={styles.headerRow2}>
          <div className={styles.locationSelector}>
            <FaMapMarkerAlt className={styles.locationPin} />
            <span className={styles.locationText}>Lebanon</span>
            <FaChevronDown className={styles.locationArrow} />
          </div>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Find Cars, Mobile Phones and more..."
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>
              <FaSearch />
            </button>
          </div>
          <div className={styles.headerActions}>
            <LanguageSwitcher />
            <Link href="/" className={styles.loginLink}>Login</Link>
            <Link href="/post-ad" className={styles.sellButton}>
              <FaPlus />
              <span>Sell</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

