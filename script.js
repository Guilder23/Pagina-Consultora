// Elementos del DOM
const menuToggle = document.getElementById("menuToggle");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("mobileSidebar");
const overlay = document.getElementById("sidebarOverlay");
const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
const contactBtn = document.getElementById("contactBtn");
const desktopNavLinks = document.querySelectorAll(".desktop-nav a");
const faqAccordion = document.getElementById("faqAccordion");
const casosTrack = document.getElementById("casosTrack");
const casosPrev = document.querySelector(".casos-prev");
const casosNext = document.querySelector(".casos-next");

const casosCarouselState = {
    originalCount: 0,
    cloneCount: 0,
    step: 0,
    index: 0,
    isMoving: false,
    resizeTimer: null,
};

// Funciones de menú móvil
function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    menuToggle.setAttribute("aria-expanded", "true");
    sidebar.setAttribute("aria-hidden", "false");
}

function closeSidebarMenu() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "auto";
    menuToggle.setAttribute("aria-expanded", "false");
    sidebar.setAttribute("aria-hidden", "true");
}

// Event Listeners - Menú
menuToggle.addEventListener("click", openSidebar);
closeSidebar.addEventListener("click", closeSidebarMenu);
overlay.addEventListener("click", closeSidebarMenu);

sidebarLinks.forEach((link) => {
    link.addEventListener("click", closeSidebarMenu);
});

// Cerrar menú con Escape
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeSidebarMenu();
    }
});

// Actualizar enlace activo en navegación
function updateActiveNav() {
    const sections = document.querySelectorAll("main section");
    const navLinks = [...desktopNavLinks, ...document.querySelectorAll(".sidebar-nav a")];
    
    let current = "";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", updateActiveNav);

// Animación de entrada para elementos
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll(".service-card, .caso-card, .team-card, .testimonial-card").forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(el);
    });
}

animateOnScroll();

// Botones de contacto
contactBtn.addEventListener("click", () => {
    document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
});

// Botones en el hero
const heroBtns = document.querySelectorAll(".hero-actions .btn");
heroBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (btn.classList.contains("btn-outline")) {
            document.getElementById("servicios").scrollIntoView({ behavior: "smooth" });
        } else {
            document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
        }
    });
});

// Botón CTA
const ctaBtn = document.querySelector(".cta .btn");
if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
        document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
    });
}

// Efecto de scroll suave en enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// FAQ tipo acordeón: solo una respuesta abierta a la vez
if (faqAccordion) {
    const faqItems = [...faqAccordion.querySelectorAll('.faq-item')];

    const closeItem = (item) => {
        const button = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        item.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');
        answer.hidden = true;
    };

    const openItem = (item) => {
        const button = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
    };

    faqItems.forEach((item) => {
        const button = item.querySelector('.faq-question');

        button.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            faqItems.forEach(closeItem);

            if (!isOpen) {
                openItem(item);
            }
        });
    });
}

if (casosTrack && casosPrev && casosNext) {
    const getVisibleCardsCount = () => (window.matchMedia("(max-width: 768px)").matches ? 1 : 3);

    const getOriginalCards = () => Array.from(casosTrack.querySelectorAll(".caso-card")).filter((card) => card.dataset.caseClone !== "true");

    const measureStep = () => {
        const firstCard = casosTrack.querySelector(".caso-card");
        if (!firstCard) {
            return 0;
        }

        const cardWidth = firstCard.getBoundingClientRect().width;
        const trackStyles = window.getComputedStyle(casosTrack);
        const gap = parseFloat(trackStyles.gap || "0") || 0;

        return cardWidth + gap;
    };

    const applyTransform = (animate = true) => {
        casosTrack.style.transition = animate ? "transform 0.28s ease" : "none";
        casosTrack.style.transform = `translate3d(${-casosCarouselState.index * casosCarouselState.step}px, 0, 0)`;
    };

    const refreshCasesNav = () => {
        casosPrev.disabled = false;
        casosNext.disabled = false;
    };

    const rebuildCasesCarousel = () => {
        const originals = getOriginalCards();

        casosTrack.querySelectorAll('[data-case-clone="true"]').forEach((card) => card.remove());

        if (!originals.length) {
            return;
        }

        casosCarouselState.originalCount = originals.length;
        casosCarouselState.cloneCount = Math.min(getVisibleCardsCount(), originals.length);

        const firstOriginal = originals[0];
        const prependClones = originals.slice(-casosCarouselState.cloneCount).map((card) => {
            const clone = card.cloneNode(true);
            clone.dataset.caseClone = "true";
            clone.setAttribute("aria-hidden", "true");
            clone.style.opacity = "1";
            clone.style.transform = "none";
            clone.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            return clone;
        });

        const appendClones = originals.slice(0, casosCarouselState.cloneCount).map((card) => {
            const clone = card.cloneNode(true);
            clone.dataset.caseClone = "true";
            clone.setAttribute("aria-hidden", "true");
            clone.style.opacity = "1";
            clone.style.transform = "none";
            clone.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            return clone;
        });

        prependClones.reverse().forEach((clone) => {
            casosTrack.insertBefore(clone, firstOriginal);
        });

        appendClones.forEach((clone) => {
            casosTrack.appendChild(clone);
        });

        casosCarouselState.step = measureStep();
        casosCarouselState.index = casosCarouselState.cloneCount;
        applyTransform(false);
        refreshCasesNav();
    };

    const normalizeCasesCarousel = () => {
        const minIndex = casosCarouselState.cloneCount;
        const maxIndex = casosCarouselState.cloneCount + casosCarouselState.originalCount - 1;

        if (casosCarouselState.index > maxIndex) {
            casosCarouselState.index = minIndex;
            applyTransform(false);
        } else if (casosCarouselState.index < minIndex) {
            casosCarouselState.index = maxIndex;
            applyTransform(false);
        }

        casosCarouselState.isMoving = false;
    };

    const moveCasesCarousel = (direction) => {
        if (casosCarouselState.isMoving || !casosCarouselState.step) {
            return;
        }

        casosCarouselState.isMoving = true;
        casosCarouselState.index += direction;
        applyTransform(true);

        window.setTimeout(normalizeCasesCarousel, 300);
    };

    window.scrollCases = (direction) => {
        moveCasesCarousel(direction);
    };

    casosPrev.addEventListener("click", () => {
        moveCasesCarousel(-1);
    });

    casosNext.addEventListener("click", () => {
        moveCasesCarousel(1);
    });

    rebuildCasesCarousel();

    window.addEventListener("resize", () => {
        window.clearTimeout(casosCarouselState.resizeTimer);
        casosCarouselState.resizeTimer = window.setTimeout(() => {
            rebuildCasesCarousel();
        }, 120);
    });
}

// Inicialización
console.log("Consultora Empresarial - Sitio Web Cargado");
