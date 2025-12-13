import { CategoryField, CategoryFieldChoice } from '@/types';
import styles from './Field.module.css';
import { FaSearch } from 'react-icons/fa';

interface FieldProps {
  field: CategoryField;
  value: string | number | boolean | string[] | null;
  onChange: (value: string | number | boolean | string[]) => void;
  error?: string;
}

export default function Field({ field, value, onChange, error }: FieldProps) {
  const fieldValue = value ?? '';

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

