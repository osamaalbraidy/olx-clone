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

        // Extract fields from the response
        // The API can return either common_category_fields or category-specific fields
        let categoryFields: CategoryField[] = [];
        
        if (data.common_category_fields?.flatFields) {
          // Response has common_category_fields structure
          categoryFields = data.common_category_fields.flatFields;
        } else {
          // Try to get category-specific fields
          const categoryKey = categoryId.toString();
          categoryFields = data[categoryKey]?.flatFields || [];
        }
        
        // Filter out fields that should be excluded from post an ad form
        const filteredFields = categoryFields.filter((field) => 
          !field.roles?.includes('exclude_from_post_an_ad')
        );
        
        // Sort fields by displayPriority
        const sortedFields = filteredFields.sort((a, b) => 
          (a.displayPriority || 0) - (b.displayPriority || 0)
        );
        setFields(sortedFields);
      } catch (error) {
        console.error('Failed to load fields:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFields();
  }, [categoryId, initialCategories, findCategoryById]);

  const handleFieldChange = (attribute: string, value: string | number | boolean | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [attribute]: value,
    }));
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
            <span className={styles.pageTitleText}>Sell your ad</span>
          </div>
          
          <div className={attributesStyles.container}>
            <div className={attributesStyles.formContainer}>
              {loading ? (
                <div className={attributesStyles.loading}>Loading fields...</div>
              ) : (
                <div className={attributesStyles.form}>
                  {/* Category Section */}
                  {selectedCategory && categoryPath.length > 0 && (
                    <Field
                      customField={{
                        type: 'category',
                        attribute: 'category',
                        name: 'Category',
                        category: selectedCategory,
                        categoryPath: categoryPath,
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
                      name: 'Upload Images',
                    }}
                    value={images}
                    onChange={(value) => setImages(value as string[])}
                  />

                  {/* Dynamic Fields from API */}
                  {fields.map((field) => {
                    // Skip certain fields that are handled separately
                    if (['title', 'description', 'price', 'location'].includes(field.attribute)) {
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

                  {/* Price Section */}
                  <Field
                    customField={{
                      type: 'price',
                      attribute: 'price',
                      name: 'Price',
                      isMandatory: true,
                      currency: 'USD',
                      placeholder: 'Enter Price',
                    }}
                    value={formData.price}
                    onChange={(value) => handleFieldChange('price', value)}
                  />

                  {/* Optional Price */}
                  <Field
                    customField={{
                      type: 'optionalPrice',
                      attribute: 'optionalPrice',
                      name: 'Optional price',
                      currency: 'LBP',
                      placeholder: 'Enter Optional price',
                    }}
                    value={formData.optionalPrice}
                    onChange={(value) => handleFieldChange('optionalPrice', value)}
                  />

                  {/* Checkboxes: Negotiable, Exchange, Free */}
                  <Field
                    customField={{
                      type: 'checkboxes',
                      attribute: 'priceOptions',
                      name: '',
                      checkboxOptions: [
                        { value: 'negotiable', label: 'Negotiable' },
                        { value: 'exchange', label: 'Exchange' },
                        { value: 'free', label: 'Free' },
                      ],
                    }}
                    value={[
                      ...(formData.negotiable ? ['negotiable'] : []),
                      ...(formData.exchange ? ['exchange'] : []),
                      ...(formData.free ? ['free'] : []),
                    ]}
                    onChange={(value) => {
                      // value is expected to be an array of selected option strings, e.g. ['negotiable', 'exchange']
                      const selected = Array.isArray(value) ? value : [];
                      handleFieldChange('negotiable', selected.includes('negotiable'));
                      handleFieldChange('exchange', selected.includes('exchange'));
                      handleFieldChange('free', selected.includes('free'));
                    }}
                  />

                  {/* Delivery Toggle */}
                  <Field
                    customField={{
                      type: 'delivery',
                      attribute: 'delivery',
                      name: 'DELIVERY',
                      deliveryText: (
                        <>
                          Deliver your items using Pik&Drop - Dubizzle Lebanon&apos;s exclusive delivery partner or through{' '}
                          <a href="#">Self-Delivery</a>
                        </>
                      ),
                    }}
                    value={formData.delivery}
                    onChange={(value) => handleFieldChange('delivery', value)}
                  />

                  {/* Contact Information */}
                  <Field
                    customField={{
                      type: 'name',
                      attribute: 'name',
                      name: 'Name',
                      isMandatory: true,
                    }}
                    value={formData.name}
                    onChange={(value) => handleFieldChange('name', value)}
                  />

                  <Field
                    customField={{
                      type: 'phone',
                      attribute: 'phone',
                      name: 'Mobile Phone Number',
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
                      name: 'Contact Method',
                      contactOptions: ['Phone Number', 'OLX Chat', 'Both'],
                    }}
                    value={formData.contactMethod}
                    onChange={(value) => handleFieldChange('contactMethod', value)}
                  />
                </div>
              )}
            </div>
            <div className={attributesStyles.rightContainer}>
              <div className={attributesStyles.sidebar}>
                <h3 className={attributesStyles.sidebarTitle}>Need help getting started?</h3>
                <p className={attributesStyles.sidebarText}>
                  Review these resource to learn how to create a great ad and increase your selling chances
                </p>
                <ul className={attributesStyles.sidebarList}>
                  <li>
                    <a href="#" className={attributesStyles.sidebarLink}>
                      Tips for improving your ads and your chances of selling
                    </a>
                  </li>
                  <li>
                    <a href="#" className={attributesStyles.sidebarLink}>
                      All you need to know about Posting Ads
                    </a>
                  </li>
                </ul>
                <p className={attributesStyles.sidebarFooter}>
                  You can always come back to change your ad
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

