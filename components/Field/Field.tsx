import React from 'react';
import { CategoryField, CategoryFieldChoice, Category } from '@/types';
import styles from './Field.module.css';
import { FaSearch, FaCamera, FaPlus } from 'react-icons/fa';

export interface CustomField {
  type: 'category' | 'images' | 'price' | 'optionalPrice' | 'checkboxes' | 'delivery' | 'name' | 'phone' | 'contactMethod';
  attribute: string;
  name: string;
  isMandatory?: boolean;
  // For category
  category?: Category;
  categoryPath?: Category[];
  onCategoryChange?: () => void;
  // For price
  currency?: string;
  placeholder?: string;
  // For checkboxes
  checkboxOptions?: { value: string; label: string }[];
  // For delivery
  deliveryText?: string | React.ReactNode;
  // For phone
  countryCode?: string;
  // For contact method
  contactOptions?: string[];
}

interface FieldProps {
  field?: CategoryField;
  customField?: CustomField;
  value: string | number | boolean | string[] | Record<string, boolean> | null;
  onChange: (value: string | number | boolean | string[] | Record<string, boolean>) => void;
  error?: string;
}

export default function Field({ field, value, onChange, error, customField }: FieldProps) {
  const fieldValue = value ?? '';

  // Handle custom fields (image upload, price, phone, toggle, etc.)
  if (customField) {
    // Category Display
    if (customField.type === 'category' && customField.category && customField.categoryPath) {
      const categoryName = customField.categoryPath[customField.categoryPath.length - 2]?.name || customField.categoryPath[0]?.name;
      const subName = customField.category.name;
      return (
        <div className={styles.fieldRow}>
          <label className={styles.label}>
            {customField.name}
            {customField.isMandatory && <span className={styles.required}>*</span>}
          </label>
          <div className={styles.categoryDisplay}>
            <div className={styles.categoryIcon}></div>
            <div className={styles.categoryInfo}>
              <div className={styles.categoryName}>{categoryName}</div>
              <div className={styles.categorySubName}>{subName}</div>
            </div>
            {customField.onCategoryChange && (
              <button
                type="button"
                className={styles.changeButton}
                onClick={customField.onCategoryChange}
              >
                Change
              </button>
            )}
          </div>
          {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
      );
    }

    // Image Upload
    if (customField.type === 'images') {
      const images = (fieldValue as string[]) || [];
      return (
        <div className={styles.fieldRow}>
          <label className={styles.label}>
            {customField.name}
            {customField.isMandatory && <span className={styles.required}>*</span>}
          </label>
          <div className={styles.imageGrid}>
            <label className={styles.imageUploadButton}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
                    onChange([...images, ...newImages].slice(0, 15));
                  }
                }}
                style={{ display: 'none' }}
              />
              <FaPlus className={styles.plusIcon} />
            </label>
            {Array.from({ length: 14 }).map((_, index) => (
              <div key={index} className={styles.imageSlot}>
                {images[index] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={images[index]}
                    alt={`Upload ${index + 1}`}
                    className={styles.uploadedImage}
                  />
                ) : (
                  <FaCamera className={styles.cameraIcon} />
                )}
              </div>
            ))}
          </div>
          {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
      );
    }

    // Price with Currency
    if (customField.type === 'price' || customField.type === 'optionalPrice') {
      return (
        <div className={styles.fieldRow}>
          <label className={styles.label}>
            {customField.name}
            {customField.isMandatory && <span className={styles.required}>*</span>}
          </label>
          <div className={styles.priceInput}>
            <div className={styles.currency}>{customField.currency || (customField.type === 'optionalPrice' ? 'LBP' : 'USD')}</div>
            <input
              type="number"
              className={styles.priceField}
              placeholder={customField.placeholder || (customField.type === 'optionalPrice' ? 'Enter Optional price' : 'Enter Price')}
              value={fieldValue as number || ''}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            />
          </div>
          {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
      );
    }

    // Phone with Country Code
    if (customField.type === 'phone') {
      return (
        <div className={styles.fieldRow}>
          <label className={styles.label}>
            {customField.name}
            {customField.isMandatory && <span className={styles.required}>*</span>}
          </label>
          <div className={styles.phoneInput}>
            <div className={styles.countryCode}>{customField.countryCode || '+961'}</div>
            <input
              type="tel"
              className={styles.phoneField}
              placeholder={customField.placeholder || '78858135'}
              value={fieldValue as string || ''}
              onChange={(e) => onChange(e.target.value)}
              required={customField.isMandatory}
            />
          </div>
          {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
      );
    }

    // Toggle Switch (Delivery)
    if (customField.type === 'delivery') {
      return (
        <div className={styles.fieldRow}>
          <label className={styles.label}>
            {customField.name}
            {customField.isMandatory && <span className={styles.required}>*</span>}
          </label>
          <div className={styles.deliverySection}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={fieldValue as boolean || false}
                onChange={(e) => onChange(e.target.checked)}
              />
              <span className={styles.toggleSlider}></span>
            </label>
            {customField.deliveryText && (
              <div className={styles.deliveryText}>{customField.deliveryText}</div>
            )}
          </div>
          {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
      );
    }

    // Checkbox Row (multiple checkboxes in a row)
    if (customField.type === 'checkboxes' && customField.checkboxOptions) {
      return (
        <div className={styles.fieldRow}>
          <label className={styles.label}>
            {customField.name}
            {customField.isMandatory && <span className={styles.required}>*</span>}
          </label>
          <div className={styles.checkboxRow}>
            {customField.checkboxOptions.map((option) => (
              <label key={option.value} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={(fieldValue as unknown as Record<string, boolean>)?.[option.value] || false}
                  onChange={(e) => {
                    const current = (fieldValue as unknown as Record<string, boolean>) || {};
                    onChange({
                      ...current,
                      [option.value]: e.target.checked,
                    });
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
      );
    }

    // Pill Buttons (like Contact Method)
    if (customField.type === 'contactMethod' && customField.contactOptions) {
      return (
        <div className={styles.fieldRow}>
          <label className={styles.label}>
            {customField.name}
            {customField.isMandatory && <span className={styles.required}>*</span>}
          </label>
          <div className={styles.pillGroup}>
            {customField.contactOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`${styles.pill} ${
                  String(fieldValue) === option ? styles.pillActive : ''
                }`}
                onClick={() => onChange(option)}
              >
                {option}
              </button>
            ))}
          </div>
          {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
      );
    }

    // Simple text input (like Name)
    if (customField.type === 'name') {
      return (
        <div className={styles.fieldRow}>
          <label className={styles.label}>
            {customField.name}
            {customField.isMandatory && <span className={styles.required}>*</span>}
          </label>
          <input
            type="text"
            className={styles.input}
            value={fieldValue as string || ''}
            onChange={(e) => onChange(e.target.value)}
            required={customField.isMandatory}
          />
          {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
      );
    }
  }

  // If no field is provided, return null
  if (!field) {
    return null;
  }

  // Handle enum fields (select, multiple choice, radio buttons)
  if (field.valueType === 'enum' && field.choices) {
    const isMultiple = field.filterType === 'multiple_choice';
    
    // Check if it should be rendered as pill buttons (like Condition)
    const shouldRenderAsPills = field.choices.length <= 5 && !isMultiple;

    if (shouldRenderAsPills) {
      return (
        <div className={styles.fieldRow}>
          <label className={styles.label}>
            {field.name}
            {field.isMandatory && <span className={styles.required}>*</span>}
          </label>
          <div className={styles.pillGroup}>
            {field.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                className={`${styles.pill} ${
                  String(fieldValue) === String(choice.value) ? styles.pillActive : ''
                }`}
                onClick={() => onChange(String(choice.value))}
              >
                {choice.label}
              </button>
            ))}
          </div>
          {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
      );
    }

    if (isMultiple) {
      return (
        <div className={styles.fieldRow}>
          <label className={styles.label}>
            {field.name}
            {field.isMandatory && <span className={styles.required}>*</span>}
          </label>
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
                    onChange(newValues);
                  }}
                />
                <span>{choice.label}</span>
              </label>
            ))}
          </div>
          {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
      );
    }

    // Regular select dropdown with search icon
    return (
      <div className={styles.fieldRow}>
        <label className={styles.label}>
          {field.name}
          {field.isMandatory && <span className={styles.required}>*</span>}
        </label>
        <div className={styles.selectWrapper}>
          <FaSearch className={styles.searchIcon} />
          <select
            className={`${styles.input} ${styles.select} ${error ? styles.error : ''}`}
            value={fieldValue as string}
            onChange={(e) => onChange(e.target.value)}
            required={field.isMandatory}
          >
            <option value="">Select {field.name.toLowerCase()}</option>
            {field.choices
              .filter((choice) => !choice.parentID)
              .map((choice) => (
                <option key={choice.id} value={String(choice.value)}>
                  {choice.label}
                </option>
              ))}
          </select>
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }

  // Handle number/float fields
  if (field.valueType === 'float' || field.valueType === 'integer') {
    return (
      <div className={styles.fieldRow}>
        <label className={styles.label}>
          {field.name}
          {field.isMandatory && <span className={styles.required}>*</span>}
        </label>
        <input
          type="number"
          className={`${styles.input} ${error ? styles.error : ''}`}
          placeholder={`Enter ${field.name.toLowerCase()}`}
          value={fieldValue as number}
          onChange={(e) =>
            onChange(
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
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }

  // Handle string/text fields
  if (field.valueType === 'string') {
    const isTextarea = field.maxLength && field.maxLength > 100;
    const currentLength = (fieldValue as string)?.length || 0;
    const maxLength = field.maxLength || 0;
    
    return (
      <div className={styles.fieldRow}>
        <label className={styles.label}>
          {field.name}
          {field.isMandatory && <span className={styles.required}>*</span>}
        </label>
        <div className={styles.inputWrapper}>
          {isTextarea ? (
            <>
              <textarea
                className={`${styles.input} ${styles.textarea} ${error ? styles.error : ''}`}
                placeholder={
                  field.attribute === 'description'
                    ? "Describe the item you're selling"
                    : `Enter ${field.name.toLowerCase()}`
                }
                value={fieldValue as string}
                onChange={(e) => onChange(e.target.value)}
                required={field.isMandatory}
                rows={4}
                minLength={field.minLength ?? undefined}
                maxLength={field.maxLength ?? undefined}
              />
              {field.maxLength && (
                <div className={styles.charCounter}>
                  {currentLength}/{maxLength}
                </div>
              )}
              {field.attribute === 'description' && (
                <div className={styles.helperText}>
                  Include condition, features and reason for selling
                </div>
              )}
            </>
          ) : (
            <>
              <input
                type="text"
                className={`${styles.input} ${error ? styles.error : ''}`}
                placeholder={
                  field.attribute === 'title'
                    ? 'Enter title'
                    : `Enter ${field.name.toLowerCase()}`
                }
                value={fieldValue as string}
                onChange={(e) => onChange(e.target.value)}
                required={field.isMandatory}
                minLength={field.minLength ?? undefined}
                maxLength={field.maxLength ?? undefined}
              />
              {field.maxLength && (
                <div className={styles.charCounter}>
                  {currentLength}/{maxLength}
                </div>
              )}
              {field.attribute === 'title' && (
                <div className={styles.helperText}>
                  Mention the key features of your item (e.g. brand, model, age, type)
                </div>
              )}
            </>
          )}
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }

  // Handle boolean fields (checkboxes)
  if (field.valueType === 'boolean') {
    return (
      <div className={styles.fieldRow}>
        <label className={styles.label}>
          {field.name}
          {field.isMandatory && <span className={styles.required}>*</span>}
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={fieldValue as boolean}
            onChange={(e) => onChange(e.target.checked)}
            required={field.isMandatory}
          />
          <span>{field.name}</span>
        </label>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }

  return null;
}

