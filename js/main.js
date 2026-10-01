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
