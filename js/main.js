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