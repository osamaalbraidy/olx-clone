import { useState, useEffect } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import Image from 'next/image';
import { Category } from '@/types';
import { fetchCategories } from '@/lib/api/categories';
import { useTranslation } from 'next-i18next';
import styles from './CategorySelector.module.css';

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onCategorySelect: (category: Category | null) => void;
}

export default function CategorySelector({
  selectedCategory,
  onCategorySelect,
}: CategorySelectorProps) {
  const { t } = useTranslation('common');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navigationPath, setNavigationPath] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      buildNavigationPath(selectedCategory, categories);
    }
  }, [selectedCategory, categories]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const buildNavigationPath = (category: Category, allCategories: Category[]) => {
    const path: Category[] = [];
    let current: Category | undefined = category;

    const findCategory = (cats: Category[], id: number): Category | undefined => {
      for (const cat of cats) {
        if (cat.id === id) return cat;
        if (cat.children) {
          const found = findCategory(cat.children, id);
          if (found) return found;
        }
      }
      return undefined;
    };

    while (current) {
      path.unshift(current);
      if (current.parentID) {
        current = findCategory(allCategories, current.parentID);
      } else {
        break;
      }
    }

    // Set navigation path up to but not including the selected category
    setNavigationPath(path.slice(0, -1));
  };

  const handleCategoryClick = (category: Category, level: number, isGridClick: boolean = false) => {
    if (isGridClick) {
      // Clicking from grid - if category has children, show table view
      if (category.children && category.children.length > 0) {
        setNavigationPath([category]);
        onCategorySelect(null);
      } else {
        // Leaf category from grid - select it
        onCategorySelect(category);
      }
    } else {
      // Clicking from table view
      if (category.children && category.children.length > 0) {
        // If category has children, navigate deeper by updating navigation path
        const newPath = navigationPath.slice(0, level);
        newPath.push(category);
        setNavigationPath(newPath);
        // Clear selection when navigating to a new level
        onCategorySelect(null);
      } else {
        // Leaf category selected - final selection
        onCategorySelect(category);
      }
    }
  };

  const handleBackToGrid = () => {
    setNavigationPath([]);
    onCategorySelect(null);
  };

  const getCategoriesForLevel = (level: number): Category[] => {
    let levelCategories: Category[] = [];
    
    if (level === 0) {
      // First level in table view - show children of the first category in navigation path
      if (navigationPath[0]) {
        levelCategories = navigationPath[0].children || [];
      }
    } else {
      // Get categories from the parent at level - 1 (the category that was clicked to get to this level)
      if (navigationPath[level - 1]) {
        const parentCategory = navigationPath[level - 1];
        levelCategories = parentCategory.children || [];
      }
    }
    
    // Sort by displayPriority
    return levelCategories.sort((a, b) => (a.displayPriority || 0) - (b.displayPriority || 0));
  };

  const isCategorySelected = (category: Category, level: number): boolean => {
    // Check if this category is in the navigation path
    if (navigationPath[level] && navigationPath[level].id === category.id) {
      return true;
    }
    // Check if this is the selected category (for leaf nodes)
    if (selectedCategory && selectedCategory.id === category.id) {
      return true;
    }
    return false;
  };

  const getMaxLevel = (): number => {
    // When we have a navigation path, show columns for:
    // - Level 0: children of navigationPath[0]
    // - Level 1+: children of navigationPath[1], navigationPath[2], etc.
    // - Plus one more level for children of the last category in path
    return navigationPath.length + 1;
  };

  const getTopLevelCategories = (): Category[] => {
    return categories
      .filter((cat) => !cat.parentID || cat.parentID === null)
      .sort((a, b) => (a.displayPriority || 0) - (b.displayPriority || 0));
  };

  // Map category names to icon URLs
  const getCategoryIcon = (categoryName: string): string | null => {
    const iconMap: Record<string, string> = {
      'Vehicles': 'https://www.olx.com.lb/assets/vehicles.74fb4e1f768784288a0c358372fe3f8b.png',
      'Properties': 'https://www.olx.com.lb/assets/property.d5813812616778f179963565f8a533ca.png',
      'Mobile Phones & Accessories': 'https://www.olx.com.lb/assets/mobile-phones-accessories.fa686c4b6a528d5dba5fcaf4216669fd.png',
      'Mobiles & Accessories': 'https://www.olx.com.lb/assets/mobile-phones-accessories.fa686c4b6a528d5dba5fcaf4216669fd.png',
      'Electronics & Home Appliances': 'https://www.olx.com.lb/assets/electronics-home-appliances.2a32a75df439dfc0d7e1d8b99826d41c.png',
      'Electronics & Appliances': 'https://www.olx.com.lb/assets/electronics-home-appliances.2a32a75df439dfc0d7e1d8b99826d41c.png',
      'Home Furniture & Decor': 'https://www.olx.com.lb/assets/home-furniture-decor.fbc166b0b12e9d5f8f739be50194ad25.png',
      'Furniture & Decor': 'https://www.olx.com.lb/assets/home-furniture-decor.fbc166b0b12e9d5f8f739be50194ad25.png',
      'Business & Industrial': 'https://www.olx.com.lb/assets/business-industrial.5ce4bde7ea9273b407f7ad46505a5cc5.png',
      'Businesses & Industrial': 'https://www.olx.com.lb/assets/business-industrial.5ce4bde7ea9273b407f7ad46505a5cc5.png',
      'Pets': 'https://www.olx.com.lb/assets/pets.1a36a96ea593ace65f6b95fd57e7f21a.png',
      'Kids & Babies': 'https://www.olx.com.lb/assets/kids-babies.bcfd4ede63f7c505cb04023ba00cea33.png',
      'Sports & Equipment': 'https://www.olx.com.lb/assets/sports-equipment.3dd8e635faf78e841a0e37cf1efd839c.png',
      'Hobbies, Music, Art & Books': 'https://www.olx.com.lb/assets/hobbies-music-art-books.41b9abcabd86f9245dffed53b2662909.png',
      'Hobbies': 'https://www.olx.com.lb/assets/hobbies-music-art-books.41b9abcabd86f9245dffed53b2662909.png',
      'Jobs': 'https://www.olx.com.lb/assets/jobs.d998b37fb9610644be7854e07eebcc57.png',
      'Fashion & Beauty': 'https://www.olx.com.lb/assets/fashion-beauty.e7680669aee4a534134043be9a312daa.png',
      'Services': 'https://www.olx.com.lb/assets/services.500ad9620e19c68ff07a413734bdd6f9.png',
    };

    // Try exact match first
    if (iconMap[categoryName]) {
      return iconMap[categoryName];
    }

    // Try partial match
    for (const [key, value] of Object.entries(iconMap)) {
      if (categoryName.includes(key) || key.includes(categoryName)) {
        return value;
      }
    }

    return null;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>{t('home.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={loadCategories} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  // Show grid view if no navigation path (initial state)
  const showGridView = navigationPath.length === 0;
  const topLevelCategories = getTopLevelCategories();

  if (showGridView) {
    // Grid view - show top-level categories as cards
    return (
      <div className={styles.categorySelector}>
        <div className={styles.categoryGrid}>
          {topLevelCategories.map((category) => {
            const iconUrl = getCategoryIcon(category.name);
            const hasChildren = category.children && category.children.length > 0;
            const isSelected = selectedCategory?.id === category.id;
            
            return (
              <button
                key={category.id}
                className={`${styles.categoryCard} ${
                  isSelected ? styles.selected : ''
                }`}
                onClick={() => handleCategoryClick(category, 0, true)}
                aria-label={`Category: ${category.name}`}
              >
                <div className={styles.categoryCardContent}>
                  {iconUrl && (
                    <div className={styles.categoryCardIcon}>
                      <Image
                        src={iconUrl}
                        alt={category.name}
                        width={48}
                        height={48}
                        className={styles.categoryCardIconImage}
                      />
                    </div>
                  )}
                  <span className={styles.categoryCardName}>{category.name}</span>
                </div>
                {hasChildren && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.categoryCardArrow}
                    viewBox="0 0 32 32"
                  >
                    <path d="M7.55 3.36c-.8-.8-.7-2.1.1-2.8.8-.7 2-.7 2.7 0l14 14c.8.8.8 2 0 2.8l-14 14c-.8.8-2 .8-2.8.1-.8-.8-.8-2-.1-2.8l.1-.1 12.6-12.5-12.6-12.7z"></path>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Table view - show 3-column grid layout
  const topLevelCategoriesForTable = getTopLevelCategories();
  const secondColumnCategories = navigationPath[0]?.children || [];
  const thirdColumnCategories = navigationPath[1]?.children || [];

  return (
    <div className={styles.categorySelector}>
      <div className={styles.categoryTable}>
        {/* Column 1: All top-level categories - always visible */}
        <div className={styles.tableColumn}>
          {topLevelCategoriesForTable.map((category) => {
            const iconUrl = getCategoryIcon(category.name);
            const hasChildren = category.children && category.children.length > 0;
            const isSelected = navigationPath[0]?.id === category.id;
            
            return (
              <button
                key={category.id}
                className={`${styles.tableCategoryItem} ${
                  isSelected ? styles.tableSelected : ''
                }`}
                onClick={() => handleCategoryClick(category, 0, true)}
                aria-label={`Category level 0: ${category.name}`}
              >
                <div className={styles.tableCategoryContent}>
                  {iconUrl && (
                    <div className={styles.tableCategoryIcon}>
                      <Image
                        src={iconUrl}
                        alt={category.name}
                        width={32}
                        height={32}
                        className={styles.tableCategoryIconImage}
                      />
                    </div>
                  )}
                  <span className={styles.tableCategoryName}>{category.name}</span>
                </div>
                {hasChildren && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.tableArrow}
                    viewBox="0 0 32 32"
                  >
                    <path d="M7.55 3.36c-.8-.8-.7-2.1.1-2.8.8-.7 2-.7 2.7 0l14 14c.8.8.8 2 0 2.8l-14 14c-.8.8-2 .8-2.8.1-.8-.8-.8-2-.1-2.8l.1-.1 12.6-12.5-12.6-12.7z"></path>
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Column 2: Children of selected category from column 1 - always visible but may be empty */}
        <div className={styles.tableColumn}>
          {secondColumnCategories.length > 0 ? (
            secondColumnCategories.map((category) => {
              const hasChildren = category.children && category.children.length > 0;
              const isSelected = navigationPath[1]?.id === category.id;
              
              return (
                <button
                  key={category.id}
                  className={`${styles.tableCategoryItem} ${
                    isSelected ? styles.tableSelected : ''
                  }`}
                  onClick={() => handleCategoryClick(category, 1, false)}
                  aria-label={`Category level 1: ${category.name}`}
                >
                  <div className={styles.tableCategoryContent}>
                    <span className={styles.tableCategoryName}>{category.name}</span>
                  </div>
                  {hasChildren && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.tableArrow}
                      viewBox="0 0 32 32"
                    >
                      <path d="M7.55 3.36c-.8-.8-.7-2.1.1-2.8.8-.7 2-.7 2.7 0l14 14c.8.8.8 2 0 2.8l-14 14c-.8.8-2 .8-2.8.1-.8-.8-.8-2-.1-2.8l.1-.1 12.6-12.5-12.6-12.7z"></path>
                    </svg>
                  )}
                </button>
              );
            })
          ) : null}
        </div>

        {/* Column 3: Children of selected category from column 2 - always visible but may be empty */}
        <div className={styles.tableColumn}>
          {thirdColumnCategories.length > 0 ? (
            thirdColumnCategories.map((category) => {
              const hasChildren = category.children && category.children.length > 0;
              const isSelected = selectedCategory?.id === category.id;
              
              return (
                <button
                  key={category.id}
                  className={`${styles.tableCategoryItem} ${
                    isSelected ? styles.tableSelected : ''
                  }`}
                  onClick={() => handleCategoryClick(category, 2, false)}
                  aria-label={`Category level 2: ${category.name}`}
                >
                  <div className={styles.tableCategoryContent}>
                    <span className={styles.tableCategoryName}>{category.name}</span>
                  </div>
                  {hasChildren && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.tableArrow}
                      viewBox="0 0 32 32"
                    >
                      <path d="M7.55 3.36c-.8-.8-.7-2.1.1-2.8.8-.7 2-.7 2.7 0l14 14c.8.8.8 2 0 2.8l-14 14c-.8.8-2 .8-2.8.1-.8-.8-.8-2-.1-2.8l.1-.1 12.6-12.5-12.6-12.7z"></path>
                    </svg>
                  )}
                </button>
              );
            })
          ) : null}
        </div>
      </div>
    </div>
  );
}

