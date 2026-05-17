(function () {
  "use strict";

  const body = document.body;
  const header = document.querySelector("#header");
  const nav = document.querySelector("#main-navigation");
  const navToggle = document.querySelector(".nav-toggle");
  const scrollTopButton = document.querySelector("#scroll-top");
  const navLinks = document.querySelectorAll(".main-navigation a");

  function updateScrolledState() {
    if (!header || (!header.classList.contains("sticky-top") && !header.classList.contains("fixed-top"))) {
      return;
    }

    body.classList.toggle("scrolled", window.scrollY > 100);
  }

  function setMobileNavigationState(isOpen) {
    nav.classList.toggle("is-open", isOpen);
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  }

  function toggleMobileNavigation() {
    setMobileNavigationState(!nav.classList.contains("is-open"));
  }

  function closeMobileNavigation() {
    if (nav && nav.classList.contains("is-open")) {
      setMobileNavigationState(false);
    }
  }

  function removePreloader() {
    const preloader = document.querySelector("#preloader");

    if (preloader) {
      preloader.remove();
    }
  }

  function updateScrollTopButton() {
    if (scrollTopButton) {
      scrollTopButton.classList.toggle("active", window.scrollY > 100);
    }
  }

  function initAos() {
    if (typeof AOS === "undefined") {
      return;
    }

    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }

  function initSwipers() {
    if (typeof Swiper === "undefined") {
      return;
    }

    document.querySelectorAll(".init-swiper").forEach((swiperElement) => {
      const configElement = swiperElement.querySelector(".swiper-config");

      if (!configElement) {
        return;
      }

      const config = JSON.parse(configElement.textContent.trim());
      new Swiper(swiperElement, config);
    });
  }

  function scrollToInitialHash() {
    if (!window.location.hash) {
      return;
    }

    const section = document.querySelector(window.location.hash);

    if (!section) {
      return;
    }

    setTimeout(() => {
      const scrollMarginTop = parseInt(getComputedStyle(section).scrollMarginTop, 10);

      window.scrollTo({
        top: section.offsetTop - scrollMarginTop,
        behavior: "smooth",
      });
    }, 100);
  }

  function updateActiveNavLink() {
    const position = window.scrollY + 200;

    navLinks.forEach((link) => {
      if (!link.hash) {
        return;
      }

      const section = document.querySelector(link.hash);

      if (!section) {
        return;
      }

      const isActive = position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight;
      link.classList.toggle("active", isActive);
    });
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", toggleMobileNavigation);

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target)) {
        closeMobileNavigation();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileNavigation();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNavigation);
  });

  if (scrollTopButton) {
    scrollTopButton.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  window.addEventListener("load", () => {
    updateScrolledState();
    updateScrollTopButton();
    updateActiveNavLink();
    removePreloader();
    initAos();
    initSwipers();
    scrollToInitialHash();
  });

  document.addEventListener("scroll", () => {
    updateScrolledState();
    updateScrollTopButton();
    updateActiveNavLink();
  });
})();
