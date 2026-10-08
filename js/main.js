// Reveal-on-scroll
(function(){
  var els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(el){ obs.observe(el); });
})();

// Pause SMIL trace animations if reduced motion is preferred
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var svgs = document.querySelectorAll('.hero-trace');
    svgs.forEach(function(svg){
      if(svg.pauseAnimations) svg.pauseAnimations();
    });
  }
})();

// Mobile Menu Toggle
(function(){
  var toggle = document.getElementById('mobile-menu');
  var nav = document.querySelector('.nav-links');
  if(!toggle || !nav) return;

  function setOpen(open){
    nav.classList.toggle('active', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function(){
    setOpen(!nav.classList.contains('active'));
  });

  // Close when a link is tapped
  nav.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){ setOpen(false); });
  });

  // Close on Escape or when tapping outside the header
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', function(e){
    if(!e.target.closest('.site-header')) setOpen(false);
  });

  // Reset if the window is resized to desktop width
  window.addEventListener('resize', function(){
    if(window.innerWidth >= 820) setOpen(false);
  });
})();

// Live open/closed status (India time, Mon-Sat 10:00-18:00, Sunday closed)
(function(){
  var els = document.querySelectorAll('[data-open-status]');
  if(!els.length) return;
  try{
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date());
    var get = function(type){
      for(var i = 0; i < parts.length; i++){ if(parts[i].type === type) return parts[i].value; }
      return '';
    };
    var day = get('weekday');
    var mins = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
    var OPEN = 10 * 60, CLOSE = 18 * 60;
    var text, isOpen = false;
    if(day === 'Sun'){
      text = 'Closed today · Opens Monday 10:00 AM';
    } else if(mins < OPEN){
      text = 'Opens today at 10:00 AM';
    } else if(mins < CLOSE){
      text = 'Open now · Closes 6:00 PM';
      isOpen = true;
    } else {
      text = 'Closed now · Opens ' + (day === 'Sat' ? 'Monday' : 'tomorrow') + ' 10:00 AM';
    }
    els.forEach(function(el){ el.textContent = text; });
    var card = document.querySelector('[data-open-card]');
    if(card) card.setAttribute('data-state', isOpen ? 'open' : 'closed');
  } catch(e){ /* keep the default text */ }
})();

// Track calls, WhatsApp, directions and review clicks (only runs once Google Analytics is added)
document.addEventListener('click', function(e){
  if(typeof window.gtag !== 'function') return;
  var a = e.target.closest ? e.target.closest('a[href]') : null;
  if(!a) return;
  var href = a.getAttribute('href') || '', method = null;
  if(href.indexOf('tel:') === 0) method = 'call';
  else if(href.indexOf('wa.me') > -1) method = 'whatsapp';
  else if(href.indexOf('google.com/maps') > -1) method = 'directions';
  else if(href.indexOf('share.google') > -1) method = 'review';
  if(method) window.gtag('event', 'contact_click', { contact_method: method, link_url: href });
});


// Header shadow after scrolling
(function(){
  var header = document.querySelector('.site-header');
  if(!header) return;
  function update(){ header.classList.toggle('is-scrolled', window.scrollY > 8); }
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

// Highlight the nav link for the section currently on screen
(function(){
  if(!('IntersectionObserver' in window)) return;
  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  var map = {};
  links.forEach(function(a){ map[a.getAttribute('href').slice(1)] = a; });
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      links.forEach(function(a){ a.classList.remove('is-active'); });
      var active = map[entry.target.id];
      if(active) active.classList.add('is-active');
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  Object.keys(map).forEach(function(id){
    var section = document.getElementById(id);
    if(section) obs.observe(section);
  });
})();