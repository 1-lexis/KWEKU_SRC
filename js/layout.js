/* ============================================================
   NAV + FOOTER INJECTOR
   Injects consistent navigation and footer into every page.
   ============================================================ */
(function () {
  const NAV_HTML = `
<div class="announcement-bar">
  🏆 Registrations Open for New Sports Programs — <a href="register.html">Join Now</a>
</div>
<nav class="navbar" role="navigation" aria-label="Main navigation">
  <div class="container">
    <div class="nav-inner">
      <a href="../index.html" class="nav-logo" aria-label="SRC Sports Academy Home">SRC <span>SPORTS</span></a>
      <div class="nav-links" role="list">
        <a href="../index.html" role="listitem">Home</a>
        <a href="about.html" role="listitem">About</a>
        <a href="new-activities.html" role="listitem">New Sports</a>
        <a href="events.html" role="listitem">Events</a>
        <a href="blog.html" role="listitem">Blog</a>
        <a href="contact.html" role="listitem">Contact</a>
      </div>
      <div class="nav-actions">
        <div class="search-wrap" role="search">
          <span class="search-icon" aria-hidden="true">🔍</span>
          <input type="search" id="search-input" placeholder="Search..." aria-label="Search the website" autocomplete="off"/>
          <div id="search-results-dropdown" class="hidden" role="listbox" aria-label="Search results"></div>
        </div>
        <a href="register.html" class="btn btn-outline" style="padding:0.5rem 1rem;font-size:0.82rem;">Register</a>
        <a href="book.html" class="btn btn-primary" style="padding:0.5rem 1rem;font-size:0.82rem;">Book Now</a>
        <button class="hamburger" id="hamburger-btn" aria-label="Toggle mobile menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="mobile-nav" id="mobile-nav" role="list">
      <a href="../index.html" role="listitem">Home</a>
      <a href="about.html" role="listitem">About</a>
      <a href="new-activities.html" role="listitem">New Sports</a>
      <a href="events.html" role="listitem">Events</a>
      <a href="blog.html" role="listitem">Blog</a>
      <a href="contact.html" role="listitem">Contact</a>
      <a href="register.html" role="listitem" style="color:var(--clr-gold)">Register</a>
      <a href="book.html" role="listitem" style="color:var(--clr-accent)">📅 Book a Session</a>
    </div>
  </div>
</nav>`;

  const FOOTER_HTML = `
<footer role="contentinfo">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="../index.html" class="nav-logo">SRC <span>SPORTS</span></a>
        <p>Empowering students and community through sport, discipline, and excellence. Pentecost University's premier sports institution.</p>
        <div class="social-links" aria-label="Social media links">
          <a href="#" aria-label="Facebook">📘</a>
          <a href="#" aria-label="Twitter / X">🐦</a>
          <a href="#" aria-label="Instagram">📸</a>
          <a href="#" aria-label="YouTube">▶️</a>
          <a href="#" aria-label="WhatsApp">💬</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <a href="../index.html">Home</a>
        <a href="about.html">About Us</a>
        <a href="new-activities.html">New Sports</a>
        <a href="events.html">Events</a>
      </div>
      <div class="footer-col">
        <h4>Get Involved</h4>
        <a href="register.html">Register</a>
        <a href="book.html">Book a Session</a>
        <a href="blog.html">Blog</a>
        <a href="contact.html">Contact Us</a>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <a href="mailto:sports@pentvars.edu.gh">sports@pentvars.edu.gh</a>
        <a href="tel:+233000000000">+233 00 000 0000</a>
        <a href="#">Pentecost University, Accra</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 SRC Sports Academy, Pentecost University. All rights reserved.</p>
      <div class="visitor-counter" aria-live="polite">
        👁️ Total visits: <span id="visit-count">—</span>
      </div>
    </div>
  </div>
</footer>
<button id="scroll-top" aria-label="Scroll to top">↑</button>`;

  document.addEventListener("DOMContentLoaded", function () {
    const navTarget = document.getElementById("nav-placeholder");
    if (navTarget) navTarget.outerHTML = NAV_HTML;

    const footTarget = document.getElementById("footer-placeholder");
    if (footTarget) footTarget.outerHTML = FOOTER_HTML;
  });
})();
