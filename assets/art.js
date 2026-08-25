/* ============================================================
   mahbub.se : art.js
   One continuous dream per sitting.

   The children's emergence (art.css) belongs to the visit, not
   to any single page. The first document of a sitting records
   when the dream was born; every later document works out how
   long it has been dreaming.

     still inside the dream   the animation resumes mid-flight
                              through a negative delay, so both
                              children stay in step across a
                              page change
     past it                  <html> is marked .dreamt and the
                              CSS shows the receded art from the
                              first frame

   sessionStorage dies with the tab, so a genuinely new visit is
   always born in fog. If storage is unavailable (some private
   modes) every page simply dreams from the start, which is the
   old behaviour and harmless.

   WHERE IT GOES
   In <head>, after the art.css <link>, with no defer and no
   async. Two reasons: it must run before the first paint or you
   get a flash of settled art, and it reads --art-dur out of the
   stylesheet, which has to have loaded first. A script that
   follows a stylesheet waits for it, so the plain ordering is
   enough.

   NO MORE TWO-PLACE EDITS
   The duration is not written here. It is read from --art-dur,
   whatever the active breakpoint has set it to, which means the
   phone's four seconds and the laptop's ten both work with no
   constant to keep in sync. Change the CSS and this follows.
   The one edge: resizing across the 1280px line mid-dream keeps
   the duration read at load. It self-corrects on the next page.
   ============================================================ */
(function(){
  var root = document.documentElement;
  var KEY  = 'mahbub-dream-born';

  /* --art-dur as milliseconds. Accepts "10s" or "400ms". */
  function dreamMs(){
    try{
      var v = getComputedStyle(root).getPropertyValue('--art-dur').trim();
      var n = parseFloat(v);
      if(!isFinite(n) || n <= 0) return 10000;
      return v.indexOf('ms') > -1 ? n : n * 1000;
    }catch(_){ return 10000; }
  }

  function settle(){
    var span = dreamMs();
    try{
      var born = Number(sessionStorage.getItem(KEY));
      if(!born){
        born = Date.now();
        sessionStorage.setItem(KEY, String(born));
      }
      var elapsed = Date.now() - born;
      if(elapsed >= span){
        root.classList.add('dreamt');
      }else if(elapsed > 0){
        root.style.setProperty('--dream-offset', (-elapsed / 1000) + 's');
      }
    }catch(_){ /* storage unavailable: every page dreams, as before */ }
  }

  settle();

  /* Back/forward cache guard: Safari and Chrome on macOS often
     restore a page from memory instead of reloading it, so the
     call above never re-runs. pageshow fires on every return, so
     re-check the clock and settle the art if the dream finished
     in the meantime. */
  window.addEventListener('pageshow', settle);
})();
