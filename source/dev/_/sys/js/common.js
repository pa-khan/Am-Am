const html = document.querySelector('html');
const body = document.querySelector('body');
const inner = document.querySelector('.inner');
const mailPattern = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

document.addEventListener('DOMContentLoaded', function () {

  // CHECK INIT
  let checks = document.querySelectorAll('.check');
  if (checks) {
    checks.forEach((check) => {
      new Check(check);
    });
  }

  // SELECT INIT
  var selects = document.querySelectorAll('.select');
  if (selects) {
    selects.forEach(select => {
      new Select(select);
    });

    document.addEventListener('click', (event) => {
      let openSelects = document.querySelectorAll('.select.--open');
      if (!event.target.closest('.select') && openSelects) {
        openSelects.forEach((select) => {
          select.classList.remove(Select.classOpen);
        });
      }
    })
  }

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
      navigation: {
        prevEl: '.reviews__arrow.swiper-button-prev',
        nextEl: '.reviews__arrow.swiper-button-next',
      },
      pagination: {
        el: '.reviews__pagination.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 60,
        },
        1221: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      }
    });

    const reviewsTexts = reviewsSlider.querySelectorAll('.reviews__text');
    reviewsTexts.forEach((text) => {
      if (text.innerText.length >= 175) {

        const value = document.createElement('div');
        value.className = 'reviews__text-value';
        value.setAttribute('data-text', text.innerText);
        value.innerText = text.innerText.substr(0, 175) + '...';

        const arrow = document.createElement('div');
        arrow.className = 'reviews__text-arrow';
        arrow.innerHTML = '<svg width="15" height="21" viewBox="0 0 15 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d = "M1 1L13.9342 10.5L1 20" stroke = "#656565" stroke - linecap="square" /></svg >';
        arrow.addEventListener('click', () => {
          text.classList.add('--show');
          value.innerText = value.dataset.text;
        });

        text.innerHTML = '';

        text.append(value, arrow);
      }
    });
  }

  // MOBILE SLIDRES
  function MobileSlider(windowSize, wrap, list, items, options = { slidesPerView: 1 }, removeSlide) {
    this.wrap = document.querySelector(wrap);

    if (this.wrap) {
      this.list = document.querySelector(list);
      this.items = document.querySelectorAll(items);
      this.slider = null;
      this.options = options;

      if (typeof removeSlide != 'undefined') {
        this.copeEl = this.items[removeSlide].cloneNode(true);
      }

      this.toggleSlider = () => {
        if (window.innerWidth <= windowSize) {
          if (!this.wrap.classList.contains('swiper')) {
            this.wrap.classList.add('swiper');
            this.list.classList.add('swiper-wrapper');
            this.items.forEach((item) => {
              item.classList.add('swiper-slide')
            });
            this.slider = new Swiper(this.wrap, this.options);
            this.slider.update();
            if (typeof removeSlide != 'undefined') {
              this.slider.removeSlide(removeSlide);
            }
            this.slider.update();

            setTimeout(() => {
              this.slider.updateAutoHeight(100);
            }, 1000)

          }
        } else {
          if (this.wrap.classList.contains('swiper')) {
            if (typeof removeSlide != 'undefined') {
              this.list.prepend(this.copeEl);
              this.slider.update();
            }

            this.wrap.classList.remove('swiper');
            this.list.classList.remove('swiper-wrapper');
            this.items.forEach((item) => {
              item.classList.remove('swiper-slide');
              item.removeAttribute('style');
            });

            this.slider.updateAutoHeight(100);

            this.wrap.style.height = 'auto'
            setTimeout(() => {
              this.wrap.removeAttribute('style');
            }, 500);

            if (this.slider != null) {
              this.slider = null;
            }
          }
        }
      }

      this.toggleSlider();

      window.addEventListener('resize', this.toggleSlider);
    }
  }

  new MobileSlider(1220, '.intro-news__inner', '.intro-news__list', '.intro-news__item', {
    slidesPerView: 3,
    spaceBetween: 30,
    speed: 900,
  });

  new MobileSlider(1220, '.intro-arts__inner', '.intro-arts__list', '.intro-arts__item', {
    slidesPerView: 3,
    spaceBetween: 30,
    speed: 900,
  });

  // MAP
  let $map = document.querySelector('#map');
  if ($map && ymaps) {
    ymaps.ready(mapInit);

    function mapInit() {
      let mapPosition, mapPlaceholder;

      mapPosition = $map.getAttribute('data-map');
      mapPosition = mapPosition.split(',');

      for (let i = 0; i < mapPosition.length; i++) {
        mapPosition[i] = Number(mapPosition[i]);
      }

      mapPlaceholder = $map.getAttribute('data-map');
      mapPlaceholder = mapPlaceholder.split(',');

      let ymap = new ymaps.Map($map, {
        center: [mapPosition[0], mapPosition[1]],
        zoom: 18,
      });

      let placemark = new ymaps.Placemark(mapPlaceholder, {
      }, {
        iconLayout: 'default#image',
        iconImageHref: '_/uploads/icons/placemark.png',
        iconImageSize: [50, 52],
      }, {});

      ymap.geoObjects.add(placemark);

      ymap.behaviors.disable('scrollZoom');

      function setMapPostion() {
        let dw = window.innerWidth;

        if (dw > 1220) {
          ymap.setCenter([mapPosition[0] - 0.0001, mapPosition[1] - 0.001]);
        } else if (dw <= 1220 && dw > 767) {
          ymap.setCenter([mapPosition[0], mapPosition[1] - 0.001]);
        } else {
          ymap.setCenter(mapPosition);
        }
      }

      setMapPostion();
      window.addEventListener('resize', () => {
        setMapPostion();
      });
    }
  }

  // MAP
  let $mapBuy = document.querySelector('#map-buy');
  if ($mapBuy && ymaps) {
    ymaps.ready(mapInit);

    function mapInit() {
      let mapPosition, mapPlaceholder;

      mapPosition = $mapBuy.getAttribute('data-map');
      mapPosition = mapPosition.split(',');

      for (let i = 0; i < mapPosition.length; i++) {
        mapPosition[i] = Number(mapPosition[i]);
      }

      mapPlaceholder = $mapBuy.getAttribute('data-map');
      mapPlaceholder = mapPlaceholder.split(',');

      let ymap = new ymaps.Map($mapBuy, {
        center: [mapPosition[0], mapPosition[1]],
        zoom: 4.5,
        controls: [],
      });

      let placemark = new ymaps.Placemark(mapPlaceholder, {
      }, {
        iconLayout: 'default#image',
        iconImageHref: '_/uploads/icons/heart-green-line.svg',
        iconImageSize: [23, 24],
      }, {});

      ymap.geoObjects.add(placemark);

      ymap.behaviors.disable('scrollZoom');

      // function setMapPostion() {
      //   let dw = window.innerWidth;

      //   if (dw > 1220) {
      //     ymap.setCenter([mapPosition[0], mapPosition[1]]);
      //   } else if (dw <= 1220 && dw > 767) {
      //     ymap.setCenter([mapPosition[0], mapPosition[1] - 0.01]);
      //   } else {
      //     ymap.setCenter(mapPosition);
      //   }
      // }

      // setMapPostion();
      // window.addEventListener('resize', () => {
      //   setMapPostion();
      // });
    }
  }
})