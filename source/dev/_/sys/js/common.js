const html = document.querySelector('html');
const body = document.querySelector('body');
const inner = document.querySelector('.inner');
const mailPattern = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

document.addEventListener('DOMContentLoaded', function () {

  // ANIMATION
  let anBlocks = document.querySelectorAll('.an');

  function animatedBlocks() {
    let Y = window.scrollY;
    let visibleHeight = window.innerHeight - 100;
    anBlocks.forEach((block) => {
      if (!block.classList.contains('--loaded')) {
        let timeout = block.getAttribute('data-timeout');
        if (timeout) {
          block.style.transitionDelay = timeout;
        }
        if (block.getBoundingClientRect().top < visibleHeight) {
          block.classList.add('--loaded');
        }
      }
    });
  }

  setTimeout(() => {
    animatedBlocks();
    document.addEventListener('scroll', () => {
      animatedBlocks();
    });
  }, 500);

  // HEADER
  let header = document.querySelector('.header');
  let menuNav = document.querySelector('.header__inner');
  let menuHam = document.querySelector('.ham');

  if (menuHam) {
    for (let i = 0; i < 3; i++) {
      let div = document.createElement('div');
      menuHam.append(div);
    }

    menuHam.addEventListener('click', () => {
      header.classList.toggle('--toggle');
      menuHam.classList.toggle('--toggle');
      menuNav.classList.toggle('--show');

      html.classList.toggle('overflow-disable');
      body.classList.toggle('overflow-disable');
      inner.classList.toggle('overflow-disable');
    });
  }

  // REVIEWS SLIDER
  let reviewsSlider = document.querySelector('.reviews__slider');

  if (reviewsSlider) {
    let reviewsSliderSwiper = new Swiper(reviewsSlider, {
      slidesPerView: 3,
      spaceBetween: 30,
      speed: 900,
      // effect: 'fade',
      // fadeEffect: {
      //   crossFade: true
      // },
      navigation: {
        prevEl: '.reviews__arrow.swiper-button-prev',
        nextEl: '.reviews__arrow.swiper-button-next',
      },
      pagination: {
        el: '.reviews__pagination.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
    });
  }
})