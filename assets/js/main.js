// ===== ANTI-INSPECT DETERRENT =====
document.addEventListener('DOMContentLoaded', () => {
    // Disable right-click
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Block F12, Ctrl+Shift+I/C/J, Ctrl+U (but allow Ctrl+C)
    document.addEventListener('keydown', e => {
        if (e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key.toUpperCase())) ||
            (e.ctrlKey && e.key.toUpperCase() === 'U')) {
            e.preventDefault();
        }
    });

    // Console warning
    console.log('%c⚠️ STOP!', 'font-size:48px;color:red;font-weight:bold');
    console.log('%cThis browser feature is for development only. Do not paste anything here.', 'font-size:16px');

    // ===== SCROLL REVEAL ANIMATION =====
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.stat-number, .highlight-card .number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    function animateCounter(el) {
        const target = el.getAttribute('data-count');
        const numericValue = parseInt(target.replace(/\D/g, ''));
        const suffix = target.replace(/[0-9]/g, '');
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * numericValue);
            
            el.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // ===== BOOKING FORM =====
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        let lastSubmit = 0;
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Rate limiting: 1 submission per 5 seconds
            const now = Date.now();
            if (now - lastSubmit < 5000) {
                const btn = bookingForm.querySelector('.form-submit');
                btn.innerHTML = '<span class="btn-row"><i class="fas fa-clock"></i><span class="btn-text">PLEASE WAIT...</span></span>';
                btn.style.background = '#dc3545';
                setTimeout(() => {
                    btn.innerHTML = btn.dataset.originalHTML || btn.innerHTML;
                    btn.style.background = '';
                }, 2000);
                return;
            }
            lastSubmit = now;

            // Sanitize inputs
            const stripHTML = (s) => s.replace(/<[^>]*>/g, '').replace(/[<>"'&]/g, '').trim();
            const name = stripHTML(document.getElementById('name').value);
            const phone = stripHTML(document.getElementById('phone').value).replace(/[^0-9+\-() ]/g, '');
            const city = stripHTML(document.getElementById('city').value);
            const date = document.getElementById('date').value;
            const message = stripHTML(document.getElementById('message').value) || "No message";

            if (!name || !phone || !date || !city) {
                const btn = bookingForm.querySelector('.form-submit');
                btn.innerHTML = '<span class="btn-row"><i class="fas fa-exclamation-triangle"></i><span class="btn-text">FILL ALL FIELDS</span></span>';
                btn.style.background = '#dc3545';
                setTimeout(() => { btn.innerHTML = btn.dataset.originalHTML || btn.innerHTML; btn.style.background = ''; }, 2000);
                return;
            }

            // Validate phone (Indian mobile: 10 digits after +91 or 0)
            const digits = phone.replace(/\D/g, '');
            if (digits.length < 10 || digits.length > 13) {
                const btn = bookingForm.querySelector('.form-submit');
                btn.innerHTML = '<span class="btn-row"><i class="fas fa-phone"></i><span class="btn-text">INVALID PHONE</span></span>';
                btn.style.background = '#dc3545';
                setTimeout(() => { btn.innerHTML = btn.dataset.originalHTML || btn.innerHTML; btn.style.background = ''; }, 2000);
                return;
            }

            const text = encodeURIComponent(
`🪔 *Sankirtan Booking Request*

*Name:* ${name}
*Phone:* ${phone}
*City:* ${city}
*Event Date:* ${date}
*Message:* ${message}

Jai Mata Di 🙏`
            );

            window.open(`https://wa.me/919718108886?text=${text}`, '_blank');
            
            const btn = bookingForm.querySelector('.form-submit');
            btn.dataset.originalHTML = btn.innerHTML;
            btn.innerHTML = '<span class="btn-row"><i class="fas fa-check"></i><span class="btn-text">✓ OPENING WHATSAPP...</span></span>';
            btn.style.background = '#25D366';
            
            setTimeout(() => {
                btn.innerHTML = btn.dataset.originalHTML || btn.innerHTML;
                btn.style.background = '';
                bookingForm.reset();
            }, 2500);
        });
    }

    // ===== MOBILE MENU TOGGLE =====
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.navbar-links');
    const navOverlay = document.querySelector('.nav-overlay');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('mobile-open');
            mobileToggle.classList.toggle('active');
            navOverlay.classList.toggle('active');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        
        // Close menu on link click or overlay click
        [navLinks.querySelectorAll('a'), navOverlay].forEach(trigger => {
            const elements = trigger instanceof NodeList ? trigger : [trigger];
            elements.forEach(el => {
                el.addEventListener('click', () => {
                    navLinks.classList.remove('mobile-open');
                    mobileToggle.classList.remove('active');
                    navOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        });
    }

    // ===== IMAGE LOADING FADE-IN =====
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        const reveal = () => img.classList.add('loaded');
        if (img.complete) {
            reveal();
        } else {
            img.addEventListener('load', reveal);
            img.addEventListener('error', reveal);
        }
    });

    // ===== LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    window.openLightbox = function(el) {
        const img = el.querySelector('img');
        if (img && lightbox && lightboxImg) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});
