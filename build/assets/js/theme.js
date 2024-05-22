/* -------------------------------------------------------------------------- */
/*                                    Utils                                   */
/* -------------------------------------------------------------------------- */
const docReady = fn => {
  // see if DOM is already available
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    setTimeout(fn, 1);
  }
};
const resize = fn => window.addEventListener('resize', fn);
const isIterableArray = array => Array.isArray(array) && !!array.length;
const camelize = str => {
  const text = str.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
  return `${text.substr(0, 1).toLowerCase()}${text.substr(1)}`;
};
const getData = (el, data) => {
  try {
    return JSON.parse(el.dataset[camelize(data)]);
  } catch (e) {
    return el.dataset[camelize(data)];
  }
};

/* ----------------------------- Colors function ---------------------------- */

const hexToRgb = hexValue => {
  let hex;
  hexValue.indexOf('#') === 0 ? hex = hexValue.substring(1) : hex = hexValue;
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b));
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};
const rgbaColor = (color = '#fff', alpha = 0.5) => `rgba(${hexToRgb(color)}, ${alpha})`;

/* --------------------------------- Colors --------------------------------- */

const getColor = (name, dom = document.documentElement) => getComputedStyle(dom).getPropertyValue(`--aranyak-${name}`).trim();
const getColors = dom => ({
  primary: getColor('primary', dom),
  secondary: getColor('secondary', dom),
  success: getColor('success', dom),
  info: getColor('info', dom),
  warning: getColor('warning', dom),
  danger: getColor('danger', dom),
  light: getColor('light', dom),
  dark: getColor('dark', dom),
  white: getColor('white', dom),
  black: getColor('black', dom),
  emphasis: getColor('emphasis-color', dom)
});
const getSubtleColors = dom => ({
  primary: getColor('primary-bg-subtle', dom),
  secondary: getColor('secondary-bg-subtle', dom),
  success: getColor('success-bg-subtle', dom),
  info: getColor('info-bg-subtle', dom),
  warning: getColor('warning-bg-subtle', dom),
  danger: getColor('danger-bg-subtle', dom),
  light: getColor('light-bg-subtle', dom),
  dark: getColor('dark-bg-subtle', dom)
});
const getGrays = dom => ({
  100: getColor('gray-100', dom),
  200: getColor('gray-200', dom),
  300: getColor('gray-300', dom),
  400: getColor('gray-400', dom),
  500: getColor('gray-500', dom),
  600: getColor('gray-600', dom),
  700: getColor('gray-700', dom),
  800: getColor('gray-800', dom),
  900: getColor('gray-900', dom),
  1000: getColor('gray-1000', dom),
  1100: getColor('gray-1100', dom)
});
const hasClass = (el, className) => {
  !el && false;
  return el.classList.value.includes(className);
};
const addClass = (el, className) => {
  el.classList.add(className);
};
const removeClass = (el, className) => {
  el.classList.remove(className);
};
const getOffset = el => {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
};
function isScrolledIntoView(el) {
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
  const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;
  return vertInView && horInView;
}
const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1540
};
const getBreakpoint = el => {
  const classes = el && el.classList.value;
  let breakpoint;
  if (classes) {
    breakpoint = breakpoints[classes.split(' ').filter(cls => cls.includes('navbar-expand-')).pop().split('-').pop()];
  }
  return breakpoint;
};
const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

/* --------------------------------- Cookie --------------------------------- */

const setCookie = (name, value, expire) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + expire);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()}`;
};
const getCookie = name => {
  const keyValue = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return keyValue ? keyValue[2] : keyValue;
};
const settings = {
  tinymce: {
    theme: 'oxide'
  },
  chart: {
    borderColor: 'rgba(255, 255, 255, 0.8)'
  }
};

/* -------------------------- Chart Initialization -------------------------- */

const newChart = (chart, config) => {
  const ctx = chart.getContext('2d');
  return new window.Chart(ctx, config);
};

/* ---------------------------------- Store --------------------------------- */

const getItemFromStore = (key, defaultValue, store = localStorage) => {
  try {
    return JSON.parse(store.getItem(key)) || defaultValue;
  } catch {
    return store.getItem(key) || defaultValue;
  }
};
const setItemToStore = (key, payload, store = localStorage) => store.setItem(key, payload);
const getStoreSpace = (store = localStorage) => parseFloat((escape(encodeURIComponent(JSON.stringify(store))).length / (1024 * 1024)).toFixed(2));

/* get Dates between */

const getDates = (startDate, endDate, interval = 1000 * 60 * 60 * 24) => {
  const duration = endDate - startDate;
  const steps = duration / interval;
  return Array.from({
    length: steps + 1
  }, (v, i) => new Date(startDate.valueOf() + interval * i));
};
const getPastDates = duration => {
  let days;
  switch (duration) {
    case 'week':
      days = 7;
      break;
    case 'month':
      days = 30;
      break;
    case 'year':
      days = 365;
      break;
    default:
      days = duration;
  }
  const date = new Date();
  const endDate = date;
  const startDate = new Date(new Date().setDate(date.getDate() - (days - 1)));
  return getDates(startDate, endDate);
};

/* Get Random Number */
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
const utils = {
  docReady,
  breakpoints,
  resize,
  isIterableArray,
  camelize,
  getData,
  hasClass,
  addClass,
  hexToRgb,
  rgbaColor,
  getColor,
  getColors,
  getSubtleColors,
  getGrays,
  getOffset,
  isScrolledIntoView,
  getBreakpoint,
  setCookie,
  getCookie,
  newChart,
  settings,
  getItemFromStore,
  setItemToStore,
  getStoreSpace,
  getDates,
  getPastDates,
  getRandomNumber,
  removeClass,
  getSystemTheme
};

/* -------------------------------------------------------------------------- */
/*                                  Detector                                  */
/* -------------------------------------------------------------------------- */

const detectorInit = () => {
  const {
    is
  } = window;
  const html = document.querySelector('html');
  is.opera() && addClass(html, 'opera');
  is.mobile() && addClass(html, 'mobile');
  is.firefox() && addClass(html, 'firefox');
  is.safari() && addClass(html, 'safari');
  is.ios() && addClass(html, 'ios');
  is.iphone() && addClass(html, 'iphone');
  is.ipad() && addClass(html, 'ipad');
  is.ie() && addClass(html, 'ie');
  is.edge() && addClass(html, 'edge');
  is.chrome() && addClass(html, 'chrome');
  is.mac() && addClass(html, 'osx');
  is.windows() && addClass(html, 'windows');
  navigator.userAgent.match('CriOS') && addClass(html, 'chrome');
};

/*-----------------------------------------------
|   DomNode
-----------------------------------------------*/
class DomNode {
  constructor(node) {
    this.node = node;
  }
  addClass(className) {
    this.isValidNode() && this.node.classList.add(className);
  }
  removeClass(className) {
    this.isValidNode() && this.node.classList.remove(className);
  }
  toggleClass(className) {
    this.isValidNode() && this.node.classList.toggle(className);
  }
  hasClass(className) {
    this.isValidNode() && this.node.classList.contains(className);
  }
  data(key) {
    if (this.isValidNode()) {
      try {
        return JSON.parse(this.node.dataset[this.camelize(key)]);
      } catch (e) {
        return this.node.dataset[this.camelize(key)];
      }
    }
    return null;
  }
  attr(name) {
    return this.isValidNode() && this.node[name];
  }
  setAttribute(name, value) {
    this.isValidNode() && this.node.setAttribute(name, value);
  }
  removeAttribute(name) {
    this.isValidNode() && this.node.removeAttribute(name);
  }
  setProp(name, value) {
    this.isValidNode() && (this.node[name] = value);
  }
  on(event, cb) {
    this.isValidNode() && this.node.addEventListener(event, cb);
  }
  isValidNode() {
    return !!this.node;
  }

  // eslint-disable-next-line class-methods-use-this
  camelize(str) {
    const text = str.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    return `${text.substr(0, 1).toLowerCase()}${text.substr(1)}`;
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Count Up                                  */
/* -------------------------------------------------------------------------- */

const countupInit = () => {
  if (window.countUp) {
    const countups = document.querySelectorAll('[data-countup]');
    countups.forEach(node => {
      const {
        autoIncreasing,
        ...options
      } = utils.getData(node, 'countup');
      let {
        endValue
      } = options;
      const countUp = new window.countUp.CountUp(node, endValue, {
        duration: 5,
        enableScrollOnce: true,
        ...options
      });
      if (!countUp.error && autoIncreasing) {
        countUp.update(endValue);
        const interval = setInterval(() => {
          endValue += 1;
          countUp.update(endValue);
        }, 1500);
        window.addEventListener('close', () => {
          clearInterval(interval);
        });
      } else if (!countUp.error) {
        countUp.start();
      } else {
        console.error(countUp.error);
      }
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                               from-validation                              */
/* -------------------------------------------------------------------------- */

const formValidationInit = () => {
  // Example starter JavaScript for disabling form submissions if there are invalid fields
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener("submit", function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    }, false);
  });
};

/*-----------------------------------------------
|  Navbar
-----------------------------------------------*/

const navbarInit = () => {
  const navbar = document.querySelector('[data-navbar-soft-on-scroll]');
  const navbarContainer = document.querySelector('[data-navbar-collapse]');
  if (navbar) {
    const windowHeight = window.innerHeight;
    const handleAlpha = () => {
      const scrollTop = window.scrollY;
      const alpha = scrollTop / windowHeight * 2;
      let opacity;
      let blur;
      if (alpha <= 0) {
        opacity = 1;
        blur = 0;
      } else if (alpha >= 1) {
        opacity = 0.65;
        blur = 10;
      } else {
        opacity = 1 - alpha * 0.5;
        blur = alpha * 10;
      }
      navbar.style.backgroundColor = `rgba(255, 218, 145, ${opacity})`;
      navbarContainer.style.backgroundColor = `rgba(255, 218, 145, ${opacity})`;
      navbar.style.backdropFilter = `blur(${blur}px)`;
      navbarContainer.style.backdropFilter = `blur(${blur}px)`;
    };
    handleAlpha();
    document.addEventListener('scroll', () => handleAlpha());
  }
  const navbarNav = document.querySelector('[data-navbar-nav]');
  navbarNav.addEventListener('click', event => {
    if (event.target.closest('li')) {
      const navbarToggler = document.querySelector('[data-bs-toggle]');
      const navbarItemContainer = document.querySelector('[data-navbar-collapse]');
      navbarToggler.setAttribute('aria-expanded', false);
      navbarItemContainer.classList.remove('show');
      navbarToggler.classList.add('collapsed');
    }
  });
};

/*-----------------------------------------------
|  Scroll To Top
-----------------------------------------------*/

const scrollToTopInit = () => {
  const btn = document.querySelector('[data-scroll-top]');
  if (btn) {
    btn.style.display = 'none';
    // eslint-disable-next-line func-names
    window.onscroll = () => {
      if (window.scrollY > 550) {
        btn.style.display = 'block';
      } else {
        btn.style.display = 'none';
      }
    };
    btn.addEventListener('click', () => {
      window.scrollTo(0, 0);
    });
  }
};

/*-----------------------------------------------
|  Swiper
-----------------------------------------------*/

const swiperInit = () => {
  const themeContainers = document.querySelectorAll('.swiper-theme-container');
  const navbarVerticalToggle = document.querySelector('.navbar-vertical-toggle');
  themeContainers.forEach(themeContainer => {
    const swiper = themeContainer.querySelector('[data-swiper]');
    const options = utils.getData(swiper, 'swiper');
    const swiperNav = themeContainer.querySelector('.slider-nav');
    const newSwiper = new window.Swiper(swiper, {
      ...options,
      navigation: {
        nextEl: swiperNav?.querySelector('.next-button'),
        prevEl: swiperNav?.querySelector('.prev-button')
      }
    });
    if (navbarVerticalToggle) {
      navbarVerticalToggle.addEventListener('navbar.vertical.toggle', () => {
        newSwiper.update();
      });
    }
  });
};

/* -------------------------------------------------------------------------- */
/*                            Theme Initialization                            */
/* -------------------------------------------------------------------------- */
docReady(detectorInit);
docReady(navbarInit);
docReady(formValidationInit);
docReady(swiperInit);
docReady(countupInit);
docReady(scrollToTopInit);