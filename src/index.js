gsap.registerPlugin(ScrollTrigger, CustomEase)

console.log("test")

handleDropdownAnimation();
imageScrollDelay();
initHomeHeroSwiper()
initDetectScrollingDirection()
initReviewsSwiper()

// ------ BASE ------ //

// Initialize a new Lenis instance for smooth scrolling
const lenis = new Lenis();

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on('scroll', ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);

CustomEase.create("main", "M0,0 C0.446,0 0.301,1 1,1 ");

gsap.defaults({
  ease: "main",
  duration: 0.4,
});

// ------ GLOBAL / PAGE WIDE ------ //

function handleDropdownAnimation() {
  const dropdowns = $(".nav_menu-dropdown");
  const breakpoint =
    768; // Bepaal de schermgrootte waarop je wil schakelen tussen desktop/tablet en mobiel

  if (window.innerWidth >= breakpoint) {
    // Desktop/Tablet logica (met gsap animaties)
    dropdowns.each(function () {
      const link = $(this);
      const dropdown = link.find(".nav_dropdown-list");
      const dropdownLinks = dropdown.find(".nav_dropdown-link");

      const openTl = gsap.timeline({ paused: true });
      const closeTl = gsap.timeline({ paused: true });

      // Open animatie
      openTl
        .set(dropdown, { display: "flex" })
        .fromTo(
          dropdown, { opacity: 0, y: "4rem" }, { opacity: 1, y: "2rem", duration: 0.3 },
          "<"
        )
        .fromTo(
          dropdownLinks, { opacity: 0, y: "1rem" }, {
            opacity: 1,
            y: "0rem",
            duration: 0.3,
            stagger: 0.08
          },
          "<"
        );

      // Close animatie
      closeTl
        .to(dropdown, { opacity: 0, y: "2rem", duration: 0.4 })
        .set(dropdown, { display: "none" });

      // Event Listeners
      link.on("mouseenter", () => {
        closeTl.pause();
        openTl.restart();
      });

      link.on("mouseleave", () => {
        openTl.pause();
        closeTl.restart();
      });
    });
  } else {
    // Mobiele logica (class toggle op klik)
    dropdowns.each(function () {
      const link = $(this);
      const dropdown = link.find(".nav_dropdown-list");

      // Klik event listener voor mobiel
      link.on("click", function (e) {
        console.log("dropdown cliciked")
        dropdown.toggleClass("is-active");
      });
    });
  }
}

// Update logica wanneer de schermgrootte verandert
$(window).on("resize", function () {
  $(".nav_menu-dropdown").off(); // Verwijder eerdere event listeners
  handleDropdownAnimation(); // Heractiveer de logica op basis van de nieuwe schermgrootte
});

function imageScrollDelay() {
  $("[data-image-wrap]").each(function () {
    const imageWrap = $(this);
    const img = imageWrap.find("img");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: imageWrap[0], // Gebruik het DOM-element uit de jQuery-selectie
        scrub: true,
        pin: false,
      }
    });
    tl.fromTo(img, { // Gebruik het DOM-element uit de jQuery-selectie
      yPercent: -10,
      ease: 'none'
    }, {
      yPercent: 10,
      ease: 'none'
    });
  });
}

function initDetectScrollingDirection() {
  let lastScrollTop = 0;
  const threshold = 10; // Minimale scrollafstand om richting te bepalen
  const thresholdTop = 50; // Afstand vanaf de top waarna we echt 'gestart' zijn
  const navElem = document.querySelector('.nav_component');

  window.addEventListener('scroll', () => {
    const nowScrollTop = window.scrollY;

    // Pas logica alleen toe als er minstens 'threshold' px sinds de laatste check gescrold is
    if (Math.abs(lastScrollTop - nowScrollTop) >= threshold) {
      const direction = nowScrollTop > lastScrollTop ? 'down' : 'up';
      // Data-attributen voor debugging of styling (optioneel)
      document.querySelectorAll('[data-scrolling-direction]')
        .forEach(el => el.setAttribute('data-scrolling-direction', direction));

      // Heeft de gebruiker meer dan thresholdTop (50px) gescrold?
      const started = nowScrollTop > thresholdTop;
      document.querySelectorAll('[data-scrolling-started]')
        .forEach(el => el.setAttribute('data-scrolling-started', started ? 'true' : 'false'));

      // --- DIRECT DE HOOGTE VAN NAV AANPASSEN ---
      if (!started) {
        // Nog geen 50px gescrold -> nav blijft hoog
        navElem.style.height = '5rem';
      } else {
        // Wel > 50px gescrold
        if (direction === 'down') {
          // Scrolt omlaag -> nav verkleinen naar 4rem
          navElem.style.height = '3.5rem';
        } else {
          // Scrolt omhoog -> nav vergroten naar 6rem
          navElem.style.height = '5rem';
        }
      }
      // ------------------------------------------

      lastScrollTop = nowScrollTop;
    }
  });
}

function initReviewsSwiper() {
  let reviewsSwiper = new Swiper(".swiper.is-reviews", {
    direction: "horizontal",
    speed: 500,

    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 16
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 2,
        spaceBetween: 16
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 2,
        spaceBetween: 24
      }
    },
    pagination: {
      el: ".swiper-page",
      clickable: true,
    },
    // Navigation arrows
    navigation: {
      prevEl: '[data-swiper-navigation="left"]',
      nextEl: '[data-swiper-navigation="right"]',
    },
  })
}
// ------ HOME ------ //

function initHomeHeroSwiper() {
  const AUTOPLAY_DELAY = 5000
  const SWIPER_SPEED = 400

  let homeHeroSwiper = new Swiper(".swiper.is-hero_bg", {
    direction: "horizontal",
    slidesPerView: 1,
    loop: true,
    speed: SWIPER_SPEED,
    autoplay: {
      delay: AUTOPLAY_DELAY,
    },
  })
}

if (document.querySelector('.section_header30')) {
  $('.section_header30').each(function (index) {
    let triggerElement = $(this);
    let targetElement = $(this).find('.header103_content-wrapper');
    let imageElement = $(this).find(".swiper ")

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "0% 0%",
        end: "100% 0%",
        scrub: true, // Changed scrub to true for smooth scrubbing
        markers: false
      }
    });

    tl.to(targetElement, {
      ease: "none",
      yPercent: -50,
    });

    tl.to(imageElement, {
      ease: "none",
      yPercent: 50,
    }, "<");
  });
}

if (document.querySelector('[data-animate-scroll="wrapper"]')) {
  $('[data-animate-scroll="wrapper"]').each(function () {
    let triggerElement = $(this);
    let targetElement = $(this).find('[data-animate-scroll="item"]')

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "0% 85%",
        end: "100% 0%",
        toggleActions: "play none none none",
      }
    });

    gsap.set(targetElement, {
      y: "40px",
      opacity: 0,
    });

    tl.to(targetElement, {
      y: "0px",
      opacity: 1,
      rotate: 0.001,
      stagger: 0.05,
      duration: 1,
      ease: "main",
      clearProps: "all"
    });
  });
}
