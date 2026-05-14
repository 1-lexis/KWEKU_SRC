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
    const el = document.getElementById("visit-count");
    if (!el) return;

    try {
      let count = parseInt(localStorage.getItem(key) || "0", 10);
      count++;
      localStorage.setItem(key, String(count));
      el.textContent = count.toLocaleString();
    } catch (err) {
      el.textContent = "1";
    }
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
    const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    links.forEach(function (a) {
      const href = (a.getAttribute("href") || "").split("#")[0].split("?")[0];
      const target = (href.split("/").pop() || "index.html").toLowerCase();
      if (target === current) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  /* ── HAMBURGER ── */
  function initHamburger() {
    const btn = document.getElementById("hamburger-btn") || document.getElementById("hamburger");
    const mobileNav = document.getElementById("mobile-nav");
    if (!btn || !mobileNav) return;

    function setOpen(isOpen) {
      btn.classList.toggle("open", isOpen);
      mobileNav.classList.toggle("open", isOpen);
      btn.setAttribute("aria-expanded", String(isOpen));
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!mobileNav.classList.contains("open"));
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });

    document.addEventListener("click", function (e) {
      if (!mobileNav.contains(e.target) && !btn.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ── SEARCH ── */
  const PAGES = [
    { title: "Home",           page: "index.html",          keywords: ["home", "welcome", "academy", "sports"] },
    { title: "About Us",       page: "about.html",          keywords: ["about", "mission", "vision", "values", "history"] },
    { title: "New Activities", page: "new-activities.html", keywords: ["wrestling", "taekwondo", "judo", "volleyball", "new", "martial arts"] },
    { title: "Events",         page: "events.html",         keywords: ["events", "schedule", "fixtures", "competition", "upcoming"] },
    { title: "Blog",           page: "blog.html",           keywords: ["blog", "news", "updates", "posts", "articles"] },
    { title: "Register",       page: "register.html",       keywords: ["register", "sign up", "join", "subscription", "membership"] },
    { title: "Book Online",    page: "book.html",           keywords: ["book", "booking", "session", "training", "reserve"] },
    { title: "Contact",        page: "contact.html",        keywords: ["contact", "email", "phone", "location", "address"] },
  ];

  function pageHref(page) {
    const path = location.pathname.replace(/\\/g, "/").toLowerCase();
    const inPages = path.includes("/pages/");
    if (page === "index.html") return inPages ? "../index.html" : "index.html";
    return inPages ? page : "pages/" + page;
  }

  function initSearch() {
    const input    = document.getElementById("search-input");
    const dropdown = document.getElementById("search-results-dropdown") || document.getElementById("search-results");
    if (!input || !dropdown) return;

    function hideResults() {
      dropdown.classList.add("hidden");
      dropdown.classList.remove("visible");
      dropdown.innerHTML = "";
    }

    function showResults() {
      dropdown.classList.remove("hidden");
      dropdown.classList.add("visible");
    }

    input.addEventListener("input", function () {
      const q = input.value.trim().toLowerCase();
      hideResults();
      if (q.length < 1) return;

      const results = PAGES.filter(function (p) {
        return p.title.toLowerCase().includes(q) ||
               p.keywords.some(function (k) { return k.includes(q); });
      });

      if (results.length === 0) {
        dropdown.innerHTML = '<span class="search-result-item" aria-disabled="true">No results found</span>';
        showResults();
        return;
      }

      results.forEach(function (r) {
        const a = document.createElement("a");
        a.href = pageHref(r.page);
        a.className = "search-result-item";
        a.setAttribute("role", "option");
        a.textContent = r.title;
        dropdown.appendChild(a);
      });
      showResults();
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hideResults();
    });

    document.addEventListener("click", function (e) {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        hideResults();
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
    if (input.disabled || input.type === "button" || input.type === "submit") return true;

    if (input.type === "checkbox") {
      const validCheck = !input.required || input.checked;
      input.classList.toggle("error", !validCheck);
      return validCheck;
    }

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

        const password = form.querySelector('input[name="password"]');
        const confirm = form.querySelector('input[name="confirm"]');
        if (password && confirm && password.value !== confirm.value) {
          confirm.classList.add("error");
          allValid = false;
        }

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
      newsletter: "Subscription confirmed. Welcome to the academy updates list.",
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
          const openBtn = i.querySelector(".accordion-header");
          if (openBtn) openBtn.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        } else {
          btn.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  /* ── TABS ── */
  function initTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    document.querySelectorAll(".tab-pane").forEach(function (pane) {
      if (!pane.classList.contains("active")) pane.setAttribute("hidden", "");
    });

    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const group = btn.dataset.tabGroup || "default";
        const target = btn.dataset.tab;

        document.querySelectorAll('[data-tab-group="' + group + '"].tab-btn').forEach(function (b) {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        document.querySelectorAll('[data-tab-content="' + group + '"].tab-pane').forEach(function (p) {
          p.classList.remove("active");
          p.setAttribute("hidden", "");
        });

        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        const pane = document.getElementById(target);
        if (pane) {
          pane.classList.add("active");
          pane.removeAttribute("hidden");
        }
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

  function initCheckboxCards() {
    document.querySelectorAll(".sport-check-item input").forEach(function (input) {
      const label = input.closest(".sport-check-item");
      if (!label) return;
      function sync() {
        label.classList.toggle("sport-selected", input.checked);
      }
      input.addEventListener("change", sync);
      sync();
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
    initCheckboxCards();
    initJQuerySearch();
  });
})();
