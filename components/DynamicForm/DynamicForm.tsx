import { useState, useEffect } from 'react';
import { Category, CategoryField, FormFieldValue, FormFieldError } from '@/types';
import { fetchCategoryFieldsByCategory } from '@/lib/api/categoryFields';
import { buildCategoryPath } from '@/lib/api/categories';
import { useTranslation } from 'next-i18next';
import styles from './DynamicForm.module.css';

interface DynamicFormProps {
  category: Category | null;
  categories: Category[];
  formData: FormFieldValue;
  onFormDataChange: (data: FormFieldValue) => void;
  errors: FormFieldError[];
}

export default function DynamicForm({
  category,
  categories,
  formData,
  onFormDataChange,
  errors,
}: DynamicFormProps) {
  const { t } = useTranslation('common');
  const [fields, setFields] = useState<CategoryField[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      loadCategoryFields(category);
    } else {
      setFields([]);
    }
  }, [category]);

  const loadCategoryFields = async (selectedCategory: Category) => {
    try {
      setLoading(true);
      setError(null);

      // The API expects the category slug (e.g., "mobile-phones", "cars-for-sale")
      // For nested categories, use just the selected category's slug, not the full path
      const categorySlugs = selectedCategory.slug;

      console.log(`📋 Loading fields for category: ${selectedCategory.name} (slug: ${categorySlugs}, id: ${selectedCategory.id})`);

      const { fields: categoryFields } = await fetchCategoryFieldsByCategory(
        {
          categorySlugs,
          includeChildCategories: true,
          splitByCategoryIDs: true,
          flatChoices: true,
          groupChoicesBySection: true,
          flat: true,
        },
        selectedCategory.id
      );

      // Filter out fields that should be excluded from post an ad form
      const visibleFields = categoryFields.filter(
        (field) => !field.roles?.includes('exclude_from_post_an_ad')
      );

      // Sort by displayPriority
      visibleFields.sort((a, b) => a.displayPriority - b.displayPriority);

      setFields(visibleFields);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load form fields');
      console.error('Error loading category fields:', err);
      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (
    fieldName: string,
    value: string | number | boolean | string[] | Record<string, boolean>
  ) => {
    onFormDataChange({
      ...formData,
      [fieldName]: value,
    });
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find((e) => e.field === fieldName)?.message;
  };

  const renderField = (field: CategoryField) => {
    const fieldError = getFieldError(field.attribute);
    const fieldValue = formData[field.attribute] ?? '';

    // Skip price fields as they're usually handled separately
    if (field.attribute === 'price' || field.attribute === 'secondary_price') {
      return null;
    }

    // Handle enum fields (select, multiple choice)
    if (field.valueType === 'enum' && field.choices) {
      const isMultiple = field.filterType === 'multiple_choice';
      
      return (
        <div key={field.id} className={styles.formGroup}>
          <label className={styles.label}>
            {field.name}
            {field.isMandatory && <span className={styles.required}>*</span>}
          </label>
          {isMultiple ? (
            <div className={styles.checkboxGroup}>
              {field.choices.map((choice) => (
                <label key={choice.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={(fieldValue as string[])?.includes(String(choice.value)) || false}
                    onChange={(e) => {
                      const currentValues = (fieldValue as string[]) || [];
                      const newValues = e.target.checked
                        ? [...currentValues, String(choice.value)]
                        : currentValues.filter((v) => v !== String(choice.value));
                      handleFieldChange(field.attribute, newValues);
                    }}
                  />
                  <span>{choice.label}</span>
                </label>
              ))}
            </div>
          ) : (
            <select
              className={`${styles.input} ${styles.select} ${
                fieldError ? styles.error : ''
              }`}
              value={fieldValue as string}
              onChange={(e) => handleFieldChange(field.attribute, e.target.value)}
              required={field.isMandatory}
            >
              <option value="">
                {t('postAd.select')} {field.name.toLowerCase()}
              </option>
              {field.choices
                .filter((choice) => !choice.parentID) // Only show top-level choices initially
                .map((choice) => (
                  <option key={choice.id} value={choice.value}>
                    {choice.label}
                  </option>
                ))}
            </select>
          )}
          {fieldError && <span className={styles.errorMessage}>{fieldError}</span>}
        </div>
      );
    }

    // Handle number/float fields
    if (field.valueType === 'float' || field.valueType === 'integer') {
      return (
        <div key={field.id} className={styles.formGroup}>
          <label className={styles.label}>
            {field.name}
            {field.isMandatory && <span className={styles.required}>*</span>}
          </label>
          <input
            type="number"
            className={`${styles.input} ${fieldError ? styles.error : ''}`}
            placeholder={t('postAd.enter')}
            value={fieldValue as number}
            onChange={(e) =>
              handleFieldChange(
                field.attribute,
                field.valueType === 'float'
                  ? parseFloat(e.target.value) || 0
                  : parseInt(e.target.value, 10) || 0
              )
            }
            required={field.isMandatory}
            min={field.minValue ?? undefined}
            max={field.maxValue ?? undefined}
            step={field.valueType === 'float' ? 0.01 : 1}
          />
          {fieldError && <span className={styles.errorMessage}>{fieldError}</span>}
        </div>
      );
    }

    // Handle string/text fields
    if (field.valueType === 'string') {
      const isTextarea = field.maxLength && field.maxLength > 100;
      
      return (
        <div key={field.id} className={styles.formGroup}>
          <label className={styles.label}>
            {field.name}
            {field.isMandatory && <span className={styles.required}>*</span>}
          </label>
          {isTextarea ? (
            <textarea
              className={`${styles.input} ${styles.textarea} ${
                fieldError ? styles.error : ''
              }`}
              placeholder={t('postAd.enter')}
              value={fieldValue as string}
              onChange={(e) => handleFieldChange(field.attribute, e.target.value)}
              required={field.isMandatory}
              rows={4}
              minLength={field.minLength ?? undefined}
              maxLength={field.maxLength ?? undefined}
            />
          ) : (
            <input
              type="text"
              className={`${styles.input} ${fieldError ? styles.error : ''}`}
              placeholder={t('postAd.enter')}
              value={fieldValue as string}
              onChange={(e) => handleFieldChange(field.attribute, e.target.value)}
              required={field.isMandatory}
              minLength={field.minLength ?? undefined}
              maxLength={field.maxLength ?? undefined}
            />
          )}
          {fieldError && <span className={styles.errorMessage}>{fieldError}</span>}
        </div>
      );
    }

    // Handle boolean fields
    if (field.valueType === 'boolean') {
      return (
        <div key={field.id} className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={fieldValue as boolean}
              onChange={(e) => handleFieldChange(field.attribute, e.target.checked)}
              required={field.isMandatory}
            />
            <span>
              {field.name}
              {field.isMandatory && <span className={styles.required}>*</span>}
            </span>
          </label>
          {fieldError && <span className={styles.errorMessage}>{fieldError}</span>}
        </div>
      );
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
      </div>
    );
  }

  if (!category) {
    return (
      <div className={styles.noCategory}>
        <p>{t('postAd.chooseCategory')}</p>
      </div>
    );
  }

  if (fields.length === 0) {
    return (
      <div className={styles.noFields}>
        <p>No form fields available for this category.</p>
      </div>
    );
  }

  // Group fields by groupIndex if available
  const fieldsByGroup = fields.reduce((acc, field) => {
    const groupIndex = field.groupIndex ?? 'other';
    if (!acc[groupIndex]) {
      acc[groupIndex] = [];
    }
    acc[groupIndex].push(field);
    return acc;
  }, {} as Record<number | string, CategoryField[]>);

  return (
    <div className={styles.dynamicForm}>
      {Object.entries(fieldsByGroup)
        .sort(([a], [b]) => {
          if (a === 'other') return 1;
          if (b === 'other') return -1;
          return Number(a) - Number(b);
        })
        .map(([groupIndex, groupFields]) => (
          <div key={groupIndex} className={styles.fieldGroup}>
            {groupFields.map((field) => renderField(field))}
          </div>
        ))}
    </div>
  );
}

