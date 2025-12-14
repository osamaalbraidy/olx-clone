import { useState, useEffect, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Category, CategoryField, FormFieldValue } from '@/types';
import { fetchCategoryFieldsByExternalID } from '@/lib/api/categoryFields';
import { fetchCategories } from '@/lib/api/categories';
import Logo from '@/components/Logo/Logo';
import Field from '@/components/Field/Field';
import styles from '@/styles/PostAd.module.css';
import attributesStyles from './attributes.module.css';
import { FaArrowLeft } from 'react-icons/fa';

interface AttributesProps {
  initialCategories: Category[];
}

export default function Attributes({ initialCategories }: AttributesProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { categoryId } = router.query;
  const [fields, setFields] = useState<CategoryField[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryPath, setCategoryPath] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormFieldValue>({});
  const [images, setImages] = useState<string[]>([]);

  const findCategoryById = useCallback((cats: Category[], id: number): Category | null => {
    for (const cat of cats) {
      if (cat.id === Number(id)) {
        return cat;
      }
      if (cat.children) {
        const found = findCategoryById(cat.children, Number(id));
        if (found) return found;
      }
    }
    return null;
  }, []);

  const buildCategoryPath = (category: Category, allCategories: Category[]) => {
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

    return path;
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

  useEffect(() => {
    const loadFields = async () => {
      if (!categoryId) return;

      try {
        setLoading(true);
        const category = findCategoryById(initialCategories, Number(categoryId));
        if (!category) {
          console.error('Category not found');
          setLoading(false);
          return;
        }

        setSelectedCategory(category);
        const path = buildCategoryPath(category, initialCategories);
        setCategoryPath(path);

        // Fetch fields using externalID
        const data = await fetchCategoryFieldsByExternalID({
          categoryExternalIDs: String(categoryId),
          includeWithoutCategory: true,
          splitByCategoryIDs: true,
          flatChoices: true,
          groupChoicesBySection: true,
          flat: true,
        });

        // Merge fields from both category-specific and common_category_fields
        const categoryKey = categoryId.toString();
        const categorySpecificFields = data[categoryKey]?.flatFields || [];
        const commonFields = data.common_category_fields?.flatFields || [];
        
        // Create a map to track fields by attribute to avoid duplicates
        // Category-specific fields take precedence over common fields
        const fieldsMap = new Map<string, CategoryField>();
        
        // First, add common fields
        commonFields.forEach((field) => {
          if (!field.roles?.includes('exclude_from_post_an_ad')) {
            fieldsMap.set(field.attribute, field);
          }
        });
        
        // Then, override/add category-specific fields (they take precedence)
        categorySpecificFields.forEach((field) => {
          if (!field.roles?.includes('exclude_from_post_an_ad')) {
            fieldsMap.set(field.attribute, field);
          }
        });
        
        // Convert map to array and sort by displayPriority
        const allFields = Array.from(fieldsMap.values()).sort((a, b) => 
          (a.displayPriority || 0) - (b.displayPriority || 0)
        );
        
        setFields(allFields);
      } catch (error) {
        console.error('Failed to load fields:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFields();
  }, [categoryId, initialCategories, findCategoryById]);

  const handleFieldChange = (attribute: string, value: string | number | boolean | string[] | Record<string, boolean>) => {
    setFormData((prev) => ({
      ...prev,
      [attribute]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form data:', { ...formData, images });
    // You can add API call here to submit the ad
    // Example: await submitAd({ ...formData, images, categoryId });
  };


  return (
    <>
      <Head>
        <title>{t('postAd.title')} - OLX Lebanon</title>
        <meta name="description" content={t('postAd.title')} />
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <FaArrowLeft onClick={() => router.push("/post-ad")} className={styles.backButton}/>
              <Logo />
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.pageTitle}>
            <span className={styles.pageTitleText}>{t('postAd.sellYourAd')}</span>
          </div>
          
          <div className={attributesStyles.container}>
            <div className={attributesStyles.formContainer}>
              {loading ? (
                <div className={attributesStyles.loading}>{t('postAd.loadingFields')}</div>
              ) : (
                <form className={attributesStyles.form} onSubmit={handleSubmit}>
                  {/* Category Section */}
                  {selectedCategory && categoryPath.length > 0 && (
                    <Field
                      customField={{
                        type: 'category',
                        attribute: 'category',
                        name: t('postAd.category'),
                        category: selectedCategory,
                        categoryPath: categoryPath,
                        categoryIconUrl: getCategoryIcon(selectedCategory.name) || 
                          (categoryPath.length > 1 ? getCategoryIcon(categoryPath[categoryPath.length - 2].name) : null),
                        onCategoryChange: () => router.push('/post-ad'),
                      }}
                      value={null}
                      onChange={() => {}}
                    />
                  )}

                  {/* Upload Images Section */}
                  <Field
                    customField={{
                      type: 'images',
                      attribute: 'images',
                      name: t('postAd.uploadImages'),
                    }}
                    value={images}
                    onChange={(value) => setImages(value as string[])}
                  />

                  {/* Dynamic Fields from API */}
                  {fields.map((field) => {
                    // Skip certain fields that are handled separately or have custom implementations
                    if (['title', 'description', 'price', 'location', 'price_type', 'delivery'].includes(field.attribute)) {
                      return null;
                    }
                    return (
                      <Field
                        key={field.id}
                        field={field}
                        value={formData[field.attribute]}
                        onChange={(value) => handleFieldChange(field.attribute, value)}
                      />
                    );
                  })}

                  {/* Title Field */}
                  {fields.find((f) => f.attribute === 'title') && (
                    <Field
                      field={fields.find((f) => f.attribute === 'title')!}
                      value={formData.title}
                      onChange={(value) => handleFieldChange('title', value)}
                    />
                  )}

                  {/* Description Field */}
                  {fields.find((f) => f.attribute === 'description') && (
                    <Field
                      field={fields.find((f) => f.attribute === 'description')!}
                      value={formData.description}
                      onChange={(value) => handleFieldChange('description', value)}
                    />
                  )}

                  {/* Location Field */}
                  {fields.find((f) => f.attribute === 'location') && (
                    <Field
                      field={fields.find((f) => f.attribute === 'location')!}
                      value={formData.location}
                      onChange={(value) => handleFieldChange('location', value)}
                    />
                  )}

                  {/* Price Section - Use API field if available, otherwise use custom field */}
                  {fields.find((f) => f.attribute === 'price') ? (
                    <Field
                      field={fields.find((f) => f.attribute === 'price')!}
                      value={formData.price}
                      onChange={(value) => handleFieldChange('price', value)}
                    />
                  ) : (
                    <Field
                      customField={{
                        type: 'price',
                        attribute: 'price',
                        name: t('postAd.price'),
                        isMandatory: true,
                        currency: 'USD',
                        placeholder: t('postAd.enterPrice'),
                      }}
                      value={formData.price}
                      onChange={(value) => handleFieldChange('price', value)}
                    />
                  )}

                  {/* Optional Price */}
                  <Field
                    customField={{
                      type: 'optionalPrice',
                      attribute: 'optionalPrice',
                      name: t('postAd.optionalPrice'),
                      currency: 'LBP',
                      placeholder: t('postAd.enterOptionalPrice'),
                    }}
                    value={formData.optionalPrice}
                    onChange={(value) => handleFieldChange('optionalPrice', value)}
                  />

                  {/* Price Type - Use API field if available, otherwise use custom checkboxes */}
                  {fields.find((f) => f.attribute === 'price_type') ? (
                    <Field
                      field={fields.find((f) => f.attribute === 'price_type')!}
                      value={formData.price_type}
                      onChange={(value) => handleFieldChange('price_type', value)}
                    />
                  ) : (
                    <Field
                      customField={{
                        type: 'checkboxes',
                        attribute: 'priceOptions',
                        name: '',
                        checkboxOptions: [
                          { value: 'negotiable', label: t('postAd.negotiable') },
                          { value: 'exchange', label: t('postAd.exchange') },
                          { value: 'free', label: t('postAd.free') },
                        ],
                      }}
                      value={[
                        ...(formData.negotiable ? ['negotiable'] : []),
                        ...(formData.exchange ? ['exchange'] : []),
                        ...(formData.free ? ['free'] : []),
                      ]}
                      onChange={(value) => {
                        const selected = Array.isArray(value) ? value : [];
                        handleFieldChange('negotiable', selected.includes('negotiable'));
                        handleFieldChange('exchange', selected.includes('exchange'));
                        handleFieldChange('free', selected.includes('free'));
                      }}
                    />
                  )}

                  {/* Delivery - Use API field if available, otherwise use custom toggle */}
                  {fields.find((f) => f.attribute === 'delivery') ? (
                    <Field
                      field={fields.find((f) => f.attribute === 'delivery')!}
                      value={formData.delivery}
                      onChange={(value) => handleFieldChange('delivery', value)}
                    />
                  ) : (
                    <Field
                      customField={{
                        type: 'delivery',
                        attribute: 'delivery',
                        name: t('postAd.delivery'),
                        deliveryText: (
                          <>
                            {t('postAd.deliveryText')}{' '}
                            <a href="#">{t('postAd.selfDelivery')}</a>
                          </>
                        ),
                      }}
                      value={formData.delivery}
                      onChange={(value) => handleFieldChange('delivery', value)}
                    />
                  )}

                  {/* Contact Information */}
                  <Field
                    customField={{
                      type: 'name',
                      attribute: 'name',
                      name: t('postAd.name'),
                      isMandatory: true,
                    }}
                    value={formData.name}
                    onChange={(value) => handleFieldChange('name', value)}
                  />

                  <Field
                    customField={{
                      type: 'phone',
                      attribute: 'phone',
                      name: t('postAd.mobilePhoneNumber'),
                      isMandatory: true,
                      countryCode: '+961',
                      placeholder: '78858135',
                    }}
                    value={formData.phone}
                    onChange={(value) => handleFieldChange('phone', value)}
                  />

                  {/* Contact Method */}
                  <Field
                    customField={{
                      type: 'contactMethod',
                      attribute: 'contactMethod',
                      name: t('postAd.contactMethod'),
                      contactOptions: [
                        t('postAd.contactOptions.phoneNumber'),
                        t('postAd.contactOptions.olxChat'),
                        t('postAd.contactOptions.both'),
                      ],
                    }}
                    value={formData.contactMethod}
                    onChange={(value) => handleFieldChange('contactMethod', value)}
                  />

                  {/* Submit Button */}
                  <div className={attributesStyles.submitContainer}>
                    <button type="submit" className={styles.submitButton}>
                      {t('postAd.postNow')}
                    </button>
                  </div>
                </form>
              )}
            </div>
            <div className={attributesStyles.rightContainer}>
              <div className={attributesStyles.sidebar}>
                <h3 className={attributesStyles.sidebarTitle}>{t('postAd.needHelp.title')}</h3>
                <p className={attributesStyles.sidebarText}>
                  {t('postAd.needHelp.text')}
                </p>
                <ul className={attributesStyles.sidebarList}>
                  <li>
                    <a href="#" className={attributesStyles.sidebarLink}>
                      {t('postAd.needHelp.tip1')}
                    </a>
                  </li>
                  <li>
                    <a href="#" className={attributesStyles.sidebarLink}>
                      {t('postAd.needHelp.tip2')}
                    </a>
                  </li>
                </ul>
                <p className={attributesStyles.sidebarFooter}>
                  {t('postAd.needHelp.footer')}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let initialCategories: Category[] = [];

  try {
    initialCategories = await fetchCategories();
  } catch (error) {
    console.error('Failed to fetch categories on server:', error);
  }

  return {
    props: {
      initialCategories,
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

