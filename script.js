/* =========================================================
   SUKA DI BALI
   TOUR & TRANSPORT
   PREMIUM WEBSITE - MAIN JAVASCRIPT

   FEATURES:
   01. Configuration
   02. DOM Elements
   03. General Utilities
   04. WhatsApp Integration
   05. Responsive Navigation
   06. Smooth Scroll
   07. FAQ Accordion
   08. Active Navigation
   09. Copyright Year
   10. Image Error Handling
   11. Background Music
   12. Booking Form
   13. Destination & Tour Selection
   14. Booking Date Validation
   15. Website Initialization

   OPTIMIZED:
   - Desktop, tablet and mobile
   - Accessible navigation
   - Smooth scrolling
   - Reduced motion support
   - WhatsApp integration
   - Automatic tour selection
   - Booking form validation
   - Background music controls
   - Safe DOM handling
   - Prevent duplicate initialization
========================================================= */


/* =========================================================
   01. CONFIGURATION
========================================================= */

const CONFIG = Object.freeze({

    // WhatsApp number without + or spaces
    whatsappNumber: "6281990981574",

    // Mobile navigation breakpoint
    mobileBreakpoint: 900,

    // Background music volume (0 - 1)
    musicVolume: 0.3,

    // Default WhatsApp message
    defaultMessage:
        "Hello Suka Di Bali! I would like to ask about your services.",

    // Smooth scroll settings
    scrollDuration: 850,
    scrollOffset: 15,

    // Booking settings
    maxGuests: 100,
    minNameLength: 2,
    maxNameLength: 100

});


/* =========================================================
   02. DOM ELEMENTS
========================================================= */

const DOM = {

    // Navigation
    menuToggle: document.getElementById("menuToggle"),
    navLinks: document.getElementById("navLinks"),
    header: document.querySelector("header"),

    // Copyright
    year: document.getElementById("year"),

    // Background music
    backgroundMusic:
        document.getElementById("backgroundMusic"),

    musicToggle:
        document.getElementById("musicToggle"),

    // WhatsApp
    whatsappLinks:
        document.querySelectorAll(
            ".whatsapp-direct, #whatsappLink"
        ),

    // FAQ
    faqItems:
        document.querySelectorAll(".faq-item"),

    // Page sections
    sections:
        document.querySelectorAll("main section[id]"),

    // Navigation links
    navigationItems:
        document.querySelectorAll(
            '.nav-links a[href^="#"]'
        ),

    // Booking form
    bookingForm:
        document.getElementById("bookingForm"),

    bookingDate:
        document.getElementById("bookingDate"),

    bookingStatus:
        document.getElementById("bookingFormStatus"),

    bookingService:
        document.getElementById("bookingService")

};


/* =========================================================
   03. GENERAL UTILITIES
========================================================= */

const Utils = {

    /* -----------------------------------------
       Check mobile viewport
    ----------------------------------------- */

    isMobile() {

        return window.matchMedia(
            `(max-width: ${CONFIG.mobileBreakpoint}px)`
        ).matches;

    },


    /* -----------------------------------------
       Check reduced motion preference
    ----------------------------------------- */

    prefersReducedMotion() {

        return window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    },


    /* -----------------------------------------
       Debounce function
    ----------------------------------------- */

    debounce(callback, delay = 150) {

        let timeout;

        return function (...args) {

            clearTimeout(timeout);

            timeout = setTimeout(() => {

                callback.apply(this, args);

            }, delay);

        };

    },


    /* -----------------------------------------
       Get header height
    ----------------------------------------- */

    getHeaderHeight() {

        if (!DOM.header) return 0;

        return DOM.header.getBoundingClientRect().height;

    },


    /* -----------------------------------------
       Calculate target scroll position
    ----------------------------------------- */

    getTargetPosition(element) {

        if (!element) return 0;

        const elementPosition =
            element.getBoundingClientRect().top +
            window.scrollY;

        const offset =
            this.getHeaderHeight() +
            CONFIG.scrollOffset;

        const maxScroll = Math.max(
            0,
            document.documentElement.scrollHeight -
            window.innerHeight
        );

        return Math.min(
            Math.max(0, elementPosition - offset),
            maxScroll
        );

    },


    /* -----------------------------------------
       Get local date (YYYY-MM-DD)
    ----------------------------------------- */

    getLocalDate() {

        const now = new Date();

        const year = now.getFullYear();

        const month = String(
            now.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            now.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    },


    /* -----------------------------------------
       Validate actual calendar date
    ----------------------------------------- */

    isValidDate(dateString) {

        if (
            typeof dateString !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
        ) {

            return false;

        }

        const [year, month, day] =
            dateString.split("-").map(Number);

        const date = new Date(0);

        date.setHours(0, 0, 0, 0);

        date.setFullYear(
            year,
            month - 1,
            day
        );

        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );

    },


    /* -----------------------------------------
       Format date for WhatsApp
    ----------------------------------------- */

    formatDate(dateString) {

        if (!this.isValidDate(dateString)) {

            return dateString || "Not provided";

        }

        const [year, month, day] =
            dateString.split("-").map(Number);

        const date = new Date(0);

        date.setHours(0, 0, 0, 0);

        date.setFullYear(
            year,
            month - 1,
            day
        );

        return date.toLocaleDateString("en-GB", {

            day: "2-digit",
            month: "long",
            year: "numeric"

        });

    },


    /* -----------------------------------------
       Validate email
    ----------------------------------------- */

    isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    },


    /* -----------------------------------------
       Normalize text for comparison
    ----------------------------------------- */

    normalizeText(value) {

        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

    },


    /* -----------------------------------------
       Dispatch input and change events
    ----------------------------------------- */

    dispatchFieldEvents(element) {

        if (!element) return;

        element.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );

        element.dispatchEvent(
            new Event("change", {
                bubbles: true
            })
        );

    },


    /* -----------------------------------------
       Safely get an element value
    ----------------------------------------- */

    getValue(id) {

        const element = document.getElementById(id);

        if (!element || !("value" in element)) {

            return "";

        }

        return String(element.value).trim();

    },


    /* -----------------------------------------
       Check whether element is an input control
    ----------------------------------------- */

    isFormControl(element) {

        return (
            element instanceof HTMLElement &&
            (
                element.isContentEditable ||
                [
                    "INPUT",
                    "TEXTAREA",
                    "SELECT",
                    "BUTTON"
                ].includes(element.tagName)
            )
        );

    }

};


/* =========================================================
   04. WHATSAPP INTEGRATION
========================================================= */

const WhatsApp = {

    /* -----------------------------------------
       Get WhatsApp number
    ----------------------------------------- */

    getPhoneNumber() {

        return String(
            CONFIG.whatsappNumber || ""
        ).replace(/\D/g, "");

    },


    /* -----------------------------------------
       Create WhatsApp URL
    ----------------------------------------- */

    createURL(message = CONFIG.defaultMessage) {

        const phone = this.getPhoneNumber();

        if (!phone || phone.length < 8) {

            console.error(
                "Invalid WhatsApp number. Check CONFIG.whatsappNumber."
            );

            return null;

        }

        const finalMessage =
            String(message || "").trim() ||
            CONFIG.defaultMessage;

        return (
            `https://wa.me/${phone}?text=` +
            encodeURIComponent(finalMessage)
        );

    },


    /* -----------------------------------------
       Open WhatsApp
    ----------------------------------------- */

    open(message = CONFIG.defaultMessage) {

        const url = this.createURL(message);

        if (!url) {

            alert(
                "WhatsApp number is not configured correctly."
            );

            return false;

        }

        // This method should be called directly
        // from a user click to avoid popup blocking.

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );

        return true;

    },


    /* -----------------------------------------
       Initialize direct WhatsApp buttons
    ----------------------------------------- */

    init() {

        DOM.whatsappLinks.forEach(link => {

            link.addEventListener("click", event => {

                event.preventDefault();

                const message =
                    link.dataset.message ||
                    CONFIG.defaultMessage;

                this.open(message);

            });

        });

    }

};


/* =========================================================
   05. RESPONSIVE NAVIGATION
========================================================= */

const Navigation = {

    desktopQuery: null,


    /* -----------------------------------------
       Check menu state
    ----------------------------------------- */

    isOpen() {

        return Boolean(
            DOM.navLinks?.classList.contains("active")
        );

    },


    /* -----------------------------------------
       Update hamburger button
    ----------------------------------------- */

    updateButton(isOpen) {

        if (!DOM.menuToggle) return;

        DOM.menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        DOM.menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );

        DOM.menuToggle.setAttribute(
            "aria-controls",
            "navLinks"
        );

        DOM.menuToggle.textContent =
            isOpen ? "✕" : "☰";

    },


    /* -----------------------------------------
       Open mobile menu
    ----------------------------------------- */

    open() {

        if (!DOM.menuToggle || !DOM.navLinks) return;

        if (!Utils.isMobile()) return;

        DOM.navLinks.classList.add("active");

        document.body.classList.add("menu-open");

        this.updateButton(true);

    },


    /* -----------------------------------------
       Close mobile menu
    ----------------------------------------- */

    close() {

        DOM.navLinks?.classList.remove("active");

        document.body.classList.remove("menu-open");

        this.updateButton(false);

    },


    /* -----------------------------------------
       Toggle menu
    ----------------------------------------- */

    toggle() {

        if (this.isOpen()) {

            this.close();

        } else {

            this.open();

        }

    },


    /* -----------------------------------------
       Initialize navigation
    ----------------------------------------- */

    init() {

        if (!DOM.menuToggle || !DOM.navLinks) return;

        this.close();


        // Hamburger button
        DOM.menuToggle.addEventListener("click", event => {

            event.preventDefault();

            event.stopPropagation();

            this.toggle();

        });


        // Close menu after clicking a navigation link
        DOM.navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                this.close();

            });

        });


        // Close menu when clicking outside
        document.addEventListener("click", event => {

            if (!this.isOpen()) return;

            const insideMenu =
                DOM.navLinks.contains(event.target);

            const insideButton =
                DOM.menuToggle.contains(event.target);

            if (!insideMenu && !insideButton) {

                this.close();

            }

        });


        // Close menu with Escape
        document.addEventListener("keydown", event => {

            if (
                event.key === "Escape" &&
                this.isOpen()
            ) {

                this.close();

                DOM.menuToggle.focus();

            }

        });


        // Close menu when switching to desktop
        this.desktopQuery = window.matchMedia(
            `(min-width: ${CONFIG.mobileBreakpoint + 1}px)`
        );

        const handleBreakpoint = event => {

            if (event.matches) {

                this.close();

            }

        };

        if (this.desktopQuery.addEventListener) {

            this.desktopQuery.addEventListener(
                "change",
                handleBreakpoint
            );

        } else {

            this.desktopQuery.addListener(
                handleBreakpoint
            );

        }


        // Additional viewport resize handling
        window.addEventListener(
            "resize",
            Utils.debounce(() => {

                if (!Utils.isMobile()) {

                    this.close();

                }

            }, 150),
            { passive: true }
        );

    }

};


/* =========================================================
   06. CUSTOM SMOOTH SCROLL
========================================================= */

const SmoothScroll = {

    animationFrame: null,

    startPosition: 0,

    targetPosition: 0,

    startTime: null,

    duration: CONFIG.scrollDuration,

    isAnimating: false,


    /* -----------------------------------------
       Easing animation
    ----------------------------------------- */

    easeInOutCubic(progress) {

        return progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(
                -2 * progress + 2,
                3
            ) / 2;

    },


    /* -----------------------------------------
       Stop current animation
    ----------------------------------------- */

    stop() {

        if (this.animationFrame !== null) {

            cancelAnimationFrame(
                this.animationFrame
            );

        }

        this.animationFrame = null;

        this.isAnimating = false;

        this.startTime = null;

    },


    /* -----------------------------------------
       Animate scroll
    ----------------------------------------- */

    animate(timestamp) {

        if (!this.isAnimating) return;

        if (this.startTime === null) {

            this.startTime = timestamp;

        }

        const elapsed =
            timestamp - this.startTime;

        const progress = Math.min(
            elapsed / this.duration,
            1
        );

        const eased =
            this.easeInOutCubic(progress);

        const currentPosition =
            this.startPosition +
            (
                this.targetPosition -
                this.startPosition
            ) * eased;

        window.scrollTo(0, currentPosition);

        if (progress < 1) {

            this.animationFrame =
                requestAnimationFrame(
                    this.animate.bind(this)
                );

        } else {

            const finalPosition =
                this.targetPosition;

            this.stop();

            window.scrollTo(0, finalPosition);

        }

    },


    /* -----------------------------------------
       Scroll to element
    ----------------------------------------- */

    scrollTo(element) {

        if (!element) return;

        this.stop();

        const target =
            Utils.getTargetPosition(element);

        if (Utils.prefersReducedMotion()) {

            window.scrollTo(0, target);

            return;

        }

        this.startPosition = window.scrollY;

        this.targetPosition = target;

        this.startTime = null;

        this.isAnimating = true;

        this.animationFrame =
            requestAnimationFrame(
                this.animate.bind(this)
            );

    },


    /* -----------------------------------------
       Handle manual user interaction
    ----------------------------------------- */

    handleUserInteraction(event) {

        if (!this.isAnimating) return;

        if (event.type === "keydown") {

            const scrollKeys = [

                "ArrowUp",
                "ArrowDown",
                "PageUp",
                "PageDown",
                "Home",
                "End",
                " "

            ];

            if (!scrollKeys.includes(event.key)) return;

            if (Utils.isFormControl(event.target)) {

                return;

            }

        }

        this.stop();

    },


    /* -----------------------------------------
       Handle browser Back / Forward
    ----------------------------------------- */

    handleHistory() {

        const hash = window.location.hash;

        if (!hash || hash === "#") return;

        let target;

        try {

            target = document.getElementById(
                decodeURIComponent(hash.slice(1))
            );

        } catch (error) {

            return;

        }

        if (target) {

            this.scrollTo(target);

        }

    },


    /* -----------------------------------------
       Initialize smooth scroll
    ----------------------------------------- */

    init() {

        document.querySelectorAll('a[href^="#"]').forEach(link => {

            link.addEventListener("click", event => {

                // Allow links explicitly excluded from smooth scroll
                if (link.hasAttribute("data-no-smooth")) {

                    return;

                }

                const targetID =
                    link.getAttribute("href");

                if (
                    !targetID ||
                    targetID === "#"
                ) {

                    return;

                }

                let targetElement;

                try {

                    targetElement =
                        document.getElementById(
                            decodeURIComponent(
                                targetID.slice(1)
                            )
                        );

                } catch (error) {

                    return;

                }

                if (!targetElement) return;

                event.preventDefault();

                Navigation.close();


                // Update URL without browser jump
                try {

                    if (window.location.hash !== targetID) {

                        history.pushState(
                            null,
                            "",
                            targetID
                        );

                    }

                } catch (error) {

                    console.warn(
                        "Unable to update navigation history.",
                        error
                    );

                }


                requestAnimationFrame(() => {

                    this.scrollTo(targetElement);

                });

            });

        });


        // Browser history navigation
        window.addEventListener(
            "popstate",
            this.handleHistory.bind(this)
        );


        // Cancel animation on manual scrolling
        window.addEventListener(
            "wheel",
            this.handleUserInteraction.bind(this),
            { passive: true }
        );

        window.addEventListener(
            "touchstart",
            this.handleUserInteraction.bind(this),
            { passive: true }
        );

        window.addEventListener(
            "keydown",
            this.handleUserInteraction.bind(this)
        );


        // Stop animation when viewport changes
        window.addEventListener(
            "resize",
            Utils.debounce(() => {

                if (this.isAnimating) {

                    this.stop();

                }

            }, 150),
            { passive: true }
        );

    }

};


/* =========================================================
   07. FAQ ACCORDION
========================================================= */

const FAQ = {

    /* -----------------------------------------
       Initialize FAQ
    ----------------------------------------- */

    init() {

        if (!DOM.faqItems.length) return;


        DOM.faqItems.forEach(item => {

            // Support native HTML details element
            if (item.tagName === "DETAILS") {

                item.addEventListener("toggle", () => {

                    if (!item.open) return;

                    DOM.faqItems.forEach(otherItem => {

                        if (
                            otherItem !== item &&
                            otherItem.tagName === "DETAILS" &&
                            otherItem.open
                        ) {

                            otherItem.open = false;

                        }

                    });

                });

            }

        });


        // Support custom button-based FAQ
        document.querySelectorAll(
            "[data-faq-toggle]"
        ).forEach(button => {

            button.addEventListener("click", () => {

                const currentItem =
                    button.closest(".faq-item");

                if (!currentItem) return;

                const isExpanded =
                    button.getAttribute("aria-expanded") === "true";


                // Close other FAQ items
                DOM.faqItems.forEach(item => {

                    if (
                        item === currentItem ||
                        item.tagName === "DETAILS"
                    ) {

                        return;

                    }

                    item.classList.remove("active");

                    const otherButton =
                        item.querySelector("[data-faq-toggle]");

                    otherButton?.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                });


                // Toggle current item
                currentItem.classList.toggle(
                    "active",
                    !isExpanded
                );

                button.setAttribute(
                    "aria-expanded",
                    String(!isExpanded)
                );

            });

        });

    }

};


/* =========================================================
   08. ACTIVE NAVIGATION
========================================================= */

const ActiveNavigation = {

    observer: null,


    /* -----------------------------------------
       Set active navigation link
    ----------------------------------------- */

    setActive(sectionID) {

        DOM.navigationItems.forEach(link => {

            const isActive =
                link.getAttribute("href") ===
                `#${sectionID}`;

            link.classList.toggle(
                "active-link",
                isActive
            );

            if (isActive) {

                link.setAttribute(
                    "aria-current",
                    "location"
                );

            } else {

                link.removeAttribute(
                    "aria-current"
                );

            }

        });

    },


    /* -----------------------------------------
       Fallback scroll detection
    ----------------------------------------- */

    fallback() {

        const scrollPosition =
            window.scrollY +
            Utils.getHeaderHeight() +
            100;

        let currentSection = "";

        DOM.sections.forEach(section => {

            if (scrollPosition >= section.offsetTop) {

                currentSection = section.id;

            }

        });

        if (currentSection) {

            this.setActive(currentSection);

        }

    },


    /* -----------------------------------------
       Initialize active navigation
    ----------------------------------------- */

    init() {

        if (!DOM.sections.length) return;


        // Fallback for browsers without IntersectionObserver
        if (!("IntersectionObserver" in window)) {

            window.addEventListener(
                "scroll",
                Utils.debounce(() => {

                    this.fallback();

                }, 80),
                { passive: true }
            );

            this.fallback();

            return;

        }


        this.observer = new IntersectionObserver(
            entries => {

                const visibleSections =
                    entries.filter(
                        entry => entry.isIntersecting
                    );

                if (!visibleSections.length) return;

                visibleSections.sort(
                    (a, b) =>
                        Math.abs(a.boundingClientRect.top) -
                        Math.abs(b.boundingClientRect.top)
                );

                this.setActive(
                    visibleSections[0].target.id
                );

            },
            {
                root: null,
                rootMargin: "-20% 0px -65% 0px",
                threshold: 0
            }
        );


        DOM.sections.forEach(section => {

            this.observer.observe(section);

        });


        this.fallback();

    }

};


/* =========================================================
   09. COPYRIGHT YEAR
========================================================= */

const Copyright = {

    init() {

        if (!DOM.year) return;

        DOM.year.textContent =
            new Date().getFullYear();

    }

};


/* =========================================================
   10. IMAGE ERROR HANDLING
========================================================= */

const ImageHandler = {

    /* -----------------------------------------
       Handle image error
    ----------------------------------------- */

    handleError(image) {

        if (!image) return;

        image.classList.add("image-error");

        image.setAttribute(
            "data-image-error",
            "true"
        );

        if (!image.alt) {

            image.alt = "Image unavailable";

        }

    },


    /* -----------------------------------------
       Initialize image handling
    ----------------------------------------- */

    init() {

        document.querySelectorAll("img").forEach(image => {

            image.addEventListener("error", () => {

                this.handleError(image);

            });


            // Detect images that already failed
            if (
                image.complete &&
                image.naturalWidth === 0
            ) {

                this.handleError(image);

            }

        });

    }

};


/* =========================================================
   11. BACKGROUND MUSIC
========================================================= */

const BackgroundMusic = {

    audio: DOM.backgroundMusic,

    button: DOM.musicToggle,

    icon: null,

    fallbackListenersAdded: false,

    startOnInteraction: null,


    /* -----------------------------------------
       Initialize background music
    ----------------------------------------- */

    init() {

        if (!this.audio) return;

        this.audio.volume = Math.min(
            Math.max(CONFIG.musicVolume, 0),
            1
        );

        this.icon =
            this.button?.querySelector(".music-icon");


        // Initial button state
        this.updateButton(!this.audio.paused);


        // Audio play event
        this.audio.addEventListener("play", () => {

            this.updateButton(true);

            this.removeAutoplayFallback();

        });


        // Audio pause event
        this.audio.addEventListener("pause", () => {

            this.updateButton(false);

        });


        // Audio ended event
        this.audio.addEventListener("ended", () => {

            this.updateButton(false);

        });


        // Audio error event
        this.audio.addEventListener("error", () => {

            console.error(
                "Background music failed to load. Check bali-background.mp3."
            );

            this.updateButton(false);

            this.removeAutoplayFallback();

        });


        // Music toggle button
        this.button?.addEventListener("click", async event => {

            event.stopPropagation();

            if (this.audio.paused) {

                await this.play();

            } else {

                this.pause();

            }

        });


        // Attempt autoplay
        this.play();


        // Fallback when autoplay is blocked
        this.handleAutoplayFallback();

    },


    /* -----------------------------------------
       Play music
    ----------------------------------------- */

    async play() {

        if (!this.audio) return false;

        try {

            await this.audio.play();

            this.updateButton(true);

            this.removeAutoplayFallback();

            return true;

        } catch (error) {

            this.updateButton(false);

            return false;

        }

    },


    /* -----------------------------------------
       Pause music
    ----------------------------------------- */

    pause() {

        if (!this.audio) return;

        this.audio.pause();

        this.updateButton(false);

    },


    /* -----------------------------------------
       Update music button
    ----------------------------------------- */

    updateButton(isPlaying) {

        if (!this.button) return;

        this.button.classList.toggle(
            "playing",
            isPlaying
        );

        if (this.icon) {

            this.icon.textContent =
                isPlaying ? "Ⅱ" : "♫";

        }

        this.button.setAttribute(
            "aria-label",
            isPlaying ? "Pause music" : "Play music"
        );

        this.button.setAttribute(
            "aria-pressed",
            String(isPlaying)
        );

        this.button.setAttribute(
            "title",
            isPlaying
                ? "Pause background music"
                : "Play background music"
        );

    },


    /* -----------------------------------------
       Autoplay fallback
    ----------------------------------------- */

    handleAutoplayFallback() {

        if (this.fallbackListenersAdded) return;

        this.fallbackListenersAdded = true;


        this.startOnInteraction = async event => {

            // Ignore music toggle button
            if (
                this.button &&
                this.button.contains(event.target)
            ) {

                return;

            }


            // Ignore unrelated keyboard keys
            if (
                event.type === "keydown" &&
                ![
                    "Enter",
                    " ",
                    "ArrowDown",
                    "ArrowUp",
                    "Tab"
                ].includes(event.key)
            ) {

                return;

            }


            // Stop fallback if music is already playing
            if (!this.audio || !this.audio.paused) {

                this.removeAutoplayFallback();

                return;

            }

            await this.play();

        };


        document.addEventListener(
            "pointerdown",
            this.startOnInteraction
        );

        document.addEventListener(
            "keydown",
            this.startOnInteraction
        );

    },


    /* -----------------------------------------
       Remove autoplay fallback listeners
    ----------------------------------------- */

    removeAutoplayFallback() {

        if (!this.fallbackListenersAdded) return;

        if (this.startOnInteraction) {

            document.removeEventListener(
                "pointerdown",
                this.startOnInteraction
            );

            document.removeEventListener(
                "keydown",
                this.startOnInteraction
            );

        }

        this.fallbackListenersAdded = false;

    }

};


/* =========================================================
   12. BOOKING FORM
   SEND BOOKING DETAILS TO WHATSAPP
========================================================= */

const BookingForm = {

    form: DOM.bookingForm,


    /* -----------------------------------------
       Display booking form status
    ----------------------------------------- */

    showStatus(message, type = "error") {

        const status = DOM.bookingStatus;

        if (!status) return;

        status.textContent = message;

        status.classList.remove(
            "success",
            "error"
        );

        status.classList.add(type);

        status.setAttribute(
            "role",
            "status"
        );

        status.setAttribute(
            "aria-live",
            "polite"
        );

    },


    /* -----------------------------------------
       Initialize booking form
    ----------------------------------------- */

    init() {

        if (!this.form) return;

        this.form.addEventListener("submit", event => {

            event.preventDefault();

            this.submit();

        });


        // Clear status when user edits the form
        this.form.addEventListener("input", () => {

            if (!DOM.bookingStatus) return;

            DOM.bookingStatus.textContent = "";

            DOM.bookingStatus.classList.remove(
                "success",
                "error"
            );

        });

    },


    /* -----------------------------------------
       Validate booking information
    ----------------------------------------- */

    validate(data) {

        // Required fields
        if (
            !data.name ||
            !data.date ||
            !data.guests ||
            !data.service
        ) {

            this.showStatus(
                "Please complete all required fields.",
                "error"
            );

            return false;

        }


        // Name validation
        if (
            data.name.length < CONFIG.minNameLength ||
            data.name.length > CONFIG.maxNameLength
        ) {

            this.showStatus(
                "Please enter a valid full name.",
                "error"
            );

            return false;

        }


        // Guest validation
        const guestCount = Number(data.guests);

        if (
            !Number.isInteger(guestCount) ||
            guestCount < 1 ||
            guestCount > CONFIG.maxGuests
        ) {

            this.showStatus(
                `Please enter a valid number of guests (1-${CONFIG.maxGuests}).`,
                "error"
            );

            return false;

        }


        // Date validation
        if (
            !Utils.isValidDate(data.date) ||
            data.date < Utils.getLocalDate()
        ) {

            this.showStatus(
                "Please select a valid travel date.",
                "error"
            );

            return false;

        }


        // Email validation
        if (
            data.email &&
            !Utils.isValidEmail(data.email)
        ) {

            this.showStatus(
                "Please enter a valid email address.",
                "error"
            );

            return false;

        }


        return true;

    },


    /* -----------------------------------------
       Collect booking data
    ----------------------------------------- */

    collectData() {

        return {

            name: Utils.getValue("bookingName"),

            email: Utils.getValue("bookingEmail"),

            date: Utils.getValue("bookingDate"),

            guests: Utils.getValue("bookingGuests"),

            service: Utils.getValue("bookingService"),

            pickup: Utils.getValue("bookingPickup"),

            message: Utils.getValue("bookingMessage")

        };

    },


    /* -----------------------------------------
       Create WhatsApp booking message
    ----------------------------------------- */

    createMessage(data) {

        const guestCount = Number(data.guests);

        return [

            "Hello Suka Di Bali!",

            "",

            "I would like to make a booking enquiry.",

            "",

            "================================",
            "          BOOKING DETAILS",
            "================================",

            "",

            `Full Name: ${data.name}`,

            `Email Address: ${data.email || "Not provided"}`,

            `Travel Date: ${Utils.formatDate(data.date)}`,

            `Number of Guests: ${guestCount}`,

            `Selected Tour / Service: ${data.service}`,

            `Hotel / Pickup Location: ${data.pickup || "Not provided"}`,

            "",

            "Additional Information:",

            data.message || "No additional information.",

            "",

            "================================",

            "Please share the price, availability and further booking details.",

            "",

            "Thank you!",

            "Suka Di Bali Customer"

        ].join("\n");

    },


    /* -----------------------------------------
       Submit booking
    ----------------------------------------- */

    submit() {

        if (!this.form) return;


        // Browser native validation
        if (!this.form.checkValidity()) {

            this.form.reportValidity();

            return;

        }


        // Collect booking data
        const data = this.collectData();


        // Custom validation
        if (!this.validate(data)) return;


        // Create WhatsApp message
        const whatsappMessage =
            this.createMessage(data);


        // Open WhatsApp
        const opened =
            WhatsApp.open(whatsappMessage);


        if (opened) {

            this.showStatus(
                "Your booking enquiry is ready. Please send the message in WhatsApp to complete your enquiry.",
                "success"
            );

        }

    }

};


/* =========================================================
   13. DESTINATION & TOUR SELECTION
   AUTOMATICALLY SELECT TOUR IN BOOKING FORM
========================================================= */

const TourSelection = {

    /* -----------------------------------------
       Find matching tour option
    ----------------------------------------- */

    findOption(select, selectedTour) {

        if (!select || !selectedTour) return null;

        const normalizedTour =
            Utils.normalizeText(selectedTour);

        return Array.from(select.options).find(option => {

            const value =
                Utils.normalizeText(option.value);

            const text =
                Utils.normalizeText(option.textContent);

            return (
                value === normalizedTour ||
                text === normalizedTour
            );

        }) || null;

    },


    /* -----------------------------------------
       Select tour
    ----------------------------------------- */

    selectTour(selectedTour) {

        if (!selectedTour) return false;

        const serviceSelect =
            DOM.bookingService;

        if (!serviceSelect) {

            console.warn(
                "Booking service field not found. Check #bookingService."
            );

            return false;

        }


        // Handle select element
        if (serviceSelect.tagName === "SELECT") {

            const matchingOption =
                this.findOption(
                    serviceSelect,
                    selectedTour
                );

            if (!matchingOption) {

                console.warn(
                    `Tour option not found: ${selectedTour}`
                );

                return false;

            }

            serviceSelect.value =
                matchingOption.value;

        } else if ("value" in serviceSelect) {

            // Handle input element
            serviceSelect.value = selectedTour;

        } else {

            return false;

        }


        // Notify other scripts
        Utils.dispatchFieldEvents(serviceSelect);

        return true;

    },


    /* -----------------------------------------
       Initialize destination and tour buttons
    ----------------------------------------- */

    init() {

        document.querySelectorAll("[data-tour]").forEach(link => {

            link.addEventListener("click", () => {

                const selectedTour =
                    link.dataset.tour;

                if (!selectedTour) return;

                this.selectTour(selectedTour);

            });

        });

    }

};


/* =========================================================
   14. BOOKING DATE VALIDATION
   PREVENT SELECTING PAST DATES
========================================================= */

const BookingDate = {

    /* -----------------------------------------
       Set minimum booking date
    ----------------------------------------- */

    init() {

        if (!DOM.bookingDate) return;

        const today = Utils.getLocalDate();

        DOM.bookingDate.setAttribute(
            "min",
            today
        );


        // Clear invalid existing date
        if (
            DOM.bookingDate.value &&
            (
                !Utils.isValidDate(DOM.bookingDate.value) ||
                DOM.bookingDate.value < today
            )
        ) {

            DOM.bookingDate.value = "";

        }


        // Recheck minimum date when user selects a date
        DOM.bookingDate.addEventListener("change", () => {

            const selectedDate =
                DOM.bookingDate.value;

            if (
                selectedDate &&
                (
                    !Utils.isValidDate(selectedDate) ||
                    selectedDate < Utils.getLocalDate()
                )
            ) {

                DOM.bookingDate.value = "";

                BookingForm.showStatus(
                    "Please select today or a future travel date.",
                    "error"
                );

            }

        });

    }

};


/* =========================================================
   15. WEBSITE INITIALIZATION
========================================================= */

let websiteInitialized = false;


function initializeWebsite() {

    // Prevent duplicate initialization
    if (websiteInitialized) return;

    websiteInitialized = true;


    // Enable JavaScript styling
    document.documentElement.classList.add(
        "js-enabled"
    );


    // Initialize website modules
    Navigation.init();

    WhatsApp.init();

    SmoothScroll.init();

    FAQ.init();

    ActiveNavigation.init();

    Copyright.init();

    ImageHandler.init();

    BackgroundMusic.init();

    BookingForm.init();

    TourSelection.init();

    BookingDate.init();


    // Mark website as loaded
    document.body.classList.add(
        "page-loaded"
    );


    console.info(
        "Suka Di Bali website initialized successfully."
    );

}


/* =========================================================
   16. DOM READY
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeWebsite,
        { once: true }
    );

} else {

    initializeWebsite();

}


/* =========================================================
   END OF SCRIPT
   SUKA DI BALI TOUR & TRANSPORT
========================================================= */