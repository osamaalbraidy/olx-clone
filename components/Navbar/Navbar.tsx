import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';
import { Category } from '@/types';
import styles from './Navbar.module.css';

interface NavbarProps {
  categories: Category[];
}

export default function Navbar({ categories }: NavbarProps) {
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
    { name: 'Cars for Sale', slug: 'cars-for-sale', path: '/vehicles/cars-for-sale/' },
    { name: 'Apartments & Villas For Rent', slug: 'apartments-villas-for-rent', path: '/properties/apartments-villas-for-rent/' },
    { name: 'Mobile Phones', slug: 'mobile-phones', path: '/mobile-phones-accessories/mobile-phones/' },
    { name: 'Laptops, Tablets, Computers', slug: 'laptops-tablets-computers', path: '/electronics-home-appliances/laptops-tablets-computers/' },
    { name: 'Vacation Rentals & Weekend Getaways', slug: 'vacation-rentals-and-weekend-getaways', path: '/properties/vacation-rentals-and-weekend-getaways/' },
    { name: 'Motorcycles & ATVs', slug: 'motorcycles-atv', path: '/vehicles/motorcycles-atv/' },
    { name: 'Home Decoration & Accessories', slug: 'home-decoration-accessories', path: '/home-furniture-decor/home-decoration-accessories/' },
    { name: 'Jobs Available', slug: 'jobs-available', path: '/jobs/jobs-available/' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <div className={styles.allCategoriesContainer} ref={dropdownRef}>
          <button
            className={styles.allCategoriesButton}
            onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
          >
            All categories
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

