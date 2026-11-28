// INSECURE: reads a value from the URL fragment (#msg=...) and writes it into the page
// with innerHTML -> DOM-based XSS. The fragment is never sent to the server,
// so server-side filtering and logging cannot see this attack.
(function () {
  const hash = window.location.hash;
  if (!hash.startsWith('#msg=')) return;

  const msg = decodeURIComponent(hash.substring(5));
  const banner = document.getElementById('banner');
  banner.innerHTML = msg;
  banner.style.display = 'block';
})();