/* PWA bootstrap — registers the service worker (HTTPS/localhost only; file:// no-ops).
   Loaded by every page; sw.js lives at the site root. */
(function(){
  if(!("serviceWorker" in navigator)) return;
  if(location.protocol!=="https:"&&location.hostname!=="localhost"&&location.hostname!=="127.0.0.1") return;
  var swPath=location.pathname.indexOf("/lessons/")>=0?"../sw.js":"./sw.js";
  window.addEventListener("load",function(){
    navigator.serviceWorker.register(swPath).catch(function(){/* offline install is best-effort */});
  });
})();
