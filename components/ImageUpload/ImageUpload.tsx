import { useState } from 'react';
import { FaCamera, FaTimes, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
}: ImageUploadProps) {
  const { t } = useTranslation('common');
  const [videoUrl, setVideoUrl] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const remainingSlots = maxImages - images.length;

    Array.from(files)
      .slice(0, remainingSlots)
      .forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            newImages.push(result);
            if (newImages.length === Math.min(files.length, remainingSlots)) {
              onImagesChange([...images, ...newImages]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onImagesChange(newImages);
  };

  return (
    <div className={styles.imageUpload}>
      <div className={styles.uploadSection}>
        <label className={styles.uploadButton}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={images.length >= maxImages}
            className={styles.fileInput}
          />
          <FaCamera className={styles.uploadIcon} />
          <span className={styles.uploadText}>
            {images.length >= maxImages
              ? t('postAd.uploadImages') + ` (${maxImages}/${maxImages})`
              : t('postAd.uploadImages')}
          </span>
        </label>
        {images.length < maxImages && (
          <p className={styles.recommendation}>
            {t('postAd.coverImageRecommendation')}
          </p>
        )}
      </div>

      {images.length > 0 && (
        <div className={styles.imageGrid}>
          {images.map((image, index) => (
            <div key={index} className={styles.imageItem}>
              <div className={styles.imageWrapper}>
                <img src={image} alt={`Upload ${index + 1}`} />
                {index === 0 && (
                  <span className={styles.coverBadge}>Cover</span>
                )}
                <button
                  className={styles.removeButton}
                  onClick={() => removeImage(index)}
                  aria-label="Remove image"
                >
                  <FaTimes />
                </button>
              </div>
              <div className={styles.imageActions}>
                {index > 0 && (
                  <button
                    className={styles.moveButton}
                    onClick={() => moveImage(index, index - 1)}
                    aria-label="Move up"
                  >
                    <FaChevronUp />
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    className={styles.moveButton}
                    onClick={() => moveImage(index, index + 1)}
                    aria-label="Move down"
                  >
                    <FaChevronDown />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.videoSection}>
        <label className={styles.videoLabel}>{t('postAd.addVideo')}</label>
        <input
          type="url"
          placeholder={t('postAd.enterYoutubeUrl')}
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className={styles.videoInput}
        />
      </div>
    </div>
  );
}

