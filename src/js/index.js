import '../css/style.scss'
import 'swiper/css/bundle';
import Swiper from 'swiper/bundle';

window.addEventListener("load", () => {
  new Swiper('.featuredGrants__slider', {
    slidesPerView: 3,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    navigation: {
      prevEl: '.featuredGrants__button-prev',
      nextEl: '.featuredGrants__button-next',
    },
  });
})
