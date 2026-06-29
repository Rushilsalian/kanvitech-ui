/**
 * Kanvtech Solutions - Core Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect
  const header = document.querySelector('.header-banner');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('active');
      }
    });
  }

  // 3. Mobile Dropdown Toggle
  const dropdownItems = document.querySelectorAll('.nav-item');
  dropdownItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.nav-dropdown');
    
    if (link && dropdown) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          // If dropdown has actual menu, prevent default routing to toggle on mobile
          const hasDropdown = dropdown.children.length > 0;
          if (hasDropdown) {
            e.preventDefault();
            const isOpen = dropdown.style.display === 'block';
            dropdown.style.display = isOpen ? 'none' : 'block';
          }
        }
      });
    }
  });

  // 4. Scroll Reveal Animations (using Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 5. Stats Counters Animation
  const statsSection = document.querySelector('.stats-strip');
  const statsElements = document.querySelectorAll('.stat-number');
  
  if (statsSection && statsElements.length > 0) {
    let countersStarted = false;
    
    const startCounters = () => {
      statsElements.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const stepTime = Math.max(Math.floor(duration / target), 15);
        let current = 0;
        
        const timer = setInterval(() => {
          current += Math.ceil(target / (duration / stepTime));
          if (current >= target) {
            counter.textContent = target + (counter.getAttribute('data-suffix') || '');
            clearInterval(timer);
          } else {
            counter.textContent = current + (counter.getAttribute('data-suffix') || '');
          }
        }, stepTime);
      });
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          startCounters();
        }
      });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
  }

  // 6. Testimonial Slider / Carousel
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  const testimonialSlider = document.querySelector('.testimonial-slider');

  if (testimonialSlides.length > 0 && testimonialDots.length > 0 && testimonialSlider) {
    let currentSlide = 0;

    const goToSlide = (slideIndex) => {
      currentSlide = slideIndex;
      testimonialSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update dots active class
      testimonialDots.forEach((dot, index) => {
        if (index === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    testimonialDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
    });

    // Auto-slide every 5 seconds
    setInterval(() => {
      let nextSlide = currentSlide + 1;
      if (nextSlide >= testimonialSlides.length) {
        nextSlide = 0;
      }
      goToSlide(nextSlide);
    }, 5000);
  }

  // 7. FAQ Accordion toggle
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close other active FAQ items
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
      });
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 8. Contact Form validation and simulated submission
  const enquiryForm = document.getElementById('enquiryForm');
  const successAlert = document.getElementById('formSuccessAlert');

  if (enquiryForm && successAlert) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather input elements for basic custom highlight
      const requiredInputs = enquiryForm.querySelectorAll('[required]');
      let formIsValid = true;

      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          formIsValid = false;
          input.style.borderColor = 'red';
          
          input.addEventListener('input', () => {
            input.style.borderColor = '';
          }, { once: true });
        }
      });

      if (formIsValid) {
        // Show success alert
        successAlert.style.display = 'block';
        enquiryForm.reset();

        // Scroll to success message
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Hide success message after 8 seconds
        setTimeout(() => {
          successAlert.style.display = 'none';
        }, 8000);
      }
    });
  }
});
