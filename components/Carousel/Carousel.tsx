import Link from 'next/link';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './Carousel.module.css';

export default function Carousel() {
  const router = useRouter();
  const isRTL = router.locale === 'ar';

  return (
    <div className={styles.carouselSection}>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        dir={isRTL ? 'rtl' : 'ltr'}
        className={styles.carousel}
      >
        <SwiperSlide>
          <Link
            href="https://www.dubizzle.com.lb/properties/apartments-villas-for-sale/?filter=payment_option_eq_4"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.carouselSlide}
          >
            <picture>
              <img
                src="https://olx-lb-production.s3.eu-west-1.amazonaws.com/image/14685947/1e2b97e8ada8454cb8a9faa4511d82d1"
                alt="Own an Apartment"
                className={styles.carouselImage}
              />
            </picture>
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link
            href="https://www.olx.com.lb/vehicles/?filter=highlights_eq_yes"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.carouselSlide}
          >
            <picture>
              <img
                src="https://olx-lb-production.s3.eu-west-1.amazonaws.com/image/15450624/d0754bcff7c84e8280b77241f355e24b"
                alt="Hot Deals Cars"
                className={styles.carouselImage}
              />
            </picture>
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link
            href="https://www.olx.com.lb/properties/apartments-villas-for-rent/?filter=discounted_eq_yes"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.carouselSlide}
          >
            <picture>
              <img
                src="https://olx-lb-production.s3.eu-west-1.amazonaws.com/image/15454696/654b73f868d64582bed3f1c10f21f3fe"
                alt="Hot Deals Property"
                className={styles.carouselImage}
              />
            </picture>
          </Link>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

