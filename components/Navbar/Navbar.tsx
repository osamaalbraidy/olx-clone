import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';
import { Category } from '@/types';
import styles from './Navbar.module.css';

interface NavbarProps {
  categories: Category[];
}

export default function Navbar({ categories }: NavbarProps) {
  const { t } = useTranslation('common');
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoriesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Group categories by parent for dropdown
  const groupedCategories = (categories || [])
    .filter((cat) => !cat.parentID) // Only top-level categories
    .map((cat) => ({
      parent: cat,
      children: cat.children || [],
    }));

  // Popular category links (matching OLX website)
  const popularCategories = [
    { name: t('navbar.popularCategories.carsForSale'), slug: 'cars-for-sale', path: '/vehicles/cars-for-sale/' },
    { name: t('navbar.popularCategories.apartmentsForRent'), slug: 'apartments-villas-for-rent', path: '/properties/apartments-villas-for-rent/' },
    { name: t('navbar.popularCategories.mobilePhones'), slug: 'mobile-phones', path: '/mobile-phones-accessories/mobile-phones/' },
    { name: t('navbar.popularCategories.laptops'), slug: 'laptops-tablets-computers', path: '/electronics-home-appliances/laptops-tablets-computers/' },
    { name: t('navbar.popularCategories.vacationRentals'), slug: 'vacation-rentals-and-weekend-getaways', path: '/properties/vacation-rentals-and-weekend-getaways/' },
    { name: t('navbar.popularCategories.motorcycles'), slug: 'motorcycles-atv', path: '/vehicles/motorcycles-atv/' },
    { name: t('navbar.popularCategories.homeDecoration'), slug: 'home-decoration-accessories', path: '/home-furniture-decor/home-decoration-accessories/' },
    { name: t('navbar.popularCategories.jobsAvailable'), slug: 'jobs-available', path: '/jobs/jobs-available/' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <div className={styles.allCategoriesContainer} ref={dropdownRef}>
          <button
            className={styles.allCategoriesButton}
            onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
          >
            {t('navbar.allCategories')}
            <FaChevronDown className={styles.dropdownArrow} />
          </button>
          {showCategoriesDropdown && (
            <div className={styles.categoriesDropdown}>
              <div className={styles.categoriesGrid}>
                {Array.isArray(groupedCategories) && groupedCategories.map((group) => (
                  <div key={group.parent.id} className={styles.categoryColumn}>
                    <Link
                      href="/"
                      className={styles.categoryParent}
                      onClick={() => setShowCategoriesDropdown(false)}
                    >
                      {group.parent.name}
                    </Link>
                    {group.children?.map((child) => (
                      <Link
                        key={child.id}
                        href="/"
                        className={styles.categoryChild}
                        onClick={() => setShowCategoriesDropdown(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={styles.popularCategories}>
          {popularCategories.map((cat) => (
            <Link key={cat.slug} href="/" className={styles.popularCategoryLink}>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

