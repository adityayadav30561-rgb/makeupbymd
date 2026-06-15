/* Shared site behaviour: mobile nav, reveal-on-scroll, active link */
(function () {
  // mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
      toggle.textContent = mobileNav.classList.contains('open') ? '\u2715' : '\u2630';
    });
  }

  // reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // image fallback: hide broken imgs, parent keeps its gradient
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () { img.style.display = 'none'; });
  });

  // mobile carousels: build dot indicators, sync active dot to scroll position
  document.querySelectorAll('.m-carousel').forEach(function (car) {
    var slides = [].slice.call(car.children);
    if (slides.length < 2) return;

    var dots = document.createElement('div');
    dots.className = 'm-dots';
    slides.forEach(function (slide, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to item ' + (i + 1));
      b.addEventListener('click', function () {
        car.scrollTo({ left: slide.offsetLeft - car.offsetLeft, behavior: 'smooth' });
      });
      dots.appendChild(b);
    });
    car.parentNode.insertBefore(dots, car.nextSibling);

    var btns = [].slice.call(dots.children);
    function sync() {
      var center = car.scrollLeft + car.clientWidth / 2;
      var best = 0, bestDist = Infinity;
      slides.forEach(function (slide, i) {
        var sc = slide.offsetLeft - car.offsetLeft + slide.offsetWidth / 2;
        var d = Math.abs(sc - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      btns.forEach(function (b, i) { b.classList.toggle('active', i === best); });
    }
    var ticking = false;
    car.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { sync(); ticking = false; });
    });
    sync();
  });
})();
