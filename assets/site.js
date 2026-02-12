
(function(){
  function qs(sel, ctx){return (ctx||document).querySelector(sel);}
  function qsa(sel, ctx){return Array.from((ctx||document).querySelectorAll(sel));}

  // Cookie banner (same behavior as home)
  window.acceptCookies = function(){
    var b = qs('#cookie-banner');
    if(b) b.classList.remove('show');
    try{ localStorage.setItem('cookiesAccepted','true'); }catch(e){}
  };
  window.addEventListener('load', function(){
    try{
      if(!localStorage.getItem('cookiesAccepted')){
        setTimeout(function(){
          var b = qs('#cookie-banner');
          if(b) b.classList.add('show');
        }, 800);
      }
    }catch(e){}
  });

  // YouTube privacy loader used in Semana Santa
  window.loadYouTube = function(videoId, containerId){
    var container = document.getElementById(containerId);
    if(!container) return;
    var iframe = document.createElement('iframe');
    iframe.style.width="100%";
    iframe.style.height="100%";
    iframe.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(videoId)+"?autoplay=1";
    iframe.title="YouTube video player";
    iframe.frameBorder="0";
    iframe.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen=true;
    container.innerHTML="";
    container.appendChild(iframe);
  };

  // Cofradías: accordion "one open" + active card highlight if present
  function setupCofradias(){
    var acc = qs('.cofradia-accordion');
    if(!acc) return;
    var details = qsa('details', acc);

    function closeOthers(openEl){
      details.forEach(function(d){ if(d!==openEl) d.open=false; });
    }

    details.forEach(function(d){
      d.addEventListener('toggle', function(){
        if(d.open) closeOthers(d);
      });
    });

    // Grid -> open accordion if exists
    var gridCards = qsa('.grid .card[data-cof]');
    function setActive(slug){
      gridCards.forEach(function(c){ c.classList.toggle('is-active', c.dataset.cof===slug); });
    }
    window.openCofradia = function(slug){
      var el = document.getElementById('cof-'+slug);
      if(!el) return;
      el.open = true;
      closeOthers(el);
      setActive(slug);
      el.scrollIntoView({behavior:'smooth', block:'start'});
      el.style.outline='2px solid var(--purple)';
      el.style.outlineOffset='4px';
      setTimeout(function(){ el.style.outline=''; el.style.outlineOffset=''; }, 1200);
    };
    gridCards.forEach(function(card){
      card.setAttribute('role','button');
      card.setAttribute('tabindex','0');
      card.addEventListener('click', function(){ window.openCofradia(card.dataset.cof); });
      card.addEventListener('keydown', function(e){
        if(e.key==='Enter' || e.key===' '){
          e.preventDefault(); window.openCofradia(card.dataset.cof);
        }
      });
    });
  }
  window.addEventListener('load', setupCofradias);
})();
