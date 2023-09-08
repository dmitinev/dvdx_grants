import '../css/style.scss'
import 'swiper/css/bundle';
import Swiper from 'swiper/bundle';

window.addEventListener("load", () => {
  new Swiper('.featuredGrants__slider', {
    slidesPerView: 3,
    spaceBetween: 24,
    speed: 2000,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.featuredGrants__button-next',
      prevEl: '.featuredGrants__button-prev',
    },
  });

  const faqItems = document.querySelectorAll("[data-index]");
  const faqAnswers = document.querySelectorAll("[data-elem]");
  const headerNavigation = document.querySelector(".header__navigation-items")
  const burgerMenu = document.querySelector(".header__burger")

  if (faqItems.length > 0) {
    faqItems.forEach(el => el.addEventListener("click", faqCkickHandler))
  }
  
  function faqCkickHandler(evt) {
    const sectionIndex = +evt.target.dataset.index
    faqAnswers.forEach(el => {
      if (+el.dataset.elem === sectionIndex) {
        el.classList.toggle("faq__answerText--visible")
        evt.target.classList.toggle("faq__questionIcon--clicked")
      } else {
        el.classList.remove("faq__answerText--visible")
        faqItems.forEach(el => {
          if (+el.dataset.index !== sectionIndex) {
            el.classList.remove("faq__questionIcon--clicked")
          }
        })
      }
    })
  }

  function burgerHandler(e) {
    burgerMenu.classList.toggle("header__burger--active")
    headerNavigation.classList.toggle("header__navigation-items--active")
 
  }

  burgerMenu.addEventListener("click", burgerHandler);


})
