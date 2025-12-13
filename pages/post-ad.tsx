import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { Category } from '@/types';
import { fetchCategories } from '@/lib/api/categories';
import CategorySelector from '@/components/CategorySelector/CategorySelector';
import Logo from '@/components/Logo/Logo';
import styles from '@/styles/PostAd.module.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';

interface PostAdProps {
  initialCategories: Category[];
}

export default function PostAd({ initialCategories }: PostAdProps) {
  const { t } = useTranslation('common');
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load categories if not provided
    if (categories.length === 0) {
      loadCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Navigate to attributes page when a category is selected
    if (selectedCategory) {
      router.push(`/post-ad/attributes?categoryId=${selectedCategory.id}`);
    }
  }, [selectedCategory, router]);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
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
              <FaArrowLeft onClick={() => router.push("/")} className={styles.backButton}/>
              <Logo />
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.pageTitle}>
            <span className={styles.pageTitleText}>Post your ad</span>
          </div>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('postAd.chooseCategory')}</h2>
            <CategorySelector
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </section>
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

