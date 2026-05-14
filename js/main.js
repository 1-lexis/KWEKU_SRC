/* ============================================================
   SRC SPORTS ACADEMY — MAIN JAVASCRIPT
   Handles: Navbar, Search, Hamburger, Captcha, Forms,
            Visitor Counter, Accordion, Tabs, Scroll-to-Top
   ============================================================ */

/* ── jQuery CDN check wrapper ── */
(function () {
  "use strict";

  /* ── VISITOR COUNTER ── */
  function initVisitorCounter() {
    const key = "srcsa_visits";
    let count = parseInt(localStorage.getItem(key) || "0", 10);
    count++;
    localStorage.setItem(key, count);
    const el = document.getElementById("visit-count");
    if (el) el.textContent = count.toLocaleString();
  }

  /* ── NAVBAR SCROLL ── */
  function initNavbar() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;
    window.addEventListener("scroll", function () {
      if (window.scrollY > 40) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    });

    /* active link */
    const links = document.querySelectorAll(".nav-links a, .mobile-nav a");
    const current = location.pathname.split("/").pop() || "index.html";
    links.forEach(function (a) {
      if (a.getAttribute("href") === current) a.classList.add("active");
    });
  }

  /* ── HAMBURGER ── */
  function initHamburger() {
    const btn = document.getElementById("hamburger-btn");
    const mobileNav = document.getElementById("mobile-nav");
    if (!btn || !mobileNav) return;
    btn.addEventListener("click", function () {
      btn.classList.toggle("open");
      mobileNav.classList.toggle("open");
    });
  }

  /* ── SEARCH ── */
  const PAGES = [
    { title: "Home",          url: "index.html",        keywords: ["home", "welcome", "academy", "sports"] },
    { title: "About Us",      url: "about.html",        keywords: ["about", "mission", "vision", "values", "history"] },
    { title: "New Activities",url: "new-activities.html",keywords: ["wrestling", "taekwondo", "judo", "volleyball", "new", "martial arts"] },
    { title: "Events",        url: "events.html",       keywords: ["events", "schedule", "fixtures", "competition", "upcoming"] },
    { title: "Blog",          url: "blog.html",         keywords: ["blog", "news", "updates", "posts", "articles"] },
    { title: "Register",      url: "register.html",     keywords: ["register", "sign up", "join", "subscription", "membership"] },
    { title: "Book Online",   url: "book.html",         keywords: ["book", "booking", "session", "training", "reserve"] },
    { title: "Contact",       url: "contact.html",      keywords: ["contact", "email", "phone", "location", "address"] },
  ];

  function initSearch() {
    const input    = document.getElementById("search-input");
    const dropdown = document.getElementById("search-results-dropdown");
    if (!input || !dropdown) return;

    input.addEventListener("input", function () {
      const q = input.value.trim().toLowerCase();
      dropdown.classList.add("hidden");
      dropdown.innerHTML = "";
      if (q.length < 1) return;

      const results = PAGES.filter(function (p) {
        return p.title.toLowerCase().includes(q) ||
               p.keywords.some(function (k) { return k.includes(q); });
      });

      if (results.length === 0) {
        dropdown.innerHTML = '<span style="padding:0.5rem 0.75rem;font-size:0.85rem;color:var(--clr-muted);display:block;">No results found</span>';
        dropdown.classList.remove("hidden");
        return;
      }

      results.forEach(function (r) {
        const a = document.createElement("a");
        a.href = r.url;
        a.innerHTML = "🔗 " + r.title;
        dropdown.appendChild(a);
      });
      dropdown.classList.remove("hidden");
    });

    document.addEventListener("click", function (e) {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add("hidden");
      }
    });
  }

  /* ── CAPTCHA ── */
  function generateCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  function initCaptcha() {
    const challenges = document.querySelectorAll(".captcha-challenge");
    challenges.forEach(function (el) {
      el.dataset.code = generateCaptcha();
      el.textContent = el.dataset.code;
    });
    const refreshBtns = document.querySelectorAll(".captcha-refresh");
    refreshBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const challenge = btn.closest(".captcha-box").querySelector(".captcha-challenge");
        if (challenge) {
          challenge.dataset.code = generateCaptcha();
          challenge.textContent = challenge.dataset.code;
          const inp = btn.closest(".captcha-box").querySelector("input");
          if (inp) inp.value = "";
        }
      });
    });
  }

  function validateCaptcha(formEl) {
    const box = formEl.querySelector(".captcha-box");
    if (!box) return true;
    const challenge = box.querySelector(".captcha-challenge");
    const input     = box.querySelector("input");
    if (!challenge || !input) return true;
    return input.value.toUpperCase().trim() === challenge.dataset.code;
  }

  /* ── FORM VALIDATION ── */
  function validateField(input) {
    const val = input.value.trim();
    let valid = true;

    if (input.required && val === "") valid = false;
    if (input.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) valid = false;
    if (input.type === "tel" && val && !/^[\d\s\+\-\(\)]{7,15}$/.test(val)) valid = false;
    if (input.minLength && val.length < input.minLength && val !== "") valid = false;

    if (valid) {
      input.classList.remove("error");
    } else {
      input.classList.add("error");
    }
    return valid;
  }

  function initForms() {
    const forms = document.querySelectorAll("form[data-validate]");
    forms.forEach(function (form) {
      const inputs = form.querySelectorAll("input, select, textarea");
      inputs.forEach(function (inp) {
        inp.addEventListener("blur", function () { validateField(inp); });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        let allValid = true;
        inputs.forEach(function (inp) {
          if (!validateField(inp)) allValid = false;
        });

        if (!validateCaptcha(form)) {
          allValid = false;
          const captchaInp = form.querySelector(".captcha-box input");
          if (captchaInp) captchaInp.classList.add("error");
          showAlert(form, "error", "Incorrect CAPTCHA. Please try again.");
          initCaptcha();
          return;
        }

        if (!allValid) {
          showAlert(form, "error", "Please fill in all required fields correctly.");
          return;
        }

        showAlert(form, "success", getSuccessMessage(form));
        form.reset();
        initCaptcha();
      });
    });
  }

  function getSuccessMessage(form) {
    const type = form.dataset.formType || "generic";
    const msgs = {
      register: "Registration successful! Check your email for confirmation.",
      book:     "Booking request sent! We will confirm via email within 24 hours.",
      contact:  "Message sent! We will get back to you shortly.",
      generic:  "Submitted successfully!"
    };
    return msgs[type] || msgs.generic;
  }

  function showAlert(form, type, msg) {
    const existing = form.querySelector(".alert");
    if (existing) existing.remove();
    const div = document.createElement("div");
    div.className = "alert alert-" + type;
    div.innerHTML = (type === "success" ? "✅ " : "❌ ") + msg;
    form.insertBefore(div, form.firstChild);
    setTimeout(function () { if (div.parentNode) div.remove(); }, 6000);
  }

  /* ── ACCORDION ── */
  function initAccordion() {
    const headers = document.querySelectorAll(".accordion-header");
    headers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const item = btn.closest(".accordion-item");
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".accordion-item.open").forEach(function (i) {
          i.classList.remove("open");
        });
        if (!isOpen) item.classList.add("open");
      });
    });
  }

  /* ── TABS ── */
  function initTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const group = btn.dataset.tabGroup || "default";
        const target = btn.dataset.tab;

        document.querySelectorAll('[data-tab-group="' + group + '"].tab-btn').forEach(function (b) {
          b.classList.remove("active");
        });
        document.querySelectorAll('[data-tab-content="' + group + '"].tab-pane').forEach(function (p) {
          p.classList.remove("active");
        });

        btn.classList.add("active");
        const pane = document.getElementById(target);
        if (pane) pane.classList.add("active");
      });
    });
  }

  /* ── SCROLL TO TOP ── */
  function initScrollTop() {
    const btn = document.getElementById("scroll-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) btn.classList.add("visible");
      else btn.classList.remove("visible");
    });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ── JQUERY ON-PAGE SEARCH ── */
  function initJQuerySearch() {
    if (typeof $ === "undefined") return;

    /* Blog / card filter */
    const filterInput = $("#content-filter");
    if (filterInput.length) {
      filterInput.on("input", function () {
        const q = $(this).val().toLowerCase();
        $(".filterable-card").each(function () {
          const text = $(this).text().toLowerCase();
          $(this).closest(".card, .event-item, .blog-card").toggle(text.includes(q));
        });
      });
    }
  }

  /* ── INIT ALL ── */
  document.addEventListener("DOMContentLoaded", function () {
    initVisitorCounter();
    initNavbar();
    initHamburger();
    initSearch();
    initCaptcha();
    initForms();
    initAccordion();
    initTabs();
    initScrollTop();
    initJQuerySearch();
  });
})();
