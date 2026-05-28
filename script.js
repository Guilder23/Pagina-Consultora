// Elementos del DOM
const menuToggle = document.getElementById("menuToggle");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("mobileSidebar");
const overlay = document.getElementById("sidebarOverlay");
const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
const contactBtn = document.getElementById("contactBtn");
const desktopNavLinks = document.querySelectorAll(".desktop-nav a");
const faqAccordion = document.getElementById("faqAccordion");

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

// Inicialización
console.log("Consultora Empresarial - Sitio Web Cargado");
