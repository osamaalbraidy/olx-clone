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
import { FaArrowLeft, FaCamera, FaPlus } from 'react-icons/fa';

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
        const categoryKey = categoryId.toString();
        const categoryFields = data[categoryKey]?.flatFields || [];
        
        // Sort fields by displayPriority
        const sortedFields = categoryFields.sort((a, b) => 
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
  }, [categoryId, initialCategories]);

  const handleFieldChange = (attribute: string, value: string | number | boolean | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [attribute]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages].slice(0, 15));
    }
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
                    <div className={attributesStyles.section}>
                      <label className={attributesStyles.sectionLabel}>Category</label>
                      <div className={attributesStyles.categoryDisplay}>
                        <div className={attributesStyles.categoryIcon}>
                          {/* You can add category icon here */}
                        </div>
                        <div className={attributesStyles.categoryInfo}>
                          <div className={attributesStyles.categoryName}>
                            {categoryPath[categoryPath.length - 2]?.name || categoryPath[0]?.name}
                          </div>
                          <div className={attributesStyles.categorySubName}>
                            {selectedCategory.name}
                          </div>
                        </div>
                        <button
                          type="button"
                          className={attributesStyles.changeButton}
                          onClick={() => router.push('/post-ad')}
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upload Images Section */}
                  <div className={attributesStyles.section}>
                    <label className={attributesStyles.sectionLabel}>Upload Images</label>
                    <div className={attributesStyles.imageGrid}>
                      <label className={attributesStyles.imageUploadButton}>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                        <FaPlus className={attributesStyles.plusIcon} />
                      </label>
                      {Array.from({ length: 14 }).map((_, index) => (
                        <div key={index} className={attributesStyles.imageSlot}>
                          {images[index] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={images[index]}
                              alt={`Upload ${index + 1}`}
                              className={attributesStyles.uploadedImage}
                            />
                          ) : (
                            <FaCamera className={attributesStyles.cameraIcon} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className={attributesStyles.imageHint}>
                      For the cover picture we recommend using the landscape mode.
                    </div>
                  </div>

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
                  <div className={attributesStyles.section}>
                    <label className={attributesStyles.sectionLabel}>
                      Price<span className={attributesStyles.required}>*</span>
                    </label>
                    <div className={attributesStyles.priceInput}>
                      <div className={attributesStyles.currency}>USD</div>
                      <input
                        type="number"
                        className={attributesStyles.priceField}
                        placeholder="Enter Price"
                        value={formData.price as number || ''}
                        onChange={(e) => handleFieldChange('price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  {/* Optional Price */}
                  <div className={attributesStyles.section}>
                    <label className={attributesStyles.sectionLabel}>Optional price</label>
                    <div className={attributesStyles.priceInput}>
                      <div className={attributesStyles.currency}>LBP</div>
                      <input
                        type="number"
                        className={attributesStyles.priceField}
                        placeholder="Enter Optional price"
                        value={formData.optionalPrice as number || ''}
                        onChange={(e) => handleFieldChange('optionalPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  {/* Checkboxes: Negotiable, Exchange, Free */}
                  <div className={attributesStyles.section}>
                    <div className={attributesStyles.checkboxRow}>
                      <label className={attributesStyles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.negotiable as boolean || false}
                          onChange={(e) => handleFieldChange('negotiable', e.target.checked)}
                        />
                        <span>Negotiable</span>
                      </label>
                      <label className={attributesStyles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.exchange as boolean || false}
                          onChange={(e) => handleFieldChange('exchange', e.target.checked)}
                        />
                        <span>Exchange</span>
                      </label>
                      <label className={attributesStyles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.free as boolean || false}
                          onChange={(e) => handleFieldChange('free', e.target.checked)}
                        />
                        <span>Free</span>
                      </label>
                    </div>
                  </div>

                  {/* Delivery Toggle */}
                  <div className={attributesStyles.section}>
                    <label className={attributesStyles.sectionLabel}>DELIVERY</label>
                    <div className={attributesStyles.deliverySection}>
                      <label className={attributesStyles.toggle}>
                        <input
                          type="checkbox"
                          checked={formData.delivery as boolean || false}
                          onChange={(e) => handleFieldChange('delivery', e.target.checked)}
                        />
                        <span className={attributesStyles.toggleSlider}></span>
                      </label>
                      <div className={attributesStyles.deliveryText}>
                        Deliver your items using Pik&Drop - Dubizzle Lebanon&apos;s exclusive delivery partner or through{' '}
                        <a href="#" className={attributesStyles.link}>Self-Delivery</a>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className={attributesStyles.section}>
                    <label className={attributesStyles.sectionLabel}>
                      Name<span className={attributesStyles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      className={attributesStyles.input}
                      value={formData.name as string || ''}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className={attributesStyles.section}>
                    <label className={attributesStyles.sectionLabel}>
                      Mobile Phone Number<span className={attributesStyles.required}>*</span>
                    </label>
                    <div className={attributesStyles.phoneInput}>
                      <div className={attributesStyles.countryCode}>+961</div>
                      <input
                        type="tel"
                        className={attributesStyles.phoneField}
                        placeholder="78858135"
                        value={formData.phone as string || ''}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Method */}
                  <div className={attributesStyles.section}>
                    <label className={attributesStyles.sectionLabel}>Contact Method</label>
                    <div className={attributesStyles.pillGroup}>
                      {['Phone Number', 'OLX Chat', 'Both'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          className={`${attributesStyles.pill} ${
                            formData.contactMethod === method ? attributesStyles.pillActive : ''
                          }`}
                          onClick={() => handleFieldChange('contactMethod', method)}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
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

