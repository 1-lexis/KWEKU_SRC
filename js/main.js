$(document).ready(function () {

  /* ── 1. NAVBAR: scroll class for background change ──────── */
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 60) {
      $('.navbar').addClass('scrolled');
    } else {
      $('.navbar').removeClass('scrolled');
    }
  });

  /* ── 2. HAMBURGER MENU ──────────────────────────────────── */
  $('#hamburger').on('click', function () {
    $(this).toggleClass('open');
    $('#mobile-nav').toggleClass('open');
    const expanded = $(this).hasClass('open');
    $(this).attr('aria-expanded', expanded);
  });

  // Close mobile nav when a link is clicked
  $('#mobile-nav a').on('click', function () {
    $('#hamburger').removeClass('open').attr('aria-expanded', false);
    $('#mobile-nav').removeClass('open');
  });

  /* ── 3. SEARCH FUNCTIONALITY (jQuery) ───────────────────── */
  const pages = [
    { name: 'Home',            url: 'index.html',          keywords: ['home', 'welcome', 'hero', 'academy'] },
    { name: 'About',           url: 'about.html',          keywords: ['about', 'mission', 'vision', 'values', 'history'] },
    { name: 'Sports Programs', url: 'new-activities.html', keywords: ['wrestling', 'taekwondo', 'judo', 'volleyball', 'football', 'rugby', 'gymnastics', 'sports', 'new', 'activities'] },
    { name: 'Register',        url: 'register.html',       keywords: ['register', 'sign up', 'join', 'membership', 'subscribe'] },
    { name: 'Book Online',     url: 'book.html',           keywords: ['book', 'booking', 'session', 'schedule', 'reserve'] },
    { name: 'Events',          url: 'events.html',         keywords: ['events', 'fixtures', 'competition', 'schedule', 'match'] },
    { name: 'Blog',            url: 'blog.html',           keywords: ['blog', 'news', 'updates', 'posts', 'community'] },
  ];

  function doSearch(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      $('#search-results').removeClass('visible').empty();
      return;
    }
    const results = pages.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.keywords.some(k => k.includes(q))
    );
    const $box = $('#search-results');
    $box.empty();
    if (results.length === 0) {
      $box.append('<p>No results found for "<strong>' + $('<span>').text(q).html() + '</strong>"</p>');
    } else {
      results.forEach(r => {
        $box.append('<p><a href="' + r.url + '"><strong>' + r.name + '</strong></a></p>');
      });
    }
    $box.addClass('visible');
  }

  $('#search-input').on('input', function () {
    doSearch($(this).val());
  });

  $('#search-btn').on('click', function () {
    doSearch($('#search-input').val());
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.nav-search, #search-results').length) {
      $('#search-results').removeClass('visible');
    }
  });

  /* ── 4. VISITOR COUNTER ─────────────────────────────────── */
  let visits = parseInt(localStorage.getItem('srcVisits') || '0') + 1;
  localStorage.setItem('srcVisits', visits);
  $('#visit-count').text(visits.toLocaleString());

  /* ── 5. CAPTCHA CHECKBOX ────────────────────────────────── */
  $('#captcha-check').on('change', function () {
    if ($(this).is(':checked')) {
      $('#captcha-label').text('✓ Verified – You are human');
      $('#subscribe-btn').prop('disabled', false);
    } else {
      $('#captcha-label').text('I am not a robot');
      $('#subscribe-btn').prop('disabled', true);
    }
  });

  $('#subscribe-btn').prop('disabled', true);

  /* ── 6. SUBSCRIBE FORM (simulated) ──────────────────────── */
  $('#subscribe-form').on('submit', function (e) {
    e.preventDefault();
    const email = $('#subscribe-email').val().trim();
    if (email) {
      $('#subscribe-form').html(
        '<p style="color:var(--gold);font-weight:700;letter-spacing:1px;">🏆 You\'re subscribed! Welcome to SRC Sports Academy.</p>'
      );
    }
  });

  /* ── 7. SMOOTH SCROLL for anchor links ──────────────────── */
  $('a[href^="#"]').on('click', function (e) {
    const target = $($(this).attr('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: target.offset().top - 80 }, 600);
    }
  });

});
