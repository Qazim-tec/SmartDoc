import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '../styles/Testimonials.module.css';

const Testimonials = () => {
  // Slick carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    adaptiveHeight: true,
  };

  return (
    <section className={styles.testimonials} id="testimonials">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          What Our <span className={styles.titleAccent}>Users Say</span>
        </h2>
        <div className={styles.divider}></div>

        {/* Desktop Grid Layout */}
        <div className={styles.testimonialsGrid}>
          {/* Testimonial 1 - Patient */}
          <div className={styles.testimonialCard}>
            <div className={styles.quoteIcon}>“</div>
            <p className={styles.testimonialText}>
              Smart Doctor AI accurately identified my symptoms when three doctors couldn't. The treatment plan worked perfectly!
            </p>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>👩‍⚕️</div>
              <div>
                <h4 className={styles.userName}>Sarah Johnson</h4>
                <p className={styles.userTitle}>Chronic Illness Patient</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 - Medical Student */}
          <div className={styles.testimonialCard}>
            <div className={styles.quoteIcon}>“</div>
            <p className={styles.testimonialText}>
              The case simulations and MCQs helped me score in the top 5% of my medical board exams. Invaluable resource!
            </p>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>🧑‍🎓</div>
              <div>
                <h4 className={styles.userName}>David Chen</h4>
                <p className={styles.userTitle}>Medical Student</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 - Fitness User */}
          <div className={styles.testimonialCard}>
            <div className={styles.quoteIcon}>“</div>
            <p className={styles.testimonialText}>
              Lost 22lbs in 3 months with the personalized diet and exercise plans tailored to my health conditions.
            </p>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>💪</div>
              <div>
                <h4 className={styles.userName}>Marcus Wilson</h4>
                <p className={styles.userTitle}>Fitness Enthusiast</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Carousel Layout */}
        <div className={styles.testimonialsCarousel}>
          <Slider {...settings}>
            {/* Testimonial 1 - Patient */}
            <div className={styles.testimonialCard}>
              <div className={styles.quoteIcon}>“</div>
              <p className={styles.testimonialText}>
                Smart Doctor AI accurately identified my symptoms when three doctors couldn't. The treatment plan worked perfectly!
              </p>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>👩‍⚕️</div>
                <div>
                  <h4 className={styles.userName}>Sarah Johnson</h4>
                  <p className={styles.userTitle}>Chronic Illness Patient</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 - Medical Student */}
            <div className={styles.testimonialCard}>
              <div className={styles.quoteIcon}>“</div>
              <p className={styles.testimonialText}>
                The case simulations and MCQs helped me score in the top 5% of my medical board exams. Invaluable resource!
              </p>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>🧑‍🎓</div>
                <div>
                  <h4 className={styles.userName}>David Chen</h4>
                  <p className={styles.userTitle}>Medical Student</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 - Fitness User */}
            <div className={styles.testimonialCard}>
              <div className={styles.quoteIcon}>“</div>
              <p className={styles.testimonialText}>
                Lost 22lbs in 3 months with the personalized diet and exercise plans tailored to my health conditions.
              </p>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>💪</div>
                <div>
                  <h4 className={styles.userName}>Marcus Wilson</h4>
                  <p className={styles.userTitle}>Fitness Enthusiast</p>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;