import '../css/style.scss'
import 'swiper/css/bundle';
import Swiper from 'swiper/bundle';

window.addEventListener("load", () => {
  new Swiper('.featuredGrants__slider', {
    slidesPerView: 3,
    spaceBetween: 24,
    speed: 4000,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.featuredGrants__button-next',
      prevEl: '.featuredGrants__button-prev',

    },
  });
})
