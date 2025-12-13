import Link from 'next/link';
import Image from 'next/image';
import styles from './AllCategoriesSection.module.css';

export default function AllCategoriesSection() {
  return (
    <section className={styles.allCategoriesSection}>
      <div className={styles.allCategoriesContainer}>
        <h2 className={styles.allCategoriesTitle}>All categories</h2>
        <div className={styles.categoriesGrid}>
          <Link href="/" className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              <Image src="https://www.olx.com.lb/assets/vehicles.74fb4e1f768784288a0c358372fe3f8b.png" alt="Vehicles" width={80} height={80} />
            </div>
            <span className={styles.categoryName}>Vehicles</span>
          </Link>
          <Link href="/" className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              <Image src="https://www.olx.com.lb/assets/property.d5813812616778f179963565f8a533ca.png" alt="Properties" width={80} height={80} />
            </div>
            <span className={styles.categoryName}>Properties</span>
          </Link>
          <Link href="/" className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              <Image src="https://www.olx.com.lb/assets/mobile-phones-accessories.fa686c4b6a528d5dba5fcaf4216669fd.png" alt="Mobile Phones & Accessories" width={80} height={80} />
            </div>
            <span className={styles.categoryName}>Mobiles & Accessories</span>
          </Link>
          <Link href="/" className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              <Image src="https://www.olx.com.lb/assets/electronics-home-appliances.2a32a75df439dfc0d7e1d8b99826d41c.png" alt="Electronics & Home Appliances" width={80} height={80} />
            </div>
            <span className={styles.categoryName}>Electronics & Appliances</span>
          </Link>
          <Link href="/" className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              <Image src="https://www.olx.com.lb/assets/home-furniture-decor.fbc166b0b12e9d5f8f739be50194ad25.png" alt="Home Furniture & Decor" width={80} height={80} />
            </div>
            <span className={styles.categoryName}>Furniture & Decor</span>
          </Link>
          <Link href="/" className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              <Image src="https://www.olx.com.lb/assets/business-industrial.5ce4bde7ea9273b407f7ad46505a5cc5.png" alt="Business & Industrial" width={80} height={80} />
            </div>
            <span className={styles.categoryName}>Businesses & Industrial</span>
          </Link>
          <Link href="/" className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              <Image src="https://www.olx.com.lb/assets/pets.1a36a96ea593ace65f6b95fd57e7f21a.png" alt="Pets" width={80} height={80} />
            </div>
            <span className={styles.categoryName}>Pets</span>
          </Link>
          <Link href="/" className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              <Image src="https://www.olx.com.lb/assets/kids-babies.bcfd4ede63f7c505cb04023ba00cea33.png" alt="Kids & Babies" width={80} height={80} />
            </div>
            <span className={styles.categoryName}>Kids & Babies</span>
          </Link>
          <Link href="/" className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              <Image src="https://www.olx.com.lb/assets/sports-equipment.3dd8e635faf78e841a0e37cf1efd839c.png" alt="Sports & Equipment" width={80} height={80} />
            </div>
            <span className={styles.categoryName}>Sports & Equipment</span>
          </Link>
          <Link href="/" className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              <Image src="https://www.olx.com.lb/assets/hobbies-music-art-books.41b9abcabd86f9245dffed53b2662909.png" alt="Hobbies, Music, Art & Books" width={80} height={80} />
            </div>
            <span className={styles.categoryName}>Hobbies</span>
          </Link>
          <Link href="/" className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              <Image src="https://www.olx.com.lb/assets/jobs.d998b37fb9610644be7854e07eebcc57.png" alt="Jobs" width={80} height={80} />
            </div>
            <span className={styles.categoryName}>Jobs</span>
          </Link>
          <Link href="/" className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              <Image src="https://www.olx.com.lb/assets/fashion-beauty.e7680669aee4a534134043be9a312daa.png" alt="Fashion & Beauty" width={80} height={80} />
            </div>
            <span className={styles.categoryName}>Fashion & Beauty</span>
          </Link>
          <Link href="/" className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              <Image src="https://www.olx.com.lb/assets/services.500ad9620e19c68ff07a413734bdd6f9.png" alt="Services" width={80} height={80} />
            </div>
            <span className={styles.categoryName}>Services</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

