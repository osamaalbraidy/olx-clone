import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { Ad, Category } from '@/types';
import { fetchAds } from '@/lib/api/ads';
import { fetchCategories } from '@/lib/api/categories';
import Header from '@/components/Header/Header';
import Navbar from '@/components/Navbar/Navbar';
import Carousel from '@/components/Carousel/Carousel';
import AllCategoriesSection from '@/components/AllCategoriesSection/AllCategoriesSection';
import CategoryAdsSection from '@/components/CategoryAdsSection/CategoryAdsSection';
import AppPromotion from '@/components/AppPromotion/AppPromotion';
import Footer from '@/components/Footer/Footer';
import styles from '@/styles/Home.module.css';

interface HomeProps {
  initialAds: Ad[];
  categories: Category[];
}

export default function Home({ initialAds, categories }: HomeProps) {
  // Group ads by category in the order they appear on OLX
  const categoryOrder = [
    'Cars for Sale',
    'Apartments & Villas For Rent',
    'Mobile Phones',
    'Apartments & Villas For Sale',
    'Motorcycles & ATVs',
    'AC, Cooling & Heating',
    'Laptops, Tablets, Computers',
  ];

  const adsByCategory: Record<string, Ad[]> = {};
  initialAds.forEach((ad) => {
    if (!adsByCategory[ad.category]) {
      adsByCategory[ad.category] = [];
    }
    adsByCategory[ad.category].push(ad);
  });

  // Sort categories by predefined order
  const sortedCategories = categoryOrder.filter((cat) => adsByCategory[cat]?.length > 0);

  return (
    <>
      <Head>
        <title>OLX Lebanon - Buy and Sell Anything</title>
        <meta name="description" content="Buy and sell anything in Lebanon - Cars, Properties, Mobile Phones, Electronics and more" />
      </Head>
      <div className={styles.container}>
        <Header />
        <Navbar categories={categories} />
        <Carousel />
        <AllCategoriesSection />

        <main className={styles.main}>
          <div className={styles.content}>
            {sortedCategories.map((category) => {
              const categoryAds = adsByCategory[category].slice(0, 4); // Show 4 ads per category
              return (
                <CategoryAdsSection key={category} category={category} ads={categoryAds} />
              );
            })}
          </div>
        </main>

        <AppPromotion />
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let initialAds: Ad[] = [];
  let categories: Category[] = [];

  try {
    // Use static mock data (no delay for static page)
    initialAds = await fetchAds({});
  } catch (error) {
    console.error('Failed to fetch ads on server:', error);
  }

  try {
    categories = await fetchCategories();
  } catch (error) {
    console.error('Failed to fetch categories on server:', error);
  }

  return {
    props: {
      initialAds,
      categories,
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};
